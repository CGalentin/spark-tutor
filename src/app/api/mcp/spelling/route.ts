// POST /api/mcp/spelling — builds a short list of grade-appropriate spelling words.
// The signed-in parent is checked before the body is read.
//
// The real spellings are saved only here:
//   quiz_sessions/{sessionId}/activeSpelling/current
// Firestore paths alternate folder, file, folder, file. The plan's path ends on
// the activeSpelling folder, so the note itself is the file named "current".
// A new list for the same session replaces that note.
// The spellings are never copied into the JSON sent back to the browser.

import { type NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { getAnthropicClient } from '@/lib/claude/client';
import { spellingRatelimit } from '@/lib/upstash/ratelimit';
import { isGradeBand } from '@/constants/gradeBands';
import type { ApiResult, SpellingRequest, SpellingResponse, SpellingWord } from '@/types';

/** One sitting is long enough. A later check can ignore a note past this time. */
const SPELLING_NOTE_TTL_MS = 2 * 60 * 60 * 1000;

/** File name under the activeSpelling folder. Firestore needs this extra segment. */
const ACTIVE_SPELLING_DOC_ID = 'current';

/** Keeps a pasted topic from taking over the whole prompt. */
const MAX_TOPIC_LENGTH = 120;

/** Spelling words stay short enough for K–3 and long enough to not hide in a JSON key. */
const MIN_WORD_LENGTH = 3;

/** Upper bound so a runaway model reply cannot store a paragraph as a "word". */
const MAX_WORD_LENGTH = 12;

/**
 * Structured generator, not the child chat, so the temperature is lower than 0.7.
 * That keeps the JSON shape steady.
 */
const SPELLING_TEMPERATURE = 0.4;

/**
 * Every spelling reply includes these keys. A word that sits inside them would
 * show up in the HTTP body even when the clue and hint are clean.
 */
const REPLY_WRAPPER =
  '{"success":true,"data":{"words":[{"clue":"","lettercount":0,"hint":""}]}}' +
  '{"correct":false,"feedback":""}';

const SPELLING_SYSTEM_PROMPT = `
You write spelling words for one child in kindergarten through grade 3.

Rules:
- Write exactly the requested count of words. The count is 3, 4, or 5.
- Each word is one English word made only of letters.
- Kindergarten: 3 or 4 letters, a familiar thing the child can sound out.
- Grade 1: 3 to 5 letters.
- Grade 2: 4 to 6 letters.
- Grade 3: 5 to 8 letters.
- The clue describes the word. It must not contain the word, even inside a longer word.
- The hint nudges the child. It must not contain the word, even inside a longer word.
- Different capital letters, spaces, and hyphens still count as containing the word.
- letterCount is the number of letters in the word, nothing else.
- Stay on the topic. No personal questions. No scary content.
- Do not pick words that are part of these labels: success, data, words, clue, hint,
  letter, count, correct, feedback, true, false.

Respond ONLY with valid JSON. No markdown. No extra text.
{
  "words": [
    {
      "word": "the spelling",
      "clue": "a clue that does not contain the spelling",
      "letterCount": 3,
      "hint": "a gentle nudge that does not contain the spelling"
    }
  ]
}
`.trim();

/** One word as Claude returns it, including the server-only spelling. */
interface GeneratedSpellingWord {
  word: string;
  clue: string;
  letterCount: number;
  hint: string;
}

/** True when value is a plain object, not an array or null. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** True for a whole number 3, 4, or 5. */
function isSpellingCount(value: unknown): value is 3 | 4 | 5 {
  return value === 3 || value === 4 || value === 5;
}

/** True when text contains the spelling, including spaced or hyphenated letters. */
function textContainsWord(text: string, word: string): boolean {
  const needle = word.trim().toLowerCase();
  if (needle.length === 0) return true;
  if (text.toLowerCase().includes(needle)) return true;

  // "c a t" and "c-a-t" still reveal the spelling even though the letters are split.
  const separated = needle
    .split('')
    .map((letter) => letter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^a-z]+');
  return new RegExp(`(?:^|[^a-z])${separated}(?:$|[^a-z])`, 'i').test(text);
}

/** True when the spelling would show up in the fixed JSON keys around the list. */
function wrapperContainsWord(word: string): boolean {
  return REPLY_WRAPPER.includes(word.trim().toLowerCase());
}

/** Reads one word. Returns null when the spelling shows up in the clue or the hint. */
function parseGeneratedWord(value: unknown): GeneratedSpellingWord | null {
  if (!isRecord(value)) return null;

  const { word, clue, letterCount, hint } = value;

  if (typeof word !== 'string' || typeof clue !== 'string' || typeof hint !== 'string') {
    return null;
  }

  const trimmedWord = word.trim();
  const trimmedClue = clue.trim();
  const trimmedHint = hint.trim();

  if (!/^[A-Za-z]+$/.test(trimmedWord)) return null;
  if (trimmedWord.length < MIN_WORD_LENGTH || trimmedWord.length > MAX_WORD_LENGTH) return null;
  if (trimmedClue.length === 0 || trimmedHint.length === 0) return null;
  if (typeof letterCount !== 'number' || !Number.isInteger(letterCount)) return null;
  if (letterCount !== trimmedWord.length) return null;
  if (wrapperContainsWord(trimmedWord)) return null;
  if (textContainsWord(trimmedClue, trimmedWord)) return null;
  if (textContainsWord(trimmedHint, trimmedWord)) return null;

  return {
    word: trimmedWord,
    clue: trimmedClue,
    letterCount,
    hint: trimmedHint,
  };
}

/** Pulls the word list out of Claude's text. Returns null when the shape is wrong. */
function parseGeneratedList(text: string, count: number): GeneratedSpellingWord[] | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (match === null) return null;

  try {
    const parsed = JSON.parse(match[0]) as unknown;
    if (!isRecord(parsed) || !Array.isArray(parsed.words)) return null;
    if (parsed.words.length !== count) return null;

    const words: GeneratedSpellingWord[] = [];
    const seen = new Set<string>();

    for (const item of parsed.words) {
      const generated = parseGeneratedWord(item);
      if (generated === null) return null;

      const key = generated.word.toLowerCase();
      if (seen.has(key)) return null;
      seen.add(key);
      words.push(generated);
    }

    return words;
  } catch {
    return null;
  }
}

