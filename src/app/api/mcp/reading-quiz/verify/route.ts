// POST /api/mcp/reading-quiz/verify — checks one reading-quiz choice.
// The signed-in parent is checked before the body is read.
//
// The correct choice numbers are read from:
//   quiz_sessions/{sessionId}/activeQuiz/current
// A right choice gets praise. A wrong choice gets the stored hint.
// The correct choice number is never sent back.
// The note is deleted only after all 3 questions have been gotten right,
// so a wrong choice can be tried again.

import { type NextRequest } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { readingQuizVerifyRatelimit } from '@/lib/upstash/ratelimit';
import type { ApiResult, ReadingQuizVerifyRequest, ReadingQuizVerifyResponse } from '@/types';

/** File name under the activeQuiz folder. Same note the quiz route writes. */
const ACTIVE_QUIZ_DOC_ID = 'current';

/** Praise that does not name a choice number. */
const CORRECT_FEEDBACK = 'Yes! That matches the story.';

/** Used when the note has no hint text. It does not name a choice number. */
const FALLBACK_HINT = 'Read the story one more time, then try a different choice.';

/** Shown when the note is missing, expired, or belongs to someone else. */
const QUIZ_GONE = 'This quiz is no longer available. Please start a new one.';

/** True when value is a plain object, not an array or null. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** True for a whole number 0, 1, or 2. */
function isChoiceIndex(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 2;
}

/** Reads the three stored choice numbers. Returns null when the shape is wrong. */
function readAnswers(value: unknown): [number, number, number] | null {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const [first, second, third] = value;
  if (!isChoiceIndex(first) || !isChoiceIndex(second) || !isChoiceIndex(third)) return null;
  return [first, second, third];
}

/** Reads hint strings. Missing entries become empty strings. */
function readHints(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item.trim() : ''));
}

/** Reads question indexes already gotten right. */
function readSolved(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isChoiceIndex);
}

/** Milliseconds for a Firestore timestamp, or null when the field is unusable. */
function expiryMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
}

/** True if the payload still has the server-only field names. */
function responseLeaksAnswers(payload: ReadingQuizVerifyResponse): boolean {
  const serialized = JSON.stringify(payload);
  return serialized.includes('"correctIndex"') || serialized.includes('"answers"');
}

/** Checks one quiz choice. The correct choice number stays on the server. */
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

  // ── 2. Rate limit — 60 answer checks per parent per hour ─────────────────
  // Own bucket, separate from quiz creation. A Redis error fail-opens.
  // The catch stays empty so a connection error cannot print the address.
  if (readingQuizVerifyRatelimit !== null) {
    try {
      const { success } = await readingQuizVerifyRatelimit.limit(parentUID);
      if (!success) {
        return Response.json(
          {
            success: false,
            error: 'Too many quiz answers. Please wait a bit before the next one.',
          } satisfies ApiResult<never>,
          { status: 429 },
        );
      }
    } catch {
      // Upstash connection error — fail open, allow the request through.
    }
  }

  // ── 3. Parse and validate request body ───────────────────────────────────
  let body: ReadingQuizVerifyRequest;
  try {
    body = (await request.json()) as ReadingQuizVerifyRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId, questionIndex, selectedOption } = body;

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

  if (!isChoiceIndex(questionIndex)) {
    return Response.json(
      { success: false, error: 'questionIndex must be 0, 1, or 2.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (!isChoiceIndex(selectedOption)) {
    return Response.json(
      { success: false, error: 'selectedOption must be 0, 1, or 2.' } satisfies ApiResult<never>,
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
  const quizNoteRef = adminDb
    .collection('quiz_sessions')
    .doc(trimmedSessionId)
    .collection('activeQuiz')
    .doc(ACTIVE_QUIZ_DOC_ID);

  let answers: [number, number, number];
  let hintText = FALLBACK_HINT;
  let solved: number[];

  try {
    const noteSnap = await quizNoteRef.get();
    if (!noteSnap.exists) {
      return Response.json({ success: false, error: QUIZ_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    const note = noteSnap.data();
    if (!isRecord(note) || note.parentUID !== parentUID) {
      return Response.json({ success: false, error: QUIZ_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    const expiresAt = expiryMillis(note.expiresAt);
    if (expiresAt === null || expiresAt <= Date.now()) {
      return Response.json({ success: false, error: QUIZ_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    const parsedAnswers = readAnswers(note.answers);
    if (parsedAnswers === null) {
      return Response.json({ success: false, error: QUIZ_GONE } satisfies ApiResult<never>, {
        status: 404,
      });
    }

    answers = parsedAnswers;
    solved = readSolved(note.solvedQuestionIndexes);
    const hints = readHints(note.hints);
    const storedHint = hints[questionIndex];
    if (storedHint !== undefined && storedHint.length > 0) {
      hintText = storedHint;
    }
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load the reading quiz.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const isCorrect = answers[questionIndex] === selectedOption;
  const responseData: ReadingQuizVerifyResponse = isCorrect
    ? { correct: true, feedback: CORRECT_FEEDBACK }
    : { correct: false, hint: hintText };

  if (responseLeaksAnswers(responseData)) {
    return Response.json(
      {
        success: false,
        error: 'Failed to check that answer. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // A wrong choice stays unsolved so the child can try that question again.
  // The note is removed only when questions 0, 1, and 2 are all solved.
  if (isCorrect) {
    const solvedSet = new Set(solved);
    solvedSet.add(questionIndex);
    const allSolved = solvedSet.has(0) && solvedSet.has(1) && solvedSet.has(2);

    try {
      if (allSolved) {
        await quizNoteRef.delete();
      } else {
        await quizNoteRef.update({
          solvedQuestionIndexes: FieldValue.arrayUnion(questionIndex),
        });
      }
    } catch {
      return Response.json(
        {
          success: false,
          error: 'Could not save that answer. Please try again.',
        } satisfies ApiResult<never>,
        { status: 500 },
      );
    }
  }

  return Response.json({
    success: true,
    data: responseData,
  } satisfies ApiResult<ReadingQuizVerifyResponse>);
}
