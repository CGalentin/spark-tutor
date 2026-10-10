// useLiveSession — listens for a tutoring session that has not ended yet.
// The parent dashboard uses this to show the live mastery ring.
// The Firestore listener is cancelled when the component unmounts.

'use client';

import { useEffect, useState } from 'react';
import { subscribeToSessions } from '@/lib/firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Session } from '@/types';

interface UseLiveSessionReturn {
  /** True when the child has a session with no end time. */
  isActive: boolean;
  /** The newest open session, or null when the child is not learning. */
  currentSession: Session | null;
  /** Latest evaluator score on that session. Zero until the first score is saved. */
  mastery: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Newest session that has not ended.
 * Session start does not write endedAt, so a missing end time means the session is still open.
 * The list from subscribeToSessions is already newest first.
 */
function findOpenSession(sessions: Session[]): Session | null {
  return sessions.find((session) => session.endedAt === undefined) ?? null;
}

/** Latest score on the open session. Zero until the evaluator writes one. */
function latestMasteryScore(session: Session | null): number {
  if (session === null) {
    return 0;
  }

  const latest = session.evaluations?.[session.evaluations.length - 1];
  return latest?.score ?? 0;
}

/** Live view of the child's open session and the newest mastery score. */
export function useLiveSession(): UseLiveSessionReturn {
  const parentUID = useAuthStore((s) => s.parentUID);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentUID === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSession(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToSessions(
      parentUID,
      (sessions) => {
        setCurrentSession(findOpenSession(sessions));
        setIsLoading(false);
      },
      () => {
        setCurrentSession(null);
        setError('We could not check for a live session. Please refresh.');
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [parentUID]);

  return {
    isActive: currentSession !== null,
    currentSession,
    mastery: latestMasteryScore(currentSession),
    isLoading,
    error,
  };
}
