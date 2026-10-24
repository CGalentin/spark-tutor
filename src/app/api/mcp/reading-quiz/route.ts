// POST /api/mcp/reading-quiz — builds a short reading passage and 3 questions.
// The signed-in parent is checked before the body is read.
//
// Correct option numbers are saved only here:
//   quiz_sessions/{sessionId}/activeQuiz/current
// Firestore paths alternate folder, file, folder, file. The plan's path ends on
// the activeQuiz folder, so the note itself is the file named "current".
// The note also keeps each hint and which questions are already solved.
// That note is never copied into the JSON sent back to the browser.

import { type NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { getAnthropicClient } from '@/lib/claude/client';
import { readingQuizRatelimit } from '@/lib/upstash/ratelimit';
import { isGradeBand } from '@/constants/gradeBands';
import type { ApiResult, QuizQuestion, ReadingQuizRequest, ReadingQuizResponse } from '@/types';

/** One sitting is long enough. A later check can ignore a note past this time. */
const QUIZ_NOTE_TTL_MS = 2 * 60 * 60 * 1000;

/** File name under the activeQuiz folder. Firestore needs this extra segment. */
const ACTIVE_QUIZ_DOC_ID = 'current';

/** Keeps a pasted topic from taking over the whole prompt. */
const MAX_TOPIC_LENGTH = 120;

/**
 * Structured generator, not the child chat, so the temperature is lower than 0.7.
 * That keeps the JSON shape steady.
 */
const READING_QUIZ_TEMPERATURE = 0.4;

const READING_QUIZ_SYSTEM_PROMPT = `
You write a short reading quiz for one child in kindergarten through grade 3.

Rules:
- The passage matches the grade and the topic.
- Kindergarten: 2 or 3 very short sentences and everyday words.
- Grade 1: 3 or 4 short sentences.
- Grade 2: one short paragraph of about 4 sentences.
- Grade 3: one short paragraph of about 5 sentences.
- Write exactly 3 questions about that passage.
- Each question has exactly 3 short answer choices.
- correctIndex is 0, 1, or 2. 0 means the first choice.
- The hint nudges the child without saying which choice is right.
- Do not put the correct index in the passage, question, choices, or hint.
- Stay on the topic. No personal questions. No scary content.

Respond ONLY with valid JSON. No markdown. No extra text.
{
  "passage": "the short passage",
  "questions": [
    {
      "question": "a question about the passage",
      "options": ["first choice", "second choice", "third choice"],
      "hint": "a gentle nudge that does not reveal the answer",
      "correctIndex": 0
    }
  ]
}
`.trim();

/** One question as Claude returns it, including the server-only choice number. */
interface GeneratedQuestion {
  question: string;
  options: [string, string, string];
  hint: string;
  correctIndex: number;
}

/** Full quiz from Claude, before the choice numbers are removed. */
interface GeneratedQuiz {
  passage: string;
  questions: GeneratedQuestion[];
}

/** True when value is a plain object, not an array or null. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads one question. Returns null unless it has 3 choices and a choice number 0, 1, or 2. */
function parseGeneratedQuestion(value: unknown): GeneratedQuestion | null {
  if (!isRecord(value)) return null;

  const { question, options, hint, correctIndex } = value;

  if (typeof question !== 'string' || question.trim().length === 0) return null;
  if (typeof hint !== 'string' || hint.trim().length === 0) return null;
  if (!Array.isArray(options) || options.length !== 3) return null;

  const [first, second, third] = options;
  if (typeof first !== 'string' || first.trim().length === 0) return null;
  if (typeof second !== 'string' || second.trim().length === 0) return null;
  if (typeof third !== 'string' || third.trim().length === 0) return null;

  if (typeof correctIndex !== 'number' || !Number.isInteger(correctIndex)) return null;
  if (correctIndex < 0 || correctIndex > 2) return null;

  return {
    question: question.trim(),
    options: [first.trim(), second.trim(), third.trim()],
    hint: hint.trim(),
    correctIndex,
  };
}

/** Pulls the quiz JSON out of Claude's text. Returns null when the shape is wrong. */
function parseGeneratedQuiz(text: string): GeneratedQuiz | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (match === null) return null;

  try {
    const parsed = JSON.parse(match[0]) as unknown;
    if (!isRecord(parsed)) return null;
    if (typeof parsed.passage !== 'string' || parsed.passage.trim().length === 0) return null;
    if (!Array.isArray(parsed.questions) || parsed.questions.length !== 3) return null;

    const questions: GeneratedQuestion[] = [];
    for (const item of parsed.questions) {
      const question = parseGeneratedQuestion(item);
      if (question === null) return null;
      questions.push(question);
    }

    return {
      passage: parsed.passage.trim(),
      questions,
    };
  } catch {
    return null;
  }
}

