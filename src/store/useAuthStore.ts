// Zustand store for auth state — mirrors Firebase Auth for use across the app.
// The AuthProvider (PR 1-10) populates this store via onAuthStateChanged.

'use client';

import { create } from 'zustand';

interface AuthStore {
  /** Firebase UID of the authenticated parent — null if not logged in. */
  parentUID: string | null;
  /** Parent's email address — used for display in the dashboard. */
  parentEmail: string | null;
  /** True once Firebase Auth has resolved the initial auth state check. */
  isAuthenticated: boolean;
  /** True while the initial Firebase Auth state is still being determined on load. */
  isAuthLoading: boolean;

  /** Called by AuthProvider when a parent signs in successfully. */
  setUser: (uid: string, email: string) => void;
  /** Called by AuthProvider when the parent signs out or session expires. */
  clearUser: () => void;
  /** Sets the auth loading state. */
  setIsAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  parentUID: null,
  parentEmail: null,
  isAuthenticated: false,
  isAuthLoading: true,

  setUser: (uid, email) =>
    set({ parentUID: uid, parentEmail: email, isAuthenticated: true, isAuthLoading: false }),

  clearUser: () =>
    set({ parentUID: null, parentEmail: null, isAuthenticated: false, isAuthLoading: false }),

  setIsAuthLoading: (loading) => set({ isAuthLoading: loading }),
}));
