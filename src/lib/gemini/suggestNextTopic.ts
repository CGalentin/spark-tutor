// Picks the next curriculum topic after a child masters the current one.
// Uses TOPIC_MAP order (not Gemini) so suggestions stay in sequence and can
// roll into the next grade. The parent still has to approve before it becomes current.

import { type GradeBand } from '@/constants/gradeBands';
import { getTopics, type TopicSubject } from '@/constants/topicMap';
import { MASTERED_SCORE, type TopicMastery } from '@/types';

/** Tutoring grades in curriculum order — used to roll K → 1 → 2 → 3. */
const GRADE_SEQUENCE: GradeBand[] = ['K', '1', '2', '3'];

/**
 * Returns the next topic name to suggest after a mastery.
 *
 * Walks the current grade's TOPIC_MAP list and picks the first topic that is
 * not yet mastered. If every topic in this grade is mastered, returns the first
 * topic of the next grade. Always returns a plain string (never null).
 *
 * A topic counts as mastered when it is in `completedTopics`, or when
 * `masteryHistory` has a score >= MASTERED_SCORE (90) for that topic name.
 */
export function suggestNextTopic(
  subject: TopicSubject,
  grade: GradeBand,
  completedTopics: string[],
  masteryHistory: TopicMastery[],
): string {
  const masteredNames = collectMasteredTopicNames(completedTopics, masteryHistory);
  const currentGradeTopics = getTopics(subject, grade);

  const nextInGrade = currentGradeTopics.find((topic) => !masteredNames.has(topic));
  if (nextInGrade !== undefined) {
    return nextInGrade;
  }

  const nextGrade = nextGradeAfter(grade);
  if (nextGrade !== undefined) {
    const firstOfNextGrade = getTopics(subject, nextGrade)[0];
    if (firstOfNextGrade !== undefined) {
      return firstOfNextGrade;
    }
  }

  // Grade 3 (or an empty list) — stay on the last listed topic rather than inventing one.
  const lastInGrade = currentGradeTopics[currentGradeTopics.length - 1];
  if (lastInGrade !== undefined) {
    return lastInGrade;
  }

  throw new Error(`No topics found in TOPIC_MAP for ${subject} grade ${grade}.`);
}

/**
 * Builds a set of topic names the child has already mastered.
 * Uses MASTERED_SCORE so a stale `mastered: false` flag cannot skip a high score.
 */
function collectMasteredTopicNames(
  completedTopics: string[],
  masteryHistory: TopicMastery[],
): Set<string> {
  const names = new Set<string>(completedTopics);

  for (const entry of masteryHistory) {
    if (entry.mastered || entry.score >= MASTERED_SCORE) {
      names.add(entry.topic);
    }
  }

  return names;
}

/** Returns the next tutoring grade, or undefined at Grade 3. */
function nextGradeAfter(grade: GradeBand): GradeBand | undefined {
  const index = GRADE_SEQUENCE.indexOf(grade);
  if (index === -1 || index === GRADE_SEQUENCE.length - 1) {
    return undefined;
  }

  return GRADE_SEQUENCE[index + 1];
}
