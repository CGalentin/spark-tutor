// Types for the v2 agentic learning path stored in Firestore.
// Lives at: users/{parentUID}/learningPath/{subject}  (e.g. .../learningPath/math)
// All child progress is stored under the parent UID — COPPA: no child accounts.
//
// Timestamp comes from the client Firestore SDK (import type only) so this file
// is safe to import from both server routes and the parent dashboard. The Admin
// SDK has its own Timestamp class; PR 2-05 helpers will map between them.

import type { Timestamp } from 'firebase/firestore';
import type { GradeBand } from '@/constants/gradeBands';
import type { Subject } from './session';

/** Topic is mastered when the evaluator score is this high or higher. */
export const MASTERED_SCORE = 90;

/** How sure the evaluator is about a mastery score — parent dashboard only. */
export type EvaluationConfidence = 'low' | 'medium' | 'high';

/**
 * How hard Claude should make this topic.
 * getDifficultyHint picks this from the last two scores on the current topic.
 */
export type DifficultyHint = 'easier' | 'normal' | 'harder';

/**
 * Slice of the learning path injected into the Teacher (Claude) system prompt.
 * Not stored in Firestore — built per chat request from the LearningPath document.
 */
export interface LearningPathContext {
  currentTopic: string;
  masteredTopics: string[];
  difficultyHint: DifficultyHint;
}

/**
 * One scored attempt at a topic.
 * `mastered` is true when score is MASTERED_SCORE (90) or higher.
 */
export interface TopicMastery {
  topic: string;
  subject: Subject;
  grade: GradeBand;
  /** Mastery score from 0 to 100. */
  score: number;
  /** True when score >= MASTERED_SCORE (90). */
  mastered: boolean;
  evaluatedAt: Timestamp;
}

/**
 * Persistent learning path for one subject under one parent.
 * The AI suggests the next topic; the parent must approve before it becomes current.
 */
export interface LearningPath {
  subject: Subject;
  currentGrade: GradeBand;
  currentTopic: string;
  topicsCompleted: string[];
  masteryHistory: TopicMastery[];
  suggestedNextTopic: string | null;
  parentApproved: boolean;
  parentApprovedAt: Timestamp | null;
  lastEvaluatedAt: Timestamp | null;
}

/**
 * Fresh output from the evaluator agent (Gemini Flash) after a session.
 * Shown to the parent only — never injected into the child chat.
 */
export interface EvaluationResult {
  topic: string;
  score: number;
  mastered: boolean;
  confidence: EvaluationConfidence;
  suggestedNext: string | null;
  /** Gemini's brief explanation — parent dashboard only. */
  reasoning: string;
}
