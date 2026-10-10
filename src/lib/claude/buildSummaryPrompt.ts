// buildSummaryPrompt — builds the user message sent to Claude for agentic session summaries.
// Separate from buildSystemPrompt.ts because summaries use a different prompt structure:
// the system prompt stays constant (SUMMARY_SYSTEM_PROMPT) and the user message
// is the full conversation transcript plus the mastery scores already on the session.

import { MASTERED_SCORE } from '@/types';
import type { Message } from '@/types';

/** One evaluator score Claude may mention. Missing means the evaluator never ran. */
interface SummaryMastery {
  topic: string;
  score: number;
  suggestedNext: string | null;
}

interface BuildSummaryPromptParams {
  /** The subject studied during the session. */
  subject: string;
  /** The fictional mascot name the child used. */
  mascotName: string;
  /** Full conversation history to summarize. */
  messages: Message[];
  /**
   * Raw `evaluations` array from the session document.
   * The child client does not send scores. The summary route reads them here.
   */
  evaluations?: unknown;
}

/** Yes or no for the prompt. Mastered follows MASTERED_SCORE, not a mismatched flag. */
function masteredLabel(score: number): 'yes' | 'no' {
  return score >= MASTERED_SCORE ? 'yes' : 'no';
}

/**
 * Keeps only real evaluator entries.
 * A missing array, or a score that is not a number, is skipped so Claude is not told a fake 0.
 */
function readMasteryEvaluations(value: unknown): SummaryMastery[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const evaluations: SummaryMastery[] = [];

  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }

    const record = entry as Record<string, unknown>;
    const topic = record['topic'];
    const score = record['score'];

    if (typeof topic !== 'string' || topic.trim().length === 0) {
      continue;
    }

    if (typeof score !== 'number' || !Number.isFinite(score)) {
      continue;
    }

    const suggestedNext = record['suggestedNext'];
    const focus = typeof suggestedNext === 'string' ? suggestedNext.trim() : '';

    evaluations.push({
      topic: topic.trim(),
      score,
      suggestedNext: focus.length > 0 ? focus : null,
    });
  }

  return evaluations;
}

/**
 * Lists the scores already saved on the session.
 * Claude must repeat these facts and must not invent a score when the list is empty.
 */
function formatMasteryContext(evaluations: SummaryMastery[]): string {
  if (evaluations.length === 0) {
    return [
      'Mastery evaluation: none recorded for this session.',
      'Do not invent a mastery score, and do not say the topic was mastered.',
    ].join('\n');
  }

  const blocks = evaluations.map((evaluation) => {
    const focus = evaluation.suggestedNext ?? 'none suggested';

    return [
      `- Topic: ${evaluation.topic}`,
      `  Mastered: ${masteredLabel(evaluation.score)}`,
      `  Score achieved: ${evaluation.score}`,
      `  Suggested focus for the next session: ${focus}`,
    ].join('\n');
  });

  return [
    'Mastery evaluations already scored for this session. Use these facts. Do not invent a different score.',
    ...blocks,
    'In the JSON summary, state whether the topic was mastered (yes or no), the score achieved, and a suggested focus for the next session.',
    'Put the suggested focus in areasForPractice. Mention mastered yes or no and the score in encouragementNote.',
  ].join('\n');
}

/** The JSON shape the summary route already parses. Mastery facts go inside these three fields. */
function jsonContract(): string {
  return [
    'Please provide a JSON summary with exactly these keys:',
    '{ "topicsCovered": string[], "areasForPractice": string[], "encouragementNote": string }',
  ].join('\n');
}

/**
 * Formats the session conversation into a user message for Claude's summary call.
 * Returns the user-message string to be sent alongside SUMMARY_SYSTEM_PROMPT.
 */
export function buildSummaryPrompt({
  subject,
  mascotName,
  messages,
  evaluations,
}: BuildSummaryPromptParams): string {
  const masteryContext = formatMasteryContext(readMasteryEvaluations(evaluations));

  if (messages.length === 0) {
    return [
      `The child had a ${subject} session with ${mascotName} but no messages were exchanged.`,
      '',
      masteryContext,
      '',
      jsonContract(),
    ].join('\n');
  }

  // Format each message as "Child: ..." or "Mascot: ..." for readability
  const transcript = messages
    .map((msg) => {
      const speaker = msg.role === 'child' ? 'Child' : `Mascot (${mascotName})`;
      // Strip [STAR EARNED] tokens from the mascot messages — parents see the note separately
      const content = msg.content.replace(/\[STAR EARNED\]/g, '').trim();
      return `${speaker}: ${content}`;
    })
    .join('\n');

  return [
    `Subject: ${subject}`,
    `Mascot name: ${mascotName}`,
    `Session length: ${messages.length} messages`,
    '',
    'Conversation transcript:',
    transcript,
    '',
    masteryContext,
    '',
    jsonContract(),
  ].join('\n');
}
