// POST /api/learning-path/approve — Parent confirms the next topic.
// The evaluator may suggest a topic, but the child's current topic only changes here.
// The child chat never calls this. The parent dashboard will (Sprint 4).
//
// Request body: { subject, approvedTopic }
// Response:     { success: true, data: { approved: true, newTopic } }

import { type NextRequest } from 'next/server';
import { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { getLearningPath, updateLearningPath } from '@/lib/firebase/learningPath';
import type {
  ApiResult,
  ApproveTopicRequest,
  ApproveTopicResponse,
  LearningPath,
  Subject,
} from '@/types';

/** True when the value is a tutoring subject we store a learning path for. */
function isLearningSubject(value: unknown): value is Subject {
  return value === 'math' || value === 'reading';
}

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
  let body: ApproveTopicRequest;
  try {
    body = (await request.json()) as ApproveTopicRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { subject, approvedTopic } = body;

  if (!isLearningSubject(subject)) {
    return Response.json(
      { success: false, error: 'subject must be "math" or "reading".' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (typeof approvedTopic !== 'string' || approvedTopic.trim().length === 0) {
    return Response.json(
      { success: false, error: 'approvedTopic is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const nextTopic = approvedTopic.trim();

  // ── 3. Load the path so we can record the topic we are leaving ───────────
  let path: LearningPath | null;
  try {
    path = await getLearningPath(parentUID, subject);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load the learning path.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  if (path === null) {
    return Response.json(
      {
        success: false,
        error: 'No learning path found for this subject. Start a session first.',
      } satisfies ApiResult<never>,
      { status: 404 },
    );
  }

  // Only record the topic we are leaving. Skip it when the parent re-approves
  // the topic already in progress, and skip duplicates already in the list.
  const previousTopic = path.currentTopic;
  const topicsCompleted =
    previousTopic !== nextTopic && !path.topicsCompleted.includes(previousTopic)
      ? [...path.topicsCompleted, previousTopic]
      : path.topicsCompleted;

  // ── 4. Move the path onto the approved topic ─────────────────────────────
  try {
    await updateLearningPath(parentUID, subject, {
      currentTopic: nextTopic,
      parentApproved: true,
      parentApprovedAt: AdminTimestamp.now() as unknown as LearningPath['parentApprovedAt'],
      suggestedNextTopic: null,
      topicsCompleted,
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to approve the next topic.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const responseData: ApproveTopicResponse = {
    approved: true,
    newTopic: nextTopic,
  };

  return Response.json({
    success: true,
    data: responseData,
  } satisfies ApiResult<ApproveTopicResponse>);
}
