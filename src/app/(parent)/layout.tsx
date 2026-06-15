// Protected layout for all parent-facing routes (/dashboard, etc.).
// Redirects unauthenticated users to /login.
// Shows a loading spinner while Firebase Auth resolves the initial session.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ParentLayoutProps {
  children: React.ReactNode;
}

/** Route guard — only renders children once a parent is confirmed authenticated. */
export default function ParentLayout({ children }: ParentLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    // Only redirect after Firebase has finished resolving the initial auth state.
    // Without this guard, the page would flash a redirect on every hard refresh
    // before the auth listener has a chance to fire.
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Show spinner while Firebase is still determining auth state on page load.
  if (isAuthLoading) {
    return <LoadingSpinner message="Loading…" />;
  }

  // Return null (blank) during the brief moment after isAuthLoading=false
  // but before the router.replace('/login') navigation completes.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
