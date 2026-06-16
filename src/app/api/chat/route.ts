// POST /api/chat — Spark Tutor mascot chat endpoint.
// Verifies the parent's Firebase Auth token, builds a composable system prompt,
// and streams Claude's response back as Server-Sent Events (SSE).
//
// SSE event shapes:
//   data: {"type":"delta","text":"..."}   — a streamed text chunk
//   data: {"type":"done","starEarned":bool} — stream complete + star metadata
//   data: {"type":"error","error":"..."}  — something went wrong mid-stream
//
// To test manually (replace TOKEN with a real Firebase ID token):
//   curl -X POST http://localhost:3000/api/chat \
//     -H "Authorization: Bearer TOKEN" \
//     -H "Content-Type: application/json" \
//     -d '{"message":"What is 2 + 2?","characterId":"blip","subject":"math","messages":[]}'

import { type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { getAnthropicClient } from '@/lib/claude/client';
import { buildSystemPrompt } from '@/lib/claude/buildSystemPrompt';
import type { ChatRequest, Message } from '@/types';

/** Maps our internal MessageRole to the role format Claude expects. */
function toClaudeRole(role: Message['role']): 'user' | 'assistant' {
  return role === 'child' ? 'user' : 'assistant';
}

/** Encodes a JSON object as a single SSE data line. */
function sseEvent(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function POST(request: NextRequest) {
  // ── 1. Verify Firebase Auth token ────────────────────────────────────────
  const authHeader = request.headers.get('Authorization');
  if (authHeader === null || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Missing or malformed Authorization header.' },
      { status: 401 },
    );
  }

  try {
    await adminAuth.verifyIdToken(authHeader.slice(7));
  } catch {
    return Response.json(
      { success: false, error: 'Invalid or expired Firebase ID token.' },
      { status: 401 },
    );
  }

  // ── 2. Parse and validate request body ───────────────────────────────────
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const { message, characterId, subject, messages } = body;

  if (
    typeof message !== 'string' || message.trim().length === 0 ||
    typeof characterId !== 'string' || characterId.trim().length === 0 ||
    (subject !== 'math' && subject !== 'reading')
  ) {
    return Response.json(
      { success: false, error: 'Required fields: message (string), characterId (string), subject ("math"|"reading").' },
      { status: 400 },
    );
  }

  // ── 3. Build the composable system prompt ────────────────────────────────
  let systemPrompt: string;
  try {
    systemPrompt = buildSystemPrompt({ characterId, subject });
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message },
      { status: 400 },
    );
  }

  // ── 4. Map conversation history to Claude's role format ──────────────────
  // Conversation history (mascot/child) + the current child message appended last
  const priorMessages = Array.isArray(messages) ? messages : [];
  const claudeMessages = [
    ...priorMessages.map((msg) => ({
      role: toClaudeRole(msg.role),
      content: msg.content,
    })),
    { role: 'user' as const, content: message.trim() },
  ];

  // ── 5. Stream Claude response as SSE ─────────────────────────────────────
  const anthropic = getAnthropicClient();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullText = '';

        const claudeStream = anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          temperature: 0.7,
          system: systemPrompt,
          messages: claudeMessages,
        });

        // .on('text') fires for every text delta from Claude
        claudeStream.on('text', (textDelta) => {
          fullText += textDelta;
          controller.enqueue(sseEvent({ type: 'delta', text: textDelta }));
        });

        // Await the full response so we can check starEarned before closing
        await claudeStream.finalMessage();

        // Signal completion and whether a star was earned
        // The child UI listens for [STAR EARNED] to trigger the star animation
        const starEarned = fullText.includes('[STAR EARNED]');
        controller.enqueue(sseEvent({ type: 'done', starEarned }));
        controller.close();
      } catch (streamErr) {
        // Log the real error so we can diagnose it in Vercel logs — remove after fix
        console.error('[api/chat] Anthropic stream error:', streamErr);
        controller.enqueue(sseEvent({ type: 'error', error: 'AI response failed. Please try again.' }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
