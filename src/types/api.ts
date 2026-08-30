// Types for API routes — request/response shapes and the shared ApiResult wrapper.
// Every API route handler and service function should use ApiResult<T> as its return type.

import type { GradeBand } from '@/constants/gradeBands';
import type { Message, Subject } from './session';

/** Standard API response wrapper used by all /app/api routes.
 *  Discriminated union makes it easy to check success before accessing data. */
export type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

/** Request body sent to POST /api/chat. */
export interface ChatRequest {
  /** The child's latest message text. */
  message: string;
  sessionId: string;
  characterId: string;
  subject: Subject;
  /** Tutoring grade band. Optional — the chat route defaults to 'K' if omitted. */
  grade?: GradeBand;
  /** Full conversation history so Claude has context. */
  messages: Message[];
}

/** Successful response from POST /api/chat. */
export interface ChatResponse {
  /** The mascot's reply text (streamed separately, this is the final value). */
  reply: string;
  /** True if Claude's response signals the child reached a correct answer. */
  starEarned: boolean;
}

/** Request body sent to POST /api/rag. */
export interface RagRequest {
  /** The child's question or message — embedded with Gemini to find relevant chunks. */
  query: string;
  /** Subject filter — only chunks with a matching subject are returned. */
  subject: Subject;
}

/** Successful response from POST /api/rag. */
export interface RagResponse {
  /** Top-3 curriculum chunks relevant to the query, as plain text strings. */
  chunks: string[];
}

/** Request body sent to POST /api/session/start. */
export interface SessionStartRequest {
  /** The character type (e.g. 'robot', 'fox') the child selected. */
  characterType: string;
  /** The fictional name the child gave their mascot. */
  characterName: string;
  /** The subject the child chose for this session. */
  subject: Subject;
}

/** Successful response from POST /api/session/start. */
export interface SessionStartResponse {
  /** The Firestore document ID of the newly created session. */
  sessionId: string;
}

/** Request body sent to POST /api/session/end. */
export interface SessionEndRequest {
  sessionId: string;
  parentUID: string;
  starsEarned: number;
  messageCount: number;
  /** Full conversation history — forwarded to /api/summary for the agentic summary. */
  messages?: Message[];
}

/** Successful response from POST /api/session/end. */
export interface SessionEndResponse {
  sessionId: string;
}

/** Grade levels supported by the MCP math problem generator. */
export type MathGrade = 'K' | '1';

/** Difficulty levels for generated math problems. */
export type MathDifficulty = 'easy' | 'medium';

/** Request body sent to POST /api/mcp/math-problem. */
export interface MathProblemRequest {
  /** Kindergarten ('K') or Grade 1 ('1'). */
  grade: MathGrade;
  /** The math topic — e.g. "counting", "addition", "shapes". */
  topic: string;
  difficulty: MathDifficulty;
}

/** Successful response from POST /api/mcp/math-problem.
 *  The answer is intentionally omitted — it is never returned to the client. */
export interface MathProblemResponse {
  /** The math problem text shown to the child (via Claude). */
  problem: string;
  /** A hint Claude can use to guide the child toward the answer. */
  hint: string;
}

/** Request body sent to POST /api/summary. */
export interface SummaryRequest {
  sessionId: string;
  parentUID: string;
  messages: Message[];
}

/** Successful response from POST /api/summary. */
export interface SummaryResponse {
  topicsCovered: string[];
  areasForPractice: string[];
  encouragementNote: string;
}
