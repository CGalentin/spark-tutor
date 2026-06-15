// Firestore helper functions for reading and writing session data.
// All Firestore access goes through these helpers — never write to Firestore directly from components.
// Full session and summary types will be imported from /types once defined in PR 1-06.

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';

/** Fetches a single session document for a given parent and session ID. */
export async function getSession(
  parentUID: string,
  sessionId: string,
): Promise<DocumentData | null> {
  try {
    const sessionRef = doc(db, 'users', parentUID, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return null;
    }

    return { id: sessionSnap.id, ...sessionSnap.data() };
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
}

/** Fetches all sessions for a parent, ordered by start time descending (most recent first). */
export async function getSessions(parentUID: string): Promise<DocumentData[]> {
  try {
    const sessionsRef = collection(db, 'users', parentUID, 'sessions');
    const sessionsQuery = query(sessionsRef, orderBy('startedAt', 'desc'));
    const querySnap = await getDocs(sessionsQuery);

    return querySnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}

/** Saves an AI-generated session summary under the session document. */
export async function saveSummary(
  parentUID: string,
  sessionId: string,
  summary: {
    topicsCovered: string[];
    areasForPractice: string[];
    encouragementNote: string;
    generatedAt: Date;
  },
): Promise<void> {
  try {
    const summaryRef = doc(db, 'users', parentUID, 'sessions', sessionId, 'summary', 'data');
    await setDoc(summaryRef, summary);
  } catch (error) {
    console.error('Error saving summary:', error);
    throw error;
  }
}
