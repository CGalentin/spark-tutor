// POST /api/evaluate — Scores a child's mastery of one topic via Gemini Flash.
// Called at topic boundaries (PR 2-12 wires this from chat). Results are for the
// parent dashboard only — the child UI never displays this response.
//
// Request body: { sessionId, messages, topic, grade, subject }
// Response:     { success: true, data: { evaluated: true, result } }

import { type NextRequest } from 'next/server';
import { FieldValue, Timestamp as AdminTimestamp } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { saveMasteryResult, updateLearningPath } from '@/lib/firebase/learningPath';
import { evaluateMastery } from '@/lib/gemini/evaluate';
import { getTopics } from '@/constants/topicMap';
import { isGradeBand, type GradeBand } from '@/constants/gradeBands';
import type {
  ApiResult,
  EvaluateRequest,
  EvaluateResponse,
  EvaluationResult,
  Message,
  Subject,
  TopicMastery,
} from '@/types';

export async function POST(request: NextRequest): Promise<Response> {
  // ── 1. Verify Firebase Auth token ────────────────────────────────────────
  let parentUID: string;
  try {
    parentUID = await verifyAuthToken(request.headers.get('Authorization'));
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message } satisfies ApiResult<never>,
      { status: 401 },
    );
  }

  // ── 2. Parse and validate request body ───────────────────────────────────
  let body: EvaluateRequest;
  try {
    body = (await request.json()) as EvaluateRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId, messages, topic, grade, subject } = body;

  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return Response.json(
      { success: false, error: 'sessionId is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (typeof topic !== 'string' || topic.trim().length === 0) {
    return Response.json(
      { success: false, error: 'topic is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (!isGradeBand(grade)) {
    return Response.json(
      { success: false, error: 'grade must be K, 1, 2, or 3.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (subject !== 'math' && subject !== 'reading') {
    return Response.json(
      { success: false, error: 'subject must be "math" or "reading".' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (!Array.isArray(messages)) {
    return Response.json(
      { success: false, error: 'messages must be an array.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const sessionMessages: Message[] = messages;
  const trimmedTopic = topic.trim();

  // ── 3. Confirm the session exists under this parent ──────────────────────
  const sessionRef = adminDb
    .collection('users')
    .doc(parentUID)
    .collection('sessions')
    .doc(sessionId.trim());

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

  // ── 4. Score mastery with Gemini Flash ───────────────────────────────────
  let result: EvaluationResult;
  try {
    result = await evaluateMastery(sessionMessages, trimmedTopic, grade);
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Could not score this topic right now. Please try again.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // Curriculum next-topic when mastered. PR 2-13 will replace this helper
  // with src/lib/gemini/suggestNextTopic.ts (uses mastery history + next grade).
  if (result.mastered) {
    result = {
      ...result,
      suggestedNext: suggestNextTopic(subject, grade, trimmedTopic),
    };
  }

  // ── 5. Save the evaluation on the session doc (evaluations[]) ────────────
  try {
    await sessionRef.update({
      evaluations: FieldValue.arrayUnion({
        topic: result.topic,
        score: result.score,
        mastered: result.mastered,
        confidence: result.confidence,
        suggestedNext: result.suggestedNext,
        reasoning: result.reasoning,
      }),
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to save the evaluation.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 6. Append to the learning-path mastery history ───────────────────────
  const mastery: TopicMastery = {
    topic: trimmedTopic,
    subject,
    grade,
    score: result.score,
    mastered: result.mastered,
    evaluatedAt: AdminTimestamp.now() as unknown as TopicMastery['evaluatedAt'],
  };

  try {
    await saveMasteryResult(parentUID, subject, mastery);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to update the learning path.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 7. If mastered, suggest the next topic and wait for the parent ───────
  if (result.mastered) {
    try {
      await updateLearningPath(parentUID, subject, {
        suggestedNextTopic: result.suggestedNext,
        parentApproved: false,
      });
    } catch {
      return Response.json(
        {
          success: false,
          error: 'Failed to save the next-topic suggestion.',
        } satisfies ApiResult<never>,
        { status: 500 },
      );
    }
  }

  const responseData: EvaluateResponse = {
    evaluated: true,
    result,
  };

  return Response.json({
    success: true,
    data: responseData,
  } satisfies ApiResult<EvaluateResponse>);
}

/**
 * Picks the next topic in the current grade's curriculum list.
 * Returns null if this is the last topic (PR 2-13 will roll into the next grade).
 */
function suggestNextTopic(subject: Subject, grade: GradeBand, currentTopic: string): string | null {
  const topics = getTopics(subject, grade);
  const index = topics.indexOf(currentTopic);
  if (index === -1) {
    return topics[0] ?? null;
  }

  return topics[index + 1] ?? null;
}
