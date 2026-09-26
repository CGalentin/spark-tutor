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
//     -d '{"message":"What is 2 + 2?","characterId":"blip","subject":"math","grade":"2","messages":[]}'

import { type NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { getLearningPath } from '@/lib/firebase/learningPath';
import { getAnthropicClient } from '@/lib/claude/client';
import { buildSystemPrompt } from '@/lib/claude/buildSystemPrompt';
import { isGradeBand, type GradeBand } from '@/constants/gradeBands';
import { embedText } from '@/lib/gemini/embed';
import { queryByEmbedding } from '@/lib/firebase/vectorSearch';
import { detectsProblemRequest, generateMathProblem } from '@/lib/mcp/mathProblem';
import { chatRatelimit } from '@/lib/upstash/ratelimit';
import {
  MASTERED_SCORE,
  type ChatRequest,
  type LearningPath,
  type LearningPathContext,
  type Message,
} from '@/types';

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
  let parentUID: string;
  try {
    parentUID = await verifyAuthToken(request.headers.get('Authorization'));
  } catch (err) {
    return Response.json({ success: false, error: (err as Error).message }, { status: 401 });
  }

  // ── 2. Rate limit — 30 requests per user per hour ────────────────────────
  // chatRatelimit is null when Upstash env vars are absent (fail-open for local dev).
  // The try/catch also fail-opens on bad credentials so a wrong token never blocks chat.
  if (chatRatelimit !== null) {
    try {
      const { success } = await chatRatelimit.limit(parentUID);
      if (!success) {
        return Response.json(
          {
            success: false,
            error:
              "You've sent a lot of messages today! Take a short break and try again in a little while. 🌟",
          },
          { status: 429 },
        );
      }
    } catch {
      // Upstash connection error (e.g. invalid credentials) — fail open, allow request through
    }
  }

  // ── 3. Parse and validate request body ───────────────────────────────────
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const { message, sessionId, characterId, subject, messages, grade } = body;

  // Optional grade field — missing or omitted means Kindergarten (old clients still work).
  let gradeBand: GradeBand = 'K';
  if (grade !== undefined) {
    if (!isGradeBand(grade)) {
      return Response.json(
        { success: false, error: 'Optional field grade must be "K", "1", "2", or "3".' },
        { status: 400 },
      );
    }
    gradeBand = grade;
  }

  if (
    typeof message !== 'string' ||
    message.trim().length === 0 ||
    typeof characterId !== 'string' ||
    characterId.trim().length === 0 ||
    (subject !== 'math' && subject !== 'reading')
  ) {
    return Response.json(
      {
        success: false,
        error:
          'Required fields: message (string), characterId (string), subject ("math"|"reading").',
      },
      { status: 400 },
    );
  }

  // ── 4. MCP routing — detect problem requests before falling through to RAG ──
  // When the child asks for a practice problem, generate one via the MCP tool.
  // If MCP succeeds, skip RAG and inject the problem as Layer 7 instead.
  // If MCP fails, fall through to RAG as normal.
  let ragContext: string | undefined;
  let mcpContext: string | undefined;

  const isMathProblemRequest = subject === 'math' && detectsProblemRequest(message.trim());

  if (isMathProblemRequest) {
    const mcpResult = await generateMathProblem('K', 'math', 'easy');
    if (mcpResult !== null) {
      mcpContext = [
        `PRACTICE PROBLEM (present this to the child and guide them Socratically):`,
        `Problem: ${mcpResult.problem}`,
        `Hint to use if they're stuck: ${mcpResult.hint}`,
        `Do NOT reveal the answer — ask guiding questions to help the child figure it out.`,
      ].join('\n');
    }
  }

  // ── 5a. RAG retrieval — only when MCP didn't supply a problem ────────────
  if (mcpContext === undefined) {
    try {
      const queryEmbedding = await embedText(message.trim());
      const rankedChunks = await queryByEmbedding(queryEmbedding, subject, 3);
      if (rankedChunks.length > 0) {
        ragContext = rankedChunks.map((chunk) => chunk.text).join('\n\n---\n\n');
      }
    } catch {
      // RAG failure is non-fatal — Claude still gives a useful response without it
      ragContext = undefined;
    }
  }

  // Learning path is optional — a missing or failed read must not block chat.
  const learningPathContext = await loadLearningPathContext(parentUID, subject);

  // ── 5b. Build the composable system prompt ───────────────────────────────
  let systemPrompt: string;
  try {
    systemPrompt = buildSystemPrompt({
      characterId,
      subject,
      gradeBand,
      learningPathContext,
      ragContext,
      mcpContext,
    });
  } catch (err) {
    return Response.json({ success: false, error: (err as Error).message }, { status: 400 });
  }

  // ── 6. Map conversation history to Claude's role format ──────────────────
  // Conversation history (mascot/child) + the current child message appended last
  const priorMessages = Array.isArray(messages) ? messages : [];
  const claudeMessages = [
    ...priorMessages.map((msg) => ({
      role: toClaudeRole(msg.role),
      content: msg.content,
    })),
    { role: 'user' as const, content: message.trim() },
  ];

  // ── 7. Stream Claude response as SSE ─────────────────────────────────────
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

        // Increment the session message count in Firestore (non-fatal if it fails)
        if (typeof sessionId === 'string' && sessionId.length > 0) {
          try {
            const sessionRef = adminDb
              .collection('users')
              .doc(parentUID)
              .collection('sessions')
              .doc(sessionId);
            await sessionRef.update({ messageCount: FieldValue.increment(1) });
          } catch {
            // Firestore write failure must not break the chat stream
          }
        }

        // Signal completion and whether a star was earned
        // The child UI listens for [STAR EARNED] to trigger the star animation
        const starEarned = fullText.includes('[STAR EARNED]');
        controller.enqueue(sseEvent({ type: 'done', starEarned }));
        controller.close();
      } catch {
        // Mid-stream errors: send an error event so the client can show a friendly message
        controller.enqueue(
          sseEvent({ type: 'error', error: 'AI response failed. Please try again.' }),
        );
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

/**
 * Loads the parent's learning path for this subject and maps it for the Teacher prompt.
 * Returns undefined if the path is missing or Firestore fails — chat still works.
 */
async function loadLearningPathContext(
  parentUID: string,
  subject: ChatRequest['subject'],
): Promise<LearningPathContext | undefined> {
  try {
    const path = await getLearningPath(parentUID, subject);
    if (path === null) {
      return undefined;
    }

    return toLearningPathContext(path);
  } catch {
    return undefined;
  }
}

/**
 * Builds the prompt slice from a stored learning path.
 * Difficulty stays 'normal' until PR 2-17 reads the score history.
 */
function toLearningPathContext(path: LearningPath): LearningPathContext {
  const masteredFromHistory = path.masteryHistory
    .filter((entry) => entry.mastered || entry.score >= MASTERED_SCORE)
    .map((entry) => entry.topic);

  const masteredTopics = [...new Set([...path.topicsCompleted, ...masteredFromHistory])];

  return {
    currentTopic: path.currentTopic,
    masteredTopics,
    difficultyHint: 'normal',
  };
}