/** Builds the browser payload. Spellings are left out on purpose. */
function toClientList(words: GeneratedSpellingWord[]): SpellingResponse {
  const clientWords: SpellingWord[] = words.map((item) => ({
    clue: item.clue,
    letterCount: item.letterCount,
    hint: item.hint,
  }));

  return { words: clientWords };
}

/** True if the payload still contains a spelling or the server-only field name. */
function responseLeaksWords(list: SpellingResponse, secretWords: string[]): boolean {
  const serialized = JSON.stringify({ success: true, data: list }).toLowerCase();
  if (serialized.includes('"word"')) return true;
  return secretWords.some((secret) => serialized.includes(secret.toLowerCase()));
}

/** Builds a spelling list for a signed-in parent. The spellings stay on the server. */
export async function POST(request: NextRequest): Promise<Response> {
  // ── 1. Verify Firebase Auth token before the body is read ───────────────
  let parentUID: string;
  try {
    parentUID = await verifyAuthToken(request.headers.get('Authorization'));
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message } satisfies ApiResult<never>,
      { status: 401 },
    );
  }

  // ── 2. Rate limit — 30 spelling lists per parent per hour ────────────────
  // spellingRatelimit is null when Upstash env vars are absent (fail-open).
  // A Redis error also fail-opens. The catch stays empty so a connection
  // error cannot print the Redis address or token.
  // This runs before the body is read so a blocked parent never pays for Claude.
  if (spellingRatelimit !== null) {
    try {
      const { success } = await spellingRatelimit.limit(parentUID);
      if (!success) {
        return Response.json(
          {
            success: false,
            error: 'Too many spelling lists. Please wait a bit before the next one.',
          } satisfies ApiResult<never>,
          { status: 429 },
        );
      }
    } catch {
      // Upstash connection error — fail open, allow the request through.
    }
  }

  // ── 3. Parse and validate request body ───────────────────────────────────
  let body: SpellingRequest;
  try {
    body = (await request.json()) as SpellingRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId, grade, topic, count } = body;

  if (typeof sessionId !== 'string') {
    return Response.json(
      { success: false, error: 'sessionId is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const trimmedSessionId = sessionId.trim();
  if (
    trimmedSessionId.length === 0 ||
    trimmedSessionId.length > 128 ||
    trimmedSessionId.includes('/')
  ) {
    return Response.json(
      { success: false, error: 'sessionId is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (!isGradeBand(grade)) {
    return Response.json(
      { success: false, error: 'grade must be K, 1, 2, or 3.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (typeof topic !== 'string') {
    return Response.json(
      { success: false, error: 'topic is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const safeTopic = topic.trim().replace(/\s+/g, ' ');
  if (safeTopic.length === 0) {
    return Response.json(
      { success: false, error: 'topic is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (safeTopic.length > MAX_TOPIC_LENGTH) {
    return Response.json(
      {
        success: false,
        error: 'topic must be 120 characters or fewer.',
      } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (!isSpellingCount(count)) {
    return Response.json(
      { success: false, error: 'count must be 3, 4, or 5.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 4. Confirm the session exists under this parent ──────────────────────
  // Claude is not called for a session this parent does not own.
  const sessionRef = adminDb
    .collection('users')
    .doc(parentUID)
    .collection('sessions')
    .doc(trimmedSessionId);

  try {
    const sessionSnap = await sessionRef.get();
    if (!sessionSnap.exists) {
      return Response.json(
        { success: false, error: 'Session not found.' } satisfies ApiResult<never>,
        { status: 404 },
      );
    }
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load session.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 5. Ask Claude for the words ──────────────────────────────────────────
  let generated: GeneratedSpellingWord[];
  try {
    const anthropic = getAnthropicClient();
    const spellingRequest = [
      `Grade: ${grade}`,
      `Topic: ${safeTopic}`,
      `Write exactly ${count} spelling words.`,
    ].join('\n');

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      temperature: SPELLING_TEMPERATURE,
      system: SPELLING_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: spellingRequest,
        },
      ],
    });

    const responseText =
      claudeResponse.content[0]?.type === 'text' ? claudeResponse.content[0].text : '';
    const parsed = parseGeneratedList(responseText, count);

    if (parsed === null) {
      return Response.json(
        {
          success: false,
          error: 'The spelling list did not come back in the right shape. Please try again.',
        } satisfies ApiResult<never>,
        { status: 500 },
      );
    }

    generated = parsed;
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Failed to build a spelling list. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const clientList = toClientList(generated);
  const secretWords = generated.map((item) => item.word);
  if (responseLeaksWords(clientList, secretWords)) {
    return Response.json(
      {
        success: false,
        error: 'Failed to build a spelling list. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 6. Save the spellings where the browser cannot read them ─────────────
  const spellingNoteRef = adminDb
    .collection('quiz_sessions')
    .doc(trimmedSessionId)
    .collection('activeSpelling')
    .doc(ACTIVE_SPELLING_DOC_ID);

  try {
    await spellingNoteRef.set({
      words: secretWords,
      hints: generated.map((item) => item.hint),
      expiresAt: Timestamp.fromMillis(Date.now() + SPELLING_NOTE_TTL_MS),
      parentUID,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Could not save the spelling list. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
    data: clientList,
  } satisfies ApiResult<SpellingResponse>);
}
