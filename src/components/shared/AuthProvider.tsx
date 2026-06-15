// Listens to Firebase onAuthStateChanged and keeps useAuthStore in sync.
// Must sit above all route layouts in the component tree so every page
// has access to auth state before rendering.

'use client';

import { useEffect } from 'react';
import { onAuthChange } from '@/lib/firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

/** Subscribes to Firebase auth state and hydrates the global auth store. */
export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    // onAuthChange returns the Firebase unsubscribe fn — return it as cleanup
    // so the listener is removed if this component ever unmounts.
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user.uid, user.email ?? '');
      } else {
        clearUser();
      }
    });

    return unsubscribe;
  }, [setUser, clearUser]);

  return <>{children}</>;
}
