// Builds the prompt for the Gemini Flash evaluator agent.
// This is NOT the Teacher prompt (Claude talks to the child).
// Gemini Flash only returns JSON for the parent dashboard — never shown to the child.

import { GRADE_BAND_CONFIGS, type GradeBand } from '@/constants/gradeBands';
import { getTopics, type TopicSubject } from '@/constants/topicMap';
import type { Message } from '@/types';
import { MASTERED_SCORE } from '@/types/learningPath';

const GRADE_SEQUENCE: GradeBand[] = ['K', '1', '2', '3'];
const TOPIC_SUBJECTS: TopicSubject[] = ['math', 'reading', 'science'];

export interface BuildEvaluatorPromptOptions {
  topic: string;
  /** Tutoring grade from src/constants/gradeBands.ts — not the RAG GradeBand. */
  grade: GradeBand;
  messages: Message[];
}

/**
 * Returns the full evaluator prompt: rubric, transcript, curriculum list, JSON contract.
 */
export function buildEvaluatorPrompt({
  topic,
  grade,
  messages,
}: BuildEvaluatorPromptOptions): string {
  const gradeLabel = GRADE_BAND_CONFIGS[grade].label;
  const transcript = formatTranscript(messages);
  const curriculum = formatCurriculumContext(topic, grade);

  return [
    "You are the Spark Tutor Evaluator. You score a child's mastery of one tutoring topic.",
    'Your output is shown to the parent only — never to the child.',
    "Score based on the CHILD's responses, not the mascot's teaching quality.",
    '',
    `Topic: ${topic}`,
    `Grade band: ${grade} (${gradeLabel})`,
    '',
    'GRADING RUBRIC (score 0-100):',
    '- 0-40: Child is struggling, needs more practice on this topic',
    '- 41-70: Child shows partial understanding, needs reinforcement',
    `- 71-${MASTERED_SCORE - 1}: Child is close, one more topic block recommended`,
    `- ${MASTERED_SCORE}-100: Child has mastered this topic, ready to advance`,
    '',
    `Set mastered to true only when score is ${MASTERED_SCORE} or higher. Otherwise mastered is false.`,
    '',
    'CONFIDENCE:',
    '- high: several clear child answers that consistently show the same level of understanding',
    '- medium: some evidence, but mixed or short answers',
    '- low: very few child responses, off-topic replies, or the transcript is too thin to judge',
    '',
    'NEXT TOPIC:',
    curriculum,
    `- If score is below ${MASTERED_SCORE}, set suggestedNext to null (stay on the current topic).`,
    `- If score is ${MASTERED_SCORE} or higher, set suggestedNext to the next topic in the curriculum list.`,
    'Never invent a topic name that is not in the list.',
    '',
    'Transcript of this topic block:',
    transcript,
    '',
    'Respond ONLY in valid JSON — no preamble, no markdown fences, no extra text.',
    'Use this exact shape:',
    '{',
    '  "score": number from 0 to 100,',
    `  "mastered": true only if score is ${MASTERED_SCORE} or higher, otherwise false,`,
    '  "confidence": "low" | "medium" | "high",',
    '  "suggestedNext": next topic name as a string, or null,',
    '  "reasoning": one or two sentences for the parent explaining the score',
    '}',
  ].join('\n');
}

/** Turns the chat history into a plain Child/Mascot transcript. */
function formatTranscript(messages: Message[]): string {
  if (messages.length === 0) {
    return '(no messages in this topic block)';
  }

  return messages
    .map((message) => `${message.role === 'child' ? 'Child' : 'Mascot'}: ${message.content}`)
    .join('\n');
}

/**
 * Looks up the current topic in TOPIC_MAP and tells Gemini which topic comes next.
 * Uses the tutoring grade (K/1/2/3), not RAG chunk grades.
 */
function formatCurriculumContext(topic: string, grade: GradeBand): string {
  const match = findTopicLocation(topic, grade);

  if (match === null) {
    const mathTopics = getTopics('math', grade).join(', ');
    const readingTopics = getTopics('reading', grade).join(', ');
    return [
      `Current topic "${topic}" was not found in the ${GRADE_BAND_CONFIGS[grade].label} curriculum list.`,
      `Grade ${grade} math topics in order: ${mathTopics}`,
      `Grade ${grade} reading topics in order: ${readingTopics}`,
      'Pick the most logical next topic from those lists, or null if unsure.',
    ].join('\n');
  }

  const { subject, topics, index } = match;
  const numbered = topics
    .map((name, i) => `${i + 1}. ${name}${name === topic ? ' (current)' : ''}`)
    .join('\n');

  return [
    `Subject: ${subject}`,
    `${GRADE_BAND_CONFIGS[grade].label} ${subject} topics in order:`,
    numbered,
    nextTopicHint(subject, grade, topics, index),
  ].join('\n');
}

/** Explains the next topic in sequence, including rolling into the next grade. */
function nextTopicHint(
  subject: TopicSubject,
  grade: GradeBand,
  topics: string[],
  index: number,
): string {
  const nextInGrade = index < topics.length - 1 ? topics[index + 1] : undefined;
  if (nextInGrade !== undefined) {
    return `If this topic is mastered, the next topic in sequence is "${nextInGrade}".`;
  }

  const nextGrade = nextGradeAfter(grade);
  if (nextGrade === undefined) {
    return `This is the last listed ${subject} topic. If mastered, set suggestedNext to null.`;
  }

  const nextGradeFirst = getTopics(subject, nextGrade)[0];
  if (nextGradeFirst === undefined) {
    return `This is the last listed ${subject} topic. If mastered, set suggestedNext to null.`;
  }

  return (
    `This is the last ${subject} topic for ${GRADE_BAND_CONFIGS[grade].label}. ` +
    `If mastered, the next topic is "${nextGradeFirst}" ` +
    `(first ${subject} topic in ${GRADE_BAND_CONFIGS[nextGrade].label}).`
  );
}

interface TopicLocation {
  subject: TopicSubject;
  topics: string[];
  index: number;
}

/** Finds which subject list (math/reading/science) contains this topic at this grade. */
function findTopicLocation(topic: string, grade: GradeBand): TopicLocation | null {
  for (const subject of TOPIC_SUBJECTS) {
    const topics = getTopics(subject, grade);
    const index = topics.indexOf(topic);
    if (index !== -1) {
      return { subject, topics, index };
    }
  }

  return null;
}

function nextGradeAfter(grade: GradeBand): GradeBand | undefined {
  const i = GRADE_SEQUENCE.indexOf(grade);
  if (i === -1 || i === GRADE_SEQUENCE.length - 1) {
    return undefined;
  }

  return GRADE_SEQUENCE[i + 1];
}
