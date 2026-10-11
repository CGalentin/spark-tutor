// Central re-export for app-wide constants.
// Import from '@/constants' instead of reaching into individual files.

export type {
  GradeBand,
  ResponseLength,
  VocabularyLevel,
  QuestionComplexity,
  GradeBandConfig,
} from './gradeBands';
export { GRADE_BAND_CONFIGS, isGradeBand } from './gradeBands';

export { GRADE_BAND_PROMPT } from './gradeBandPrompts';

export type { TopicSubject, TopicMap } from './topicMap';
export { TOPIC_MAP, getTopics } from './topicMap';
