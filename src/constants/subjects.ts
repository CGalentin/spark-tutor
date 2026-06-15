// Subject and grade band constants used across the app and RAG retrieval filtering.

import type { Subject } from '@/types';

/** The two subjects available in Spark Tutor. */
export const SUBJECTS: Subject[] = ['math', 'reading'];

/** Human-readable labels for each subject — used in the UI. */
export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Math',
  reading: 'Reading',
};

/** Emoji icons for each subject — used in child-facing UI. */
export const SUBJECT_EMOJIS: Record<Subject, string> = {
  math: '🔢',
  reading: '📖',
};

/** The grade bands supported by Spark Tutor.
 *  Used as metadata on RAG curriculum chunks for filtering. */
export const GRADE_BANDS = ['K', '1'] as const;

export type GradeBand = (typeof GRADE_BANDS)[number];

/** Maximum stars a child can earn in a single session. */
export const MAX_SESSION_STARS = 10;

/** Target message count for a complete session (used for the progress bar). */
export const TARGET_SESSION_MESSAGES = 10;
