// POST /api/session/start — Creates a new tutoring session in Firestore.
// Called when the child picks a subject in the chat screen.
// All session data is stored under the parent UID (COPPA: no child accounts).
//
// Request body: { characterType, characterName, subject }
// Response:     { success: true, data: { sessionId } }

import { type NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import type { ApiResult, SessionStartRequest, SessionStartResponse } from '@/types';

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
  let body: SessionStartRequest;
  try {
    body = (await request.json()) as SessionStartRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { characterType, characterName, subject } = body;

  if (
    typeof characterType !== 'string' ||
    characterType.trim().length === 0 ||
    typeof characterName !== 'string' ||
    (subject !== 'math' && subject !== 'reading')
  ) {
    return Response.json(
      {
        success: false,
        error:
          'Required fields: characterType (string), characterName (string), subject ("math"|"reading").',
      } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Create session document in Firestore ───────────────────────────────
  // Auto-generated document ID becomes the sessionId returned to the client.
  try {
    const sessionsRef = adminDb.collection('users').doc(parentUID).collection('sessions');
    const sessionRef = sessionsRef.doc();

    await sessionRef.set({
      parentUID,
      characterType: characterType.trim(),
      // Empty string is valid — child may not enter a name; UI falls back to default
      characterName: characterName.trim(),
      subject,
      startedAt: FieldValue.serverTimestamp(),
      messageCount: 0,
      starsEarned: 0,
    });

    const responseData: SessionStartResponse = { sessionId: sessionRef.id };
    return Response.json({
      success: true,
      data: responseData,
    } satisfies ApiResult<SessionStartResponse>);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to create session.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }
}
