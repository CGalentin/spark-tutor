// POST /api/session/end — Marks an active session as ended in Firestore.
// Writes endedAt timestamp plus the final star and message counts.
// After updating Firestore the endpoint kicks off the agentic summary by calling /api/summary.

import { type NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import type { ApiResult, SessionEndRequest, SessionEndResponse } from '@/types';

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
  let body: SessionEndRequest;
  try {
    body = (await request.json()) as SessionEndRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId, starsEarned, messageCount, messages } = body;

  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return Response.json(
      { success: false, error: 'sessionId is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Mark session as ended in Firestore ─────────────────────────────────
  try {
    const sessionRef = adminDb
      .collection('users')
      .doc(parentUID)
      .collection('sessions')
      .doc(sessionId);

    await sessionRef.update({
      endedAt: FieldValue.serverTimestamp(),
      starsEarned: typeof starsEarned === 'number' ? starsEarned : 0,
      messageCount: typeof messageCount === 'number' ? messageCount : 0,
    });

    // ── 4. Trigger agentic summary (fire-and-forget) ──────────────────────
    // We don't await this — the summary generates asynchronously and the child
    // sees the "Great job!" screen immediately while Claude works in the background.
    const host = request.headers.get('host') ?? 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') ?? 'http';
    const summaryUrl = `${protocol}://${host}/api/summary`;
    const authHeader = request.headers.get('Authorization') ?? '';

    fetch(summaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ sessionId, parentUID, messages: messages ?? [] }),
    }).catch(() => {
      // Summary generation failure must not affect the session end response
    });

    const responseData: SessionEndResponse = { sessionId };
    return Response.json(
      { success: true, data: responseData } satisfies ApiResult<SessionEndResponse>,
    );
  } catch {
    return Response.json(
      { success: false, error: 'Failed to end session.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }
}
