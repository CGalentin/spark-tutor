// Grade band configs for Spark Tutor v2 (K through Grade 3).
// These settings drive how Claude talks and how hard questions should be.
// The matching prompt strings live in gradeBandPrompts.ts and are injected
// as Layer 4 of the composable system prompt (PR 2-02).

/** The four grade levels a child can be tutored at. */
export type GradeBand = 'K' | '1' | '2' | '3';

/** How long Claude's replies should be for this grade. */
export type ResponseLength = 'very-short' | 'short' | 'medium';

/** How hard the words Claude uses should be. */
export type VocabularyLevel = 'simple' | 'developing' | 'expanding';

/** How many thinking steps a question may ask for. */
export type QuestionComplexity = 'single-step' | 'two-step' | 'multi-step';

/**
 * Settings for one grade band.
 * `encouragementStyle` is a short note about tone — the full talking
 * instructions are in GRADE_BAND_PROMPT, not here.
 */
export interface GradeBandConfig {
  label: string;
  responseLength: ResponseLength;
  vocabularyLevel: VocabularyLevel;
  questionComplexity: QuestionComplexity;
  encouragementStyle: string;
}

/**
 * One config object per grade.
 * `Record<GradeBand, GradeBandConfig>` means TypeScript will error if we
 * forget a grade or add a key that is not K/1/2/3.
 */
export const GRADE_BAND_CONFIGS: Record<GradeBand, GradeBandConfig> = {
  K: {
    label: 'Kindergarten',
    responseLength: 'very-short',
    vocabularyLevel: 'simple',
    questionComplexity: 'single-step',
    encouragementStyle: 'warm and extra gentle — lots of praise for every try',
  },
  '1': {
    label: 'Grade 1',
    responseLength: 'short',
    vocabularyLevel: 'simple',
    questionComplexity: 'two-step',
    encouragementStyle: 'encouraging and upbeat — celebrate effort as much as answers',
  },
  '2': {
    label: 'Grade 2',
    responseLength: 'medium',
    vocabularyLevel: 'developing',
    questionComplexity: 'two-step',
    encouragementStyle: 'supportive and confident — praise the thinking process',
  },
  '3': {
    label: 'Grade 3',
    responseLength: 'medium',
    vocabularyLevel: 'expanding',
    questionComplexity: 'multi-step',
    encouragementStyle: 'respectful and motivating — treat the child as a capable problem-solver',
  },
};
