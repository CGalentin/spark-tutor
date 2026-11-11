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

import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { getLearningPath } from '@/lib/firebase/learningPath';
import { getAnthropicClient } from '@/lib/claude/client';
import { buildSystemPrompt } from '@/lib/claude/buildSystemPrompt';
import { getDifficultyHint } from '@/lib/claude/adaptDifficulty';
import { isGradeBand, type GradeBand } from '@/constants/gradeBands';
import { embedText } from '@/lib/gemini/embed';
import { queryByEmbedding } from '@/lib/firebase/vectorSearch';
import { detectsProblemRequest, generateMathProblem } from '@/lib/mcp/mathProblem';
import { detectsReadingQuizRequest, detectsSpellingRequest } from '@/lib/mcp/detectReadingTools';
import { POST as createReadingQuiz } from '@/app/api/mcp/reading-quiz/route';
import { POST as createSpellingList } from '@/app/api/mcp/spelling/route';
import { chatRatelimit } from '@/lib/upstash/ratelimit';
import {
  MASTERED_SCORE,
  type ApiResult,
  type ChatRequest,
  type LearningPath,
  type LearningPathContext,
  type Message,
  type ReadingQuizRequest,
  type ReadingQuizResponse,
  type SpellingRequest,
  type SpellingResponse,
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

  const { message, sessionId, characterId, subject, messages, grade, currentTopic } = body;

  // Grade from this session. Missing means Kindergarten so older clients still work.
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

  // Topic from this session. When the child sends one, the teacher stays on it.
  let requestedTopic: string | undefined;
  if (currentTopic !== undefined) {
    if (typeof currentTopic !== 'string' || currentTopic.trim().length === 0) {
      return Response.json(
        { success: false, error: 'Optional field currentTopic must be a non-empty string.' },
        { status: 400 },
      );
    }
    requestedTopic = currentTopic.trim();
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

  // ── 4. MCP routing — detect activity requests before falling through to RAG ──
  // A quiz or spelling list is built by its own route, which keeps the secret
  // on the server. Math still uses the direct generator. If a tool fails,
  // chat falls through to RAG.
  let ragContext: string | undefined;
  let mcpContext: string | undefined;

  const trimmedMessage = message.trim();
  const isMathProblemRequest = subject === 'math' && detectsProblemRequest(trimmedMessage);
  const isReadingQuizRequest = subject === 'reading' && detectsReadingQuizRequest(trimmedMessage);
  const isSpellingRequest = detectsSpellingRequest(trimmedMessage);
  const ownedSessionId = usableSessionId(sessionId);

  if (isReadingQuizRequest && ownedSessionId !== null) {
    mcpContext = await loadReadingQuizContext(request, {
      sessionId: ownedSessionId,
      grade: gradeBand,
      topic: activityTopic(requestedTopic, 'Reading'),
    });
  } else if (isSpellingRequest && ownedSessionId !== null) {
    mcpContext = await loadSpellingContext(request, {
      sessionId: ownedSessionId,
      grade: gradeBand,
      topic: activityTopic(requestedTopic, 'Spelling'),
      count: 3,
    });
  } else if (isMathProblemRequest) {
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
  // The session's topic, when the client sends one, overrides the stored current topic.
  const learningPathContext = await loadLearningPathContext(parentUID, subject, requestedTopic);

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

/** True when value is a plain object, not an array or null. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Session ids are one path segment. A slash would point at a different note. */
function usableSessionId(sessionId: unknown): string | null {
  if (typeof sessionId !== 'string') return null;
  const trimmed = sessionId.trim();
  if (trimmed.length === 0 || trimmed.length > 128 || trimmed.includes('/')) return null;
  return trimmed;
}

/** Uses the lesson topic when the chat already has one. */
function activityTopic(requestedTopic: string | undefined, fallback: string): string {
  if (requestedTopic !== undefined && requestedTopic.length <= 120) return requestedTopic;
  return fallback;
}

/** Builds a POST the MCP route can read, using the same signed-in parent. */
function mcpPost(request: NextRequest, path: string, body: unknown): NextRequest {
  return new NextRequest(new URL(path, request.nextUrl.origin), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: request.headers.get('Authorization') ?? '',
    },
    body: JSON.stringify(body),
  });
}

/** Reads a successful MCP payload. A failed route returns null so chat can use RAG. */
async function readMcpData(response: Response): Promise<unknown> {
  if (!response.ok) return null;

  try {
    const json = (await response.json()) as ApiResult<unknown>;
    if (!json.success) return null;
    return json.data;
  } catch {
    return null;
  }
}

/** True when the quiz payload has a passage and 3 choices, and no choice number. */
function isReadingQuizData(value: unknown): value is ReadingQuizResponse {
  if (!isRecord(value)) return false;
  if (typeof value.passage !== 'string' || value.passage.trim().length === 0) return false;
  if (!Array.isArray(value.questions) || value.questions.length !== 3) return false;

  for (const item of value.questions) {
    if (!isRecord(item)) return false;
    if ('correctIndex' in item || 'answers' in item) return false;
    if (typeof item.question !== 'string' || typeof item.hint !== 'string') return false;
    if (!Array.isArray(item.options) || item.options.length !== 3) return false;
    if (!item.options.every((option) => typeof option === 'string' && option.length > 0)) {
      return false;
    }
  }

  return true;
}

/** True when each spelling item is a clue, a letter count, and a hint. */
function isSpellingData(value: unknown): value is SpellingResponse {
  if (!isRecord(value) || !Array.isArray(value.words)) return false;
  if (value.words.length < 3 || value.words.length > 5) return false;

  for (const item of value.words) {
    if (!isRecord(item)) return false;
    if ('word' in item) return false;
    if (typeof item.clue !== 'string' || item.clue.length === 0) return false;
    if (typeof item.hint !== 'string' || item.hint.length === 0) return false;
    if (typeof item.letterCount !== 'number') return false;
  }

  return true;
}

/** Turns a quiz into instructions. The correct choice number is not included. */
function formatReadingQuizContext(quiz: ReadingQuizResponse): string {
  const lines = [
    'READING QUIZ (say this in your character voice. Do not show raw JSON.):',
    `Passage: ${quiz.passage}`,
  ];

  quiz.questions.forEach((item, index) => {
    lines.push(`Question ${index + 1}: ${item.question}`);
    item.options.forEach((option, optionIndex) => {
      lines.push(`Choice ${optionIndex + 1}: ${option}`);
    });
    lines.push(`Hint if they are stuck: ${item.hint}`);
  });

  lines.push('Do NOT say which choice is correct. Ask the child to pick one.');
  return lines.join('\n');
}

/** Turns a spelling list into instructions. The spellings are not included. */
function formatSpellingContext(list: SpellingResponse): string {
  const lines = [
    'SPELLING PRACTICE (say this in your character voice. Do not show raw JSON.):',
    'You do not know the spellings. Do not guess a word. Do not say its letters.',
  ];

  list.words.forEach((item, index) => {
    lines.push(
      `Word ${index + 1}: clue "${item.clue}". It has ${item.letterCount} letters. Hint: ${item.hint}`,
    );
  });

  lines.push('Ask the child to try the word. Do NOT say the spelling.');
  return lines.join('\n');
}

/** Calls the reading-quiz route and returns prompt text, or undefined when it fails. */
async function loadReadingQuizContext(
  request: NextRequest,
  body: ReadingQuizRequest,
): Promise<string | undefined> {
  try {
    const response = await createReadingQuiz(mcpPost(request, '/api/mcp/reading-quiz', body));
    const data = await readMcpData(response);
    if (!isReadingQuizData(data)) return undefined;
    return formatReadingQuizContext(data);
  } catch {
    return undefined;
  }
}

/** Calls the spelling route and returns prompt text, or undefined when it fails. */
async function loadSpellingContext(
  request: NextRequest,
  body: SpellingRequest,
): Promise<string | undefined> {
  try {
    const response = await createSpellingList(mcpPost(request, '/api/mcp/spelling', body));
    const data = await readMcpData(response);
    if (!isSpellingData(data)) return undefined;
    return formatSpellingContext(data);
  } catch {
    return undefined;
  }
}

/**
 * Loads the parent's learning path for this subject and maps it for the Teacher prompt.
 * requestedTopic is the topic this session started on. It wins over a newer path topic
 * so a mid-session approval does not change the lesson already in progress.
 * If the path cannot be read, a sent topic still keeps the teacher on that lesson.
 */
async function loadLearningPathContext(
  parentUID: string,
  subject: ChatRequest['subject'],
  requestedTopic: string | undefined,
): Promise<LearningPathContext | undefined> {
  try {
    const path = await getLearningPath(parentUID, subject);
    if (path === null) {
      return topicOnlyContext(requestedTopic);
    }

    return toLearningPathContext(path, requestedTopic);
  } catch {
    return topicOnlyContext(requestedTopic);
  }
}

/**
 * Prompt slice when we know the session topic but have no mastery history.
 */
function topicOnlyContext(requestedTopic: string | undefined): LearningPathContext | undefined {
  if (requestedTopic === undefined) {
    return undefined;
  }

  return {
    currentTopic: requestedTopic,
    masteredTopics: [],
    difficultyHint: 'normal',
  };
}

/**
 * Builds the prompt slice from a stored learning path.
 * Difficulty comes from the last two scores on the topic this session is teaching.
 */
function toLearningPathContext(
  path: LearningPath,
  requestedTopic: string | undefined,
): LearningPathContext {
  const currentTopic = requestedTopic ?? path.currentTopic;
  const masteredFromHistory = path.masteryHistory
    .filter((entry) => entry.mastered || entry.score >= MASTERED_SCORE)
    .map((entry) => entry.topic);

  const masteredTopics = [...new Set([...path.topicsCompleted, ...masteredFromHistory])];

  return {
    currentTopic,
    masteredTopics,
    difficultyHint: getDifficultyHint(path.masteryHistory, currentTopic),
  };
}
