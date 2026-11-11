// POST /api/mcp/spelling/verify — checks one spelling attempt.
// The signed-in parent is checked before the body is read.
//
// The spellings are read from:
//   quiz_sessions/{sessionId}/activeSpelling/current
// A right attempt gets praise. A wrong attempt gets a hint.
// The spelling is never sent back, including inside the feedback.
// The note stays in place so a wrong try can be tried again.
// This route does not read or write the reading-quiz note.

import { type NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { spellingVerifyRatelimit } from '@/lib/upstash/ratelimit';
import type { ApiResult, SpellingVerifyRequest, SpellingVerifyResponse } from '@/types';

/** File name under the activeSpelling folder. Same note the spelling route writes. */
const ACTIVE_SPELLING_DOC_ID = 'current';

/** Largest word index. A list has 3, 4, or 5 words, so the last index is 4. */
const MAX_WORD_INDEX = 4;

/** Stops a huge pasted attempt from being compared. */
const MAX_ATTEMPT_LENGTH = 40;

/** Praise lines that do not name a spelling. The first safe one is used. */
const PRAISE_LINES = ['Nice work.', 'That is right.', 'You got it.'];

/** Used when the stored hint would reveal the spelling. */
const FALLBACK_HINTS = [
  'Listen again and try once more.',
  'Give it another go.',
  'Look at the clue and guess again.',
];

/** Shown when the note is missing, expired, or belongs to someone else. */
const LIST_GONE = 'This spelling list is no longer available. Please start a new one.';

/** True when value is a plain object, not an array or null. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** True for a whole number from 0 through 4. */
function isWordIndex(value: unknown): value is number {
  return (
    typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= MAX_WORD_INDEX
  );
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

/** Reads the stored spellings. Returns null when the shape is wrong. */
function readWords(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length < 3 || value.length > 5) return null;

  const words: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') return null;
    const trimmed = item.trim();
    if (!/^[A-Za-z]+$/.test(trimmed)) return null;
    words.push(trimmed);
  }

  return words;
}

/** Reads hint strings. Missing entries become empty strings. */
function readHints(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item.trim() : ''));
}

/** Milliseconds for a Firestore timestamp, or null when the field is unusable. */
function expiryMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
}

/** First line that does not contain the spelling, or null when every line does. */
function firstSafeLine(lines: string[], word: string): string | null {
  for (const line of lines) {
    if (!textContainsWord(line, word)) return line;
  }
  return null;
}

/** True if the HTTP body still contains the spelling as consecutive letters. */
function responseLeaksWord(payload: SpellingVerifyResponse, word: string): boolean {
  const serialized = JSON.stringify({ success: true, data: payload }).toLowerCase();
  return serialized.includes(word.trim().toLowerCase());
}

/** Checks one spelling attempt. The spelling stays on the server. */
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

  // ── 2. Rate limit — 60 spelling checks per parent per hour ───────────────
  // Own bucket, separate from spelling-list creation. A Redis error fail-opens.
  // The catch stays empty so a connection error cannot print the address.
  if (spellingVerifyRatelimit !== null) {
    try {
      const { success } = await spellingVerifyRatelimit.limit(parentUID);
      if (!success) {
        return Response.json(
          {
            success: false,
            error: 'Too many spelling checks. Please wait a bit before the next one.',
          } satisfies ApiResult<never>,
          { status: 429 },
        );
      }
    } catch {
      // Upstash connection error — fail open, allow the request through.
    }
  }

  // ── 3. Parse and validate request body ───────────────────────────────────
  let body: SpellingVerifyRequest;
  try {
    body = (await request.json()) as SpellingVerifyRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId, wordIndex, attempt } = body;

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

  if (!isWordIndex(wordIndex)) {
    return Response.json(
      { success: false, error: 'wordIndex must be 0, 1, 2, 3, or 4.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (typeof attempt !== 'string') {
    return Response.json(
      { success: false, error: 'attempt is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const trimmedAttempt = attempt.trim();
  if (trimmedAttempt.length === 0 || trimmedAttempt.length > MAX_ATTEMPT_LENGTH) {
    return Response.json(
      { success: false, error: 'attempt is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 4. Confirm the session exists under this parent ──────────────────────
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

  // ── 5. Read the server-only note ─────────────────────────────────────────
  const spellingNoteRef = adminDb
    .collection('quiz_sessions')
    .doc(trimmedSessionId)
    .collection('activeSpelling')
    .doc(ACTIVE_SPELLING_DOC_ID);

  let secretWord = '';
  let hintText = '';

  try {
    const noteSnap = await spellingNoteRef.get();
    if (!noteSnap.exists) {
      return Response.json({ success: false, error: LIST_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    const note = noteSnap.data();
    if (!isRecord(note) || note.parentUID !== parentUID) {
      return Response.json({ success: false, error: LIST_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    const expiresAt = expiryMillis(note.expiresAt);
    if (expiresAt === null || expiresAt <= Date.now()) {
      return Response.json({ success: false, error: LIST_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    const words = readWords(note.words);
    if (words === null) {
      return Response.json({ success: false, error: LIST_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    if (wordIndex >= words.length) {
      return Response.json(
        { success: false, error: 'wordIndex is out of range.' } satisfies ApiResult<never>,
        { status: 400 },
      );
    }

    secretWord = words[wordIndex] ?? '';
    const hints = readHints(note.hints);
    hintText = hints[wordIndex] ?? '';
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load the spelling list.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const isCorrect = trimmedAttempt.toLowerCase() === secretWord.toLowerCase();
  const feedback = isCorrect
    ? firstSafeLine(PRAISE_LINES, secretWord)
    : firstSafeLine(
        hintText.length > 0 ? [hintText, ...FALLBACK_HINTS] : FALLBACK_HINTS,
        secretWord,
      );

  if (feedback === null) {
    return Response.json(
      {
        success: false,
        error: 'Failed to check that spelling. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const responseData: SpellingVerifyResponse = { correct: isCorrect, feedback };

  if (responseLeaksWord(responseData, secretWord)) {
    return Response.json(
      {
        success: false,
        error: 'Failed to check that spelling. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // The note stays so a later try, right or wrong, can use the same list.
  // This route does not write solved indexes, and it does not touch activeQuiz.
  return Response.json({
    success: true,
    data: responseData,
  } satisfies ApiResult<SpellingVerifyResponse>);
}
