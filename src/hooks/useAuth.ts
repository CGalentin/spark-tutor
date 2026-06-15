// Custom hook for reading auth state throughout the app.
// Wraps useAuthStore with individual selectors to avoid unnecessary re-renders.

'use client';

import { useAuthStore } from '@/store/useAuthStore';

export interface UseAuthReturn {
  /** Firebase UID of the signed-in parent — null if not authenticated. */
  parentUID: string | null;
  /** Parent's email address — null if not authenticated. */
  parentEmail: string | null;
  /** True once Firebase Auth has confirmed a signed-in user. */
  isAuthenticated: boolean;
  /** True while Firebase Auth is still resolving the initial session on page load. */
  isAuthLoading: boolean;
}

/** Returns the current Firebase auth state from the global Zustand store. */
export function useAuth(): UseAuthReturn {
  const parentUID = useAuthStore((s) => s.parentUID);
  const parentEmail = useAuthStore((s) => s.parentEmail);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  return { parentUID, parentEmail, isAuthenticated, isAuthLoading };
}
