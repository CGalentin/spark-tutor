// Scores a child's mastery of one topic from a conversation block.
// Uses Gemini Flash. Results are for the parent dashboard only — never shown to the child.

import { getGeminiFlashClient } from './client';
import { buildEvaluatorPrompt } from './buildEvaluatorPrompt';
import type { GradeBand } from '@/constants/gradeBands';
import {
  MASTERED_SCORE,
  type EvaluationConfidence,
  type EvaluationResult,
  type Message,
} from '@/types';

/** Parent-facing note when Gemini's JSON cannot be read. Score stays 0 so we never auto-advance. */
const PARSE_FAILURE_REASONING =
  'The evaluator could not read a valid score from this conversation. The child has not been marked as mastered.';

/**
 * Asks Gemini Flash to score mastery for one topic block.
 * `mastered` is always derived from score (>= MASTERED_SCORE) so callers cannot drift.
 * If Gemini returns unreadable JSON, returns a safe fallback instead of throwing.
 */
export async function evaluateMastery(
  messages: Message[],
  topic: string,
  grade: GradeBand,
): Promise<EvaluationResult> {
  if (topic.trim().length === 0) {
    throw new Error('evaluateMastery requires a topic name.');
  }

  const model = getGeminiFlashClient();
  const prompt = buildEvaluatorPrompt({ topic, grade, messages });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const rawText = result.response.text();

  try {
    return parseEvaluationJson(rawText, topic);
  } catch {
    return fallbackEvaluation(topic);
  }
}

/**
 * Conservative result used when Gemini's reply is not valid JSON.
 * mastered is false because score 0 is below MASTERED_SCORE (90).
 */
function fallbackEvaluation(topic: string): EvaluationResult {
  return {
    topic,
    score: 0,
    mastered: false,
    confidence: 'low',
    suggestedNext: null,
    reasoning: PARSE_FAILURE_REASONING,
  };
}

/**
 * Turns Gemini's JSON text into a typed EvaluationResult.
 * Throws if the payload is missing required fields — evaluateMastery catches that.
 */
function parseEvaluationJson(rawText: string, topic: string): EvaluationResult {
  const parsed: unknown = JSON.parse(stripMarkdownFences(rawText));

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Evaluator response was not a JSON object.');
  }

  const data = parsed as Record<string, unknown>;
  const score = clampScore(data['score']);
  const confidence = toConfidence(data['confidence']);
  const suggestedNext = toSuggestedNext(data['suggestedNext']);
  const reasoning = typeof data['reasoning'] === 'string' ? data['reasoning'].trim() : '';

  if (reasoning.length === 0) {
    throw new Error('Evaluator response is missing reasoning.');
  }

  return {
    topic,
    score,
    mastered: score >= MASTERED_SCORE,
    confidence,
    suggestedNext,
    reasoning,
  };
}

/** Removes optional ```json fences if the model wraps the object anyway. */
function stripMarkdownFences(rawText: string): string {
  return rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
}

/** Coerces a JSON number into an integer 0–100. */
function clampScore(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Evaluator response is missing a numeric score.');
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Narrows confidence to the three allowed labels. */
function toConfidence(value: unknown): EvaluationConfidence {
  if (value === 'low' || value === 'medium' || value === 'high') {
    return value;
  }

  throw new Error('Evaluator response has an invalid confidence value.');
}

/** Accepts a topic string or JSON null. */
function toSuggestedNext(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }

  throw new Error('Evaluator response has an invalid suggestedNext value.');
}
