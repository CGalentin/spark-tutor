// Server-only learning-path helpers using the Firebase Admin SDK.
//
// PR 2-05 listed these on firestore.ts, but that file is imported by client hooks
// (useSessionHistory). Importing firebase-admin in the browser would crash the app.
// Dashboard live updates live in firestore.ts as subscribeToLearningPath (client SDK).
//
// Path: users/{parentUID}/learningPath/{subject}  (subject is the document id)
// Never import this file from a Client Component.

import {
  FieldValue,
  Timestamp as AdminTimestamp,
  type DocumentData,
} from 'firebase-admin/firestore';
import { adminDb } from './admin';
import { isGradeBand, type GradeBand } from '@/constants/gradeBands';
import { MASTERED_SCORE, type LearningPath, type Subject, type TopicMastery } from '@/types';

const LEARNING_PATH_COLLECTION = 'learningPath';

/** Admin SDK document reference for one parent's learning path in one subject. */
function learningPathDoc(parentUID: string, subject: Subject) {
  return adminDb
    .collection('users')
    .doc(parentUID)
    .collection(LEARNING_PATH_COLLECTION)
    .doc(subject);
}

/**
 * Reads a learning path document.
 * Returns null if this parent has never started this subject.
 */
export async function getLearningPath(
  parentUID: string,
  subject: Subject,
): Promise<LearningPath | null> {
  try {
    const snap = await learningPathDoc(parentUID, subject).get();
    if (!snap.exists) {
      return null;
    }

    return toLearningPath(snap.data(), subject);
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a learning path for a subject. The first topic is current and already
 * approved (nothing is waiting on the parent yet).
 * If a document already exists, returns it instead of overwriting.
 */
export async function createLearningPath(
  parentUID: string,
  subject: Subject,
  initialTopic: string,
  grade: GradeBand,
): Promise<LearningPath> {
  try {
    const existing = await getLearningPath(parentUID, subject);
    if (existing !== null) {
      return existing;
    }

    const path: LearningPath = {
      subject,
      currentGrade: grade,
      currentTopic: initialTopic,
      topicsCompleted: [],
      masteryHistory: [],
      suggestedNextTopic: null,
      parentApproved: true,
      parentApprovedAt: null,
      lastEvaluatedAt: null,
    };

    await learningPathDoc(parentUID, subject).create(path);
    return path;
  } catch (error) {
    throw error;
  }
}

/**
 * Applies a partial update to an existing learning path.
 * Throws if the document does not exist.
 */
export async function updateLearningPath(
  parentUID: string,
  subject: Subject,
  updates: Partial<Omit<LearningPath, 'subject'>>,
): Promise<void> {
  try {
    await learningPathDoc(parentUID, subject).update(updates);
  } catch (error) {
    throw error;
  }
}

/**
 * Appends one mastery result to history and stamps lastEvaluatedAt.
 * Sets `mastered` from the score (true when score >= MASTERED_SCORE) so callers cannot drift.
 */
export async function saveMasteryResult(
  parentUID: string,
  subject: Subject,
  result: TopicMastery,
): Promise<void> {
  try {
    const mastered = result.score >= MASTERED_SCORE;
    const entry: TopicMastery = {
      ...result,
      subject,
      mastered,
      evaluatedAt: result.evaluatedAt,
    };

    await learningPathDoc(parentUID, subject).update({
      masteryHistory: FieldValue.arrayUnion({
        ...entry,
        evaluatedAt: entry.evaluatedAt ?? AdminTimestamp.now(),
      }),
      lastEvaluatedAt: AdminTimestamp.now(),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Turns a raw Firestore document into a typed LearningPath.
 * Throws if required fields are missing or the grade value is not K/1/2/3.
 */
function toLearningPath(data: DocumentData | undefined, subject: Subject): LearningPath {
  if (data === undefined) {
    throw new Error(`Learning path document for ${subject} has no data.`);
  }

  if (!isGradeBand(data['currentGrade'])) {
    throw new Error(`Learning path for ${subject} has an invalid currentGrade.`);
  }

  if (typeof data['currentTopic'] !== 'string' || data['currentTopic'].length === 0) {
    throw new Error(`Learning path for ${subject} is missing currentTopic.`);
  }

  return {
    subject,
    currentGrade: data['currentGrade'],
    currentTopic: data['currentTopic'],
    topicsCompleted: Array.isArray(data['topicsCompleted'])
      ? (data['topicsCompleted'] as string[])
      : [],
    masteryHistory: Array.isArray(data['masteryHistory'])
      ? (data['masteryHistory'] as TopicMastery[])
      : [],
    suggestedNextTopic:
      typeof data['suggestedNextTopic'] === 'string' ? data['suggestedNextTopic'] : null,
    parentApproved: data['parentApproved'] === true,
    parentApprovedAt: data['parentApprovedAt'] ?? null,
    lastEvaluatedAt: data['lastEvaluatedAt'] ?? null,
  };
}
