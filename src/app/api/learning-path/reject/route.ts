// POST /api/learning-path/reject — Parent keeps the current topic.
// Clears the AI suggestion only. currentTopic, grade, and completed topics stay as they are.
// The child chat never calls this. The parent dashboard will (Sprint 4).
//
// Request body: { subject }
// Response:     { success: true, data: { rejected: true } }

import { type NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { getLearningPath, updateLearningPath } from '@/lib/firebase/learningPath';
import type { ApiResult, RejectTopicRequest, RejectTopicResponse, Subject } from '@/types';

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
  let body: RejectTopicRequest;
  try {
    body = (await request.json()) as RejectTopicRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { subject } = body;

  if (!isLearningSubject(subject)) {
    return Response.json(
      { success: false, error: 'subject must be "math" or "reading".' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Confirm a learning path exists before clearing the suggestion ─────
  try {
    const path = await getLearningPath(parentUID, subject);
    if (path === null) {
      return Response.json(
        {
          success: false,
          error: 'No learning path found for this subject. Start a session first.',
        } satisfies ApiResult<never>,
        { status: 404 },
      );
    }
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load the learning path.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 4. Drop the suggestion. Leave currentTopic untouched. ────────────────
  try {
    await updateLearningPath(parentUID, subject, {
      suggestedNextTopic: null,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Failed to reject the topic suggestion.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const responseData: RejectTopicResponse = {
    rejected: true,
  };

  return Response.json({
    success: true,
    data: responseData,
  } satisfies ApiResult<RejectTopicResponse>);
}
