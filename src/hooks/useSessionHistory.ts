// useSessionHistory — fetches the parent's session list from Firestore using onSnapshot.
// Updates in real-time so the parent sees the summary appear as soon as Claude generates it.
// Cancels the Firestore listener when the component unmounts.

'use client';

import { useState, useEffect } from 'react';
import { subscribeToSessions } from '@/lib/firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Session } from '@/types';

interface UseSessionHistoryReturn {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
}

/** Returns a live-updating list of the parent's sessions, most recent first. */
export function useSessionHistory(): UseSessionHistoryReturn {
  const parentUID = useAuthStore((s) => s.parentUID);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentUID === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToSessions(
      parentUID,
      (updatedSessions) => {
        setSessions(updatedSessions);
        setIsLoading(false);
      },
      () => {
        setError('Could not load session history. Please refresh.');
        setIsLoading(false);
      },
    );

    // Cancel the Firestore listener when the component unmounts
    return () => unsubscribe();
  }, [parentUID]);

  return { sessions, isLoading, error };
}
