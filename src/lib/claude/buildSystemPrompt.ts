// Builds the composable Claude system prompt from three separate layers.
// This separation lets us update any layer independently without touching the others.
//
// Layer 1: BASE_TUTOR_RULES  — K-1 safety + Socratic method (never changes)
// Layer 2: CHARACTER_VOICE   — mascot personality (depends on selected character)
// Layer 3: SUBJECT_CONTEXT   — which subject this session covers
// Layer 4: RAG_CONTEXT       — curriculum chunks (added in PR 2-05, optional for now)

import { BASE_TUTOR_RULES } from '@/constants/prompts';
import { getCharacterById } from '@/constants/characters';
import type { Subject } from '@/types';

interface BuildSystemPromptOptions {
  characterId: string;
  subject: Subject;
  /** Curriculum chunks retrieved from Firebase Vector Search — added in PR 2-05. */
  ragContext?: string;
}

/**
 * Composes the full system prompt for a tutoring session.
 * Throws if the characterId is not found in CHARACTERS.
 */
export function buildSystemPrompt({
  characterId,
  subject,
  ragContext,
}: BuildSystemPromptOptions): string {
  const character = getCharacterById(characterId);

  if (character === undefined) {
    throw new Error(`Unknown characterId: "${characterId}". Check CHARACTERS in constants/characters.ts.`);
  }

  const subjectFocus =
    subject === 'math'
      ? 'This session is focused on Math — counting, number recognition, patterns, shapes, basic addition and subtraction.'
      : 'This session is focused on Reading/ELA — phonics, letter sounds, sight words, rhyming, simple comprehension.';

  const layers: string[] = [
    BASE_TUTOR_RULES,
    `CHARACTER VOICE:\n${character.voicePrompt}`,
    `CURRENT SESSION:\n${subjectFocus}`,
  ];

  // Layer 4 — injected only when RAG retrieval is available (PR 2-05)
  if (ragContext !== undefined && ragContext.trim().length > 0) {
    layers.push(
      `CURRICULUM CONTEXT (ground your responses in this material):\n${ragContext}`,
    );
  }

  return layers.join('\n\n---\n\n');
}
