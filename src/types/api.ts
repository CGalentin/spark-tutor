// Types for API routes — request/response shapes and the shared ApiResult wrapper.
// Every API route handler and service function should use ApiResult<T> as its return type.

import type { Message, Subject } from './session';

/** Standard API response wrapper used by all /app/api routes.
 *  Discriminated union makes it easy to check success before accessing data. */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Request body sent to POST /api/chat. */
export interface ChatRequest {
  /** The child's latest message text. */
  message: string;
  sessionId: string;
  characterId: string;
  subject: Subject;
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
