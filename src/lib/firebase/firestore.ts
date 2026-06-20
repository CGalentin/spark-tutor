// Firestore helper functions for reading and writing session data.
// All Firestore access goes through these helpers — never write to Firestore directly from components.

import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { Session } from '@/types';

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
    throw error;
  }
}

/**
 * Subscribes to a parent's session list using onSnapshot — calls the callback
 * whenever a session is added or updated (e.g., summary becomes available).
 * Returns the unsubscribe function — call it in useEffect cleanup.
 */
export function subscribeToSessions(
  parentUID: string,
  onData: (sessions: Session[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const sessionsRef = collection(db, 'users', parentUID, 'sessions');
  const sessionsQuery = query(sessionsRef, orderBy('startedAt', 'desc'));

  return onSnapshot(
    sessionsQuery,
    (snap) => {
      const sessions = snap.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        return {
          id: docSnap.id,
          parentUID: data['parentUID'] as string,
          characterType: (data['characterType'] as string | undefined) ?? '',
          characterName: (data['characterName'] as string | undefined) ?? '',
          subject: data['subject'] as Session['subject'],
          startedAt:
            (data['startedAt'] as { toDate: () => Date } | undefined)?.toDate() ?? new Date(),
          endedAt: (data['endedAt'] as { toDate: () => Date } | undefined)?.toDate(),
          messageCount: (data['messageCount'] as number | undefined) ?? 0,
          starsEarned: (data['starsEarned'] as number | undefined) ?? 0,
          summary: data['summary']
            ? {
                topicsCovered: (data['summary']['topicsCovered'] as string[]) ?? [],
                areasForPractice: (data['summary']['areasForPractice'] as string[]) ?? [],
                encouragementNote: (data['summary']['encouragementNote'] as string) ?? '',
                generatedAt:
                  (
                    data['summary']['generatedAt'] as { toDate: () => Date } | undefined
                  )?.toDate() ?? new Date(),
              }
            : undefined,
        } satisfies Session;
      });

      onData(sessions);
    },
    (error) => onError(error),
  );
}
