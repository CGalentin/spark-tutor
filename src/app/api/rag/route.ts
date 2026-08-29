// POST /api/rag — RAG retrieval endpoint for Spark Tutor.
// Embeds the incoming query with Gemini, finds the top-3 most relevant
// curriculum chunks from Firestore using cosine similarity, and returns
// the chunk text strings for injection into the Claude system prompt.
//
// Called internally by /api/chat before building the system prompt.
// Requires a valid Firebase Auth token (same parent token used by /api/chat).
//
// To test manually (replace TOKEN with a real Firebase ID token):
//   curl -X POST http://localhost:3000/api/rag \
//     -H "Authorization: Bearer TOKEN" \
//     -H "Content-Type: application/json" \
//     -d '{"query":"How do I teach counting to 10?","subject":"math"}'

import { type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { embedText } from '@/lib/gemini/embed';
import { queryByEmbedding } from '@/lib/firebase/vectorSearch';
import type { RagRequest, ApiResult, RagResponse } from '@/types';

export async function POST(request: NextRequest): Promise<Response> {
  // ── 1. Verify Firebase Auth token ────────────────────────────────────────
  const authHeader = request.headers.get('Authorization');
  if (authHeader === null || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      {
        success: false,
        error: 'Missing or malformed Authorization header.',
      } satisfies ApiResult<never>,
      { status: 401 },
    );
  }

  try {
    await adminAuth.verifyIdToken(authHeader.slice(7));
  } catch {
    return Response.json(
      { success: false, error: 'Invalid or expired Firebase ID token.' } satisfies ApiResult<never>,
      { status: 401 },
    );
  }

  // ── 2. Parse and validate request body ───────────────────────────────────
  let body: RagRequest;
  try {
    body = (await request.json()) as RagRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { query, subject } = body;

  if (typeof query !== 'string' || query.trim().length === 0) {
    return Response.json(
      {
        success: false,
        error: 'Field "query" must be a non-empty string.',
      } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  if (subject !== 'math' && subject !== 'reading') {
    return Response.json(
      {
        success: false,
        error: 'Field "subject" must be "math" or "reading".',
      } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Embed the query and retrieve top-3 chunks ─────────────────────────
  try {
    const queryEmbedding = await embedText(query.trim());
    const rankedChunks = await queryByEmbedding(queryEmbedding, subject, 3);

    // Return only the text content — embeddings are never sent to the client
    const chunks = rankedChunks.map((chunk) => chunk.text);

    return Response.json({ success: true, data: { chunks } } satisfies ApiResult<RagResponse>);
  } catch {
    return Response.json(
      {
        success: false,
        error: 'RAG retrieval failed. Continuing without curriculum context.',
      } satisfies ApiResult<never>,
      { status: 500 },
    );
  }
}