/** Builds the browser payload. Correct choice numbers are left out on purpose. */
function toClientQuiz(quiz: GeneratedQuiz): ReadingQuizResponse {
  const questions: QuizQuestion[] = quiz.questions.map((item) => ({
    question: item.question,
    options: [item.options[0], item.options[1], item.options[2]],
    hint: item.hint,
  }));

  return {
    passage: quiz.passage,
    questions,
  };
}

/** True if the payload still has the server-only field names. */
function responseLeaksAnswers(quiz: ReadingQuizResponse): boolean {
  const serialized = JSON.stringify(quiz);
  return serialized.includes('"correctIndex"') || serialized.includes('"answers"');
}

/** Builds a reading quiz for a signed-in parent. The correct choices stay on the server. */
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

  // ── 2. Rate limit — 30 quizzes per parent per hour ───────────────────────
  // readingQuizRatelimit is null when Upstash env vars are absent (fail-open).
  // A Redis error also fail-opens. The catch stays empty so a connection
  // error cannot print the Redis address or token.
  // This runs before the body is read so a blocked parent never pays for Claude.
  if (readingQuizRatelimit !== null) {
    try {
      const { success } = await readingQuizRatelimit.limit(parentUID);
      if (!success) {
        return Response.json(
          {
            success: false,
            error: 'Too many reading quizzes. Please wait a bit before the next one.',
          } satisfies ApiResult<never>,
          { status: 429 },
        );
      }
    } catch {
      // Upstash connection error — fail open, allow the request through.
    }
  }

  // ── 3. Parse and validate request body ───────────────────────────────────
  let body: ReadingQuizRequest;
  try {
    body = (await request.json()) as ReadingQuizRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId, grade, topic } = body;

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

  // ── 5. Ask Claude for the passage and questions ──────────────────────────
  let generated: GeneratedQuiz;
  try {
    const anthropic = getAnthropicClient();
    const quizRequest = [
      `Grade: ${grade}`,
      `Topic: ${safeTopic}`,
      'Write the passage and exactly 3 questions.',
    ].join('\n');

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      temperature: READING_QUIZ_TEMPERATURE,
      system: READING_QUIZ_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: quizRequest,
        },
      ],
    });

    const responseText =
      claudeResponse.content[0]?.type === 'text' ? claudeResponse.content[0].text : '';
    const parsed = parseGeneratedQuiz(responseText);

    if (parsed === null) {
      return Response.json(
        {
          success: false,
          error: 'The reading quiz did not come back in the right shape. Please try again.',
        } satisfies ApiResult<never>,
        { status: 500 },
      );
    }

    generated = parsed;
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Failed to build a reading quiz. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const clientQuiz = toClientQuiz(generated);
  if (responseLeaksAnswers(clientQuiz)) {
    return Response.json(
      {
        success: false,
        error: 'Failed to build a reading quiz. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 6. Save the choice numbers where the browser cannot read them ────────
  const answers = generated.questions.map((item) => item.correctIndex);
  const quizNoteRef = adminDb
    .collection('quiz_sessions')
    .doc(trimmedSessionId)
    .collection('activeQuiz')
    .doc(ACTIVE_QUIZ_DOC_ID);

  try {
    await quizNoteRef.set({
      answers,
      hints: generated.questions.map((item) => item.hint),
      solvedQuestionIndexes: [],
      expiresAt: Timestamp.fromMillis(Date.now() + QUIZ_NOTE_TTL_MS),
      parentUID,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Could not save the reading quiz. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
    data: clientQuiz,
  } satisfies ApiResult<ReadingQuizResponse>);
}
