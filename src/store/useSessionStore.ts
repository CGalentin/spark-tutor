// Zustand store for active session state — tracks the current tutoring session.
// Synced to Firestore via API routes; this store is the local mirror for UI updates.

'use client';

import { create } from 'zustand';
import type { Subject } from '@/types';

interface SessionStore {
  /** Firestore session document ID — null when no session is active. */
  sessionId: string | null;
  /** The subject being studied this session. */
  subject: Subject | null;
  /** Number of stars earned so far this session. */
  starsEarned: number;
  /** Total messages exchanged this session — drives the progress bar. */
  messageCount: number;
  /** True while waiting for a Claude response to stream back. */
  isChatLoading: boolean;
  /** True while the session end flow is running. */
  isSessionEnding: boolean;

  /** Starts a new session with the given subject and session ID from Firestore. */
  startSession: (sessionId: string, subject: Subject) => void;
  /** Increments the star count by one. */
  addStar: () => void;
  /** Increments the message count by one. */
  incrementMessageCount: () => void;
  /** Sets the chat loading state. */
  setIsChatLoading: (loading: boolean) => void;
  /** Sets the session ending state. */
  setIsSessionEnding: (ending: boolean) => void;
  /** Resets all session state back to initial values. */
  endSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null,
  subject: null,
  starsEarned: 0,
  messageCount: 0,
  isChatLoading: false,
  isSessionEnding: false,

  startSession: (sessionId, subject) =>
    set({ sessionId, subject, starsEarned: 0, messageCount: 0 }),

  addStar: () => set((state) => ({ starsEarned: state.starsEarned + 1 })),

  incrementMessageCount: () => set((state) => ({ messageCount: state.messageCount + 1 })),

  setIsChatLoading: (loading) => set({ isChatLoading: loading }),

  setIsSessionEnding: (ending) => set({ isSessionEnding: ending }),

  endSession: () =>
    set({
      sessionId: null,
      subject: null,
      starsEarned: 0,
      messageCount: 0,
      isChatLoading: false,
      isSessionEnding: false,
    }),
}));
