// POST /api/session/star — Increments the starsEarned count for an active session.
// Called by useStars when Claude emits a [STAR EARNED] signal in the chat stream.
// Uses Admin SDK to write server-side — never exposed directly to the browser.

import { type NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import type { ApiResult } from '@/types';

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

  // ── 2. Parse request body ─────────────────────────────────────────────────
  let sessionId: string;
  try {
    const body = (await request.json()) as { sessionId?: unknown };
    if (typeof body.sessionId !== 'string' || body.sessionId.trim().length === 0) {
      throw new Error('sessionId is required.');
    }
    sessionId = body.sessionId;
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Increment star count in Firestore ──────────────────────────────────
  try {
    const sessionRef = adminDb
      .collection('users')
      .doc(parentUID)
      .collection('sessions')
      .doc(sessionId);

    await sessionRef.update({ starsEarned: FieldValue.increment(1) });

    return Response.json({ success: true, data: null } satisfies ApiResult<null>);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to update star count.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }
}
