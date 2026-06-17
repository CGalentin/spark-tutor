// useStars — hook that manages star awarding for the active session.
// Listens for [STAR EARNED] events from the chat stream, updates the local store,
// and syncs the new star count to Firestore so the parent dashboard shows the right total.

'use client';

import { useCallback } from 'react';
import { auth } from '@/lib/firebase/config';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/useAuthStore';

interface UseStarsReturn {
  /** Current star count for this session. */
  starsEarned: number;
  /** Awards one star and syncs to Firestore. Call when Claude emits [STAR EARNED]. */
  awardStar: () => Promise<void>;
}

/** Manages star awarding logic for the current session. */
export function useStars(): UseStarsReturn {
  const starsEarned = useSessionStore((s) => s.starsEarned);
  const sessionId = useSessionStore((s) => s.sessionId);
  const addStar = useSessionStore((s) => s.addStar);
  const parentUID = useAuthStore((s) => s.parentUID);

  const awardStar = useCallback(async () => {
    // Always update local state immediately for instant UI feedback
    addStar();

    // Sync the new total to Firestore — non-fatal if it fails
    if (sessionId === null || parentUID === null) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      if (token === undefined || token === '') return;

      // Use the star-sync API route so we never write Firestore from the client directly
      await fetch('/api/session/star', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Star count is tracked locally — Firestore sync failure is non-fatal
    }
  }, [addStar, sessionId, parentUID]);

  return { starsEarned, awardStar };
}
