// Zustand store for active session state — tracks the current tutoring session.
// Synced to Firestore via API routes; this store is the local mirror for UI updates.

'use client';

import { create } from 'zustand';
import type { GradeBand } from '@/constants';
import type { Subject } from '@/types';

interface SessionStore {
  /** Firestore session document ID — null when no session is active. */
  sessionId: string | null;
  /** The subject being studied this session. */
  subject: Subject | null;
  /** Topic from the parent's learning path for this subject. Empty when no session. */
  currentTopic: string;
  /** Tutoring grade band (K–3). Defaults to Kindergarten until a path exists. */
  currentGrade: GradeBand;
  /** Number of stars earned so far this session. */
  starsEarned: number;
  /** Total messages exchanged this session — drives the progress bar. */
  messageCount: number;
  /**
   * Child messages in the current topic block.
   * Resets to 0 after the evaluator runs (PR 2-12). Separate from messageCount.
   */
  topicMessageCount: number;
  /** True while waiting for a Claude response to stream back. */
  isChatLoading: boolean;
  /** True while the session end flow is running. */
  isSessionEnding: boolean;

  /** Starts a new session with the Firestore ID plus learning-path topic and grade. */
  startSession: (
    sessionId: string,
    subject: Subject,
    currentTopic: string,
    currentGrade: GradeBand,
  ) => void;
  /** Increments the star count by one. */
  addStar: () => void;
  /** Increments the message count by one. */
  incrementMessageCount: () => void;
  /** Increments the topic-block counter by one (one child message). */
  incrementTopicMessageCount: () => void;
  /** Clears the topic-block counter after an evaluation (or a new session). */
  resetTopicMessageCount: () => void;
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
  currentTopic: '',
  currentGrade: 'K',
  starsEarned: 0,
  messageCount: 0,
  topicMessageCount: 0,
  isChatLoading: false,
  isSessionEnding: false,

  startSession: (sessionId, subject, currentTopic, currentGrade) =>
    set({
      sessionId,
      subject,
      currentTopic,
      currentGrade,
      starsEarned: 0,
      messageCount: 0,
      topicMessageCount: 0,
    }),

  addStar: () => set((state) => ({ starsEarned: state.starsEarned + 1 })),

  incrementMessageCount: () => set((state) => ({ messageCount: state.messageCount + 1 })),

  incrementTopicMessageCount: () =>
    set((state) => ({ topicMessageCount: state.topicMessageCount + 1 })),

  resetTopicMessageCount: () => set({ topicMessageCount: 0 }),

  setIsChatLoading: (loading) => set({ isChatLoading: loading }),

  setIsSessionEnding: (ending) => set({ isSessionEnding: ending }),

  endSession: () =>
    set({
      sessionId: null,
      subject: null,
      currentTopic: '',
      currentGrade: 'K',
      starsEarned: 0,
      messageCount: 0,
      topicMessageCount: 0,
      isChatLoading: false,
      isSessionEnding: false,
    }),
}));
