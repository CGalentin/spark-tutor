// Picks how hard the Teacher should make the current topic.
// Chat reads the learning-path score history and passes the result into Layer 5.
// One score is not a pattern yet — the hint stays normal until there are two.

import type { DifficultyHint, TopicMastery } from '@/types';

/**
 * Extra teaching line for the learning-path prompt.
 * `normal` is null because Layer 4 already carries the standard grade-band prompt.
 */
export const DIFFICULTY_HINT_LINE: Record<DifficultyHint, string | null> = {
  easier: 'Use more visual descriptions, break into smaller steps, extra encouragement',
  normal: null,
  harder: 'Challenge with slightly harder variations, ask follow-up questions',
};

/**
 * Returns easier, normal, or harder from the last two scores on this topic.
 * Both scores must be under 50 to ease up, or both over 85 to push harder.
 */
export function getDifficultyHint(
  masteryHistory: TopicMastery[],
  currentTopic: string,
): DifficultyHint {
  // History is appended in time order, so the end of this list is the latest try.
  const scoresOnTopic = masteryHistory
    .filter((entry) => entry.topic === currentTopic)
    .map((entry) => entry.score);

  const lastTwoScores = scoresOnTopic.slice(-2);
  if (lastTwoScores.length < 2) {
    return 'normal';
  }

  const bothStruggling = lastTwoScores.every((score) => score < 50);
  if (bothStruggling) {
    return 'easier';
  }

  const bothStrong = lastTwoScores.every((score) => score > 85);
  if (bothStrong) {
    return 'harder';
  }

  return 'normal';
}
