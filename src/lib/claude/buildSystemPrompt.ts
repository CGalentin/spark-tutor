// Builds the composable Claude system prompt from independent layers.
// This separation lets us update any layer independently without touching the others.
//
// Layer 1: BASE_TUTOR_RULES     — safety + Socratic method (never changes)
// Layer 2: CHARACTER_VOICE      — mascot personality (depends on selected character)
// Layer 3: SUBJECT_CONTEXT      — which subject this session covers
// Layer 4: GRADE_BAND           — how to talk for K / 1 / 2 / 3 (defaults to K)
// Layer 5: LEARNING_PATH        — current topic + mastered topics (optional until a path exists)
// Layer 6: RAG_CONTEXT          — curriculum chunks (optional)
// Layer 7: MCP_CONTEXT          — practice problem + hint (optional)

import { BASE_TUTOR_RULES } from '@/constants/prompts';
import { getCharacterById } from '@/constants/characters';
import { GRADE_BAND_PROMPT } from '@/constants/gradeBandPrompts';
import type { GradeBand } from '@/constants/gradeBands';
import type { LearningPathContext, Subject } from '@/types';

interface BuildSystemPromptOptions {
  characterId: string;
  subject: Subject;
  /** Tutoring grade. Defaults to Kindergarten so older clients keep working. */
  gradeBand?: GradeBand;
  /** Current topic + mastered list. Omitted when this parent has no learning path yet. */
  learningPathContext?: LearningPathContext;
  /** Curriculum chunks retrieved from Firebase Vector Search. */
  ragContext?: string;
  /** MCP-generated math problem + hint — injected instead of RAG when present. */
  mcpContext?: string;
}

/**
 * Composes the full system prompt for a tutoring session.
 * Throws if the characterId is not found in CHARACTERS.
 */
export function buildSystemPrompt({
  characterId,
  subject,
  gradeBand = 'K',
  learningPathContext,
  ragContext,
  mcpContext,
}: BuildSystemPromptOptions): string {
  const character = getCharacterById(characterId);

  if (character === undefined) {
    throw new Error(
      `Unknown characterId: "${characterId}". Check CHARACTERS in constants/characters.ts.`,
    );
  }

  const subjectFocus =
    subject === 'math'
      ? 'This session is focused on Math — counting, number recognition, patterns, shapes, basic addition and subtraction.'
      : 'This session is focused on Reading/ELA — phonics, letter sounds, sight words, rhyming, simple comprehension.';

  const layers: string[] = [
    BASE_TUTOR_RULES,
    `CHARACTER VOICE:\n${character.voicePrompt}`,
    `CURRENT SESSION:\n${subjectFocus}`,
    GRADE_BAND_PROMPT[gradeBand],
  ];

  // Layer 5 — stay on the current topic until the parent approves a change
  if (learningPathContext !== undefined) {
    layers.push(formatLearningPathLayer(learningPathContext));
  }

  // Layer 6 — RAG curriculum chunks (omitted when MCP context is present)
  if (ragContext !== undefined && ragContext.trim().length > 0) {
    layers.push(`CURRICULUM CONTEXT (ground your responses in this material):\n${ragContext}`);
  }

  // Layer 7 — MCP math problem (replaces RAG when child requests a practice problem)
  if (mcpContext !== undefined && mcpContext.trim().length > 0) {
    layers.push(mcpContext);
  }

  return layers.join('\n\n---\n\n');
}

/**
 * Turns learning-path fields into the Layer 5 prompt block.
 * Empty mastered list becomes "none yet" so Claude is not given a blank line.
 */
function formatLearningPathLayer(context: LearningPathContext): string {
  const masteredList =
    context.masteredTopics.length === 0 ? 'none yet' : context.masteredTopics.join(', ');

  return [
    'LEARNING PATH:',
    `Current topic: ${context.currentTopic}`,
    `Topics this child has already mastered: ${masteredList}`,
    `Difficulty level: ${context.difficultyHint}`,
    `Focus exclusively on ${context.currentTopic} until the child shows understanding.`,
    'Do not introduce new topics — let the parent decide when to advance.',
  ].join('\n');
}
