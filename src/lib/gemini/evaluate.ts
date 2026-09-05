// Scores a child's mastery of one topic from a conversation block.
// Uses Gemini Flash. Results are for the parent dashboard only — never shown to the child.
// PR 2-09 will replace the inline prompt with buildEvaluatorPrompt + a full rubric.

import { getGeminiFlashClient } from './client';
import type { GradeBand } from '@/constants/gradeBands';
import type { EvaluationConfidence, EvaluationResult, Message } from '@/types';

const MASTERED_SCORE = 80;

/**
 * Asks Gemini Flash to score mastery for one topic block.
 * `mastered` is always derived from score (>= 80) so callers cannot drift.
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
  const prompt = buildTemporaryEvaluatorPrompt(messages, topic, grade);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const rawText = result.response.text();
  return parseEvaluationJson(rawText, topic);
}

/**
 * Temporary prompt until PR 2-09 adds buildEvaluatorPrompt with the scoring rubric.
 */
function buildTemporaryEvaluatorPrompt(
  messages: Message[],
  topic: string,
  grade: GradeBand,
): string {
  const transcript =
    messages.length === 0
      ? '(no messages in this topic block)'
      : messages
          .map((message) => `${message.role === 'child' ? 'Child' : 'Mascot'}: ${message.content}`)
          .join('\n');

  return [
    "You score a child's mastery of one tutoring topic.",
    'This result is shown to the parent only — never to the child.',
    `Topic: ${topic}`,
    `Grade band: ${grade}`,
    '',
    'Transcript:',
    transcript,
    '',
    'Respond ONLY with JSON in this shape:',
    '{',
    '  "score": number from 0 to 100,',
    '  "mastered": true if score is 80 or higher,',
    '  "confidence": "low" | "medium" | "high",',
    '  "suggestedNext": next topic name as a string, or null,',
    '  "reasoning": one or two sentences for the parent',
    '}',
  ].join('\n');
}

/**
 * Turns Gemini's JSON text into a typed EvaluationResult.
 * Throws if the payload is missing required fields.
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
