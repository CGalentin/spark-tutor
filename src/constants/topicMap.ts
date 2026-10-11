// Curriculum topic lists by subject and grade.
// Later PRs use this to pick the next lesson on a child's learning path.
// Science is a Phase 2 placeholder — same starter topics for every grade.

import type { GradeBand } from './gradeBands';

/** Subjects that have a topic list. Science is listed here for Phase 2 only. */
export type TopicSubject = 'math' | 'reading' | 'science';

/** Nested lookup: subject → grade → list of topic names. */
export type TopicMap = Record<TopicSubject, Record<GradeBand, string[]>>;

/** Same science topics for K–3 until Phase 2 builds a real sequence. */
const SCIENCE_PLACEHOLDER_TOPICS: string[] = [
  'Living things',
  'Weather',
  'Human body',
  'Animals',
  'Plants',
  'Earth and sky',
];

export const TOPIC_MAP: TopicMap = {
  math: {
    K: ['Counting to 10', 'Counting to 20', 'Shapes', 'Comparing numbers', 'Simple addition'],
    '1': ['Addition to 20', 'Subtraction to 20', 'Place value', 'Measurement', 'Time and money'],
    '2': [
      'Addition to 100',
      'Subtraction to 100',
      'Place value to 1000',
      'Multiplication intro',
      'Fractions intro',
    ],
    '3': ['Multiplication', 'Division', 'Fractions', 'Area and perimeter', 'Data and graphs'],
  },
  reading: {
    K: [
      'Letter sounds',
      'Sight words',
      'Phonics basics',
      'Simple sentences',
      'Story comprehension',
    ],
    '1': ['Blending sounds', 'Reading fluency', 'Vocabulary', 'Story elements', 'Main idea'],
    '2': [
      'Reading comprehension',
      'Context clues',
      'Compare and contrast',
      "Author's purpose",
      'Nonfiction',
    ],
    '3': ['Inferencing', 'Text evidence', 'Literary devices', 'Summary writing', 'Research skills'],
  },
  science: {
    K: [...SCIENCE_PLACEHOLDER_TOPICS],
    '1': [...SCIENCE_PLACEHOLDER_TOPICS],
    '2': [...SCIENCE_PLACEHOLDER_TOPICS],
    '3': [...SCIENCE_PLACEHOLDER_TOPICS],
  },
};

/**
 * Returns the topic list for one subject and grade.
 * Example: getTopics('math', 'K') → ["Counting to 10", ...]
 */
export function getTopics(subject: TopicSubject, gradeBand: GradeBand): string[] {
  return TOPIC_MAP[subject][gradeBand];
}
