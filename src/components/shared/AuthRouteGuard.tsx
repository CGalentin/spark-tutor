// Client component used inside the (auth) layout to redirect parents who are
// already signed in away from /login and /signup to /dashboard.
// Kept separate from AuthProvider so the auth layout stays a Server Component
// (which is required for its metadata export to work).

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

/** Redirects an already-authenticated parent away from auth pages to /dashboard. */
export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Render nothing while auth is resolving or while the redirect is in-flight.
  // This prevents a flash of the login form for parents who are already signed in.
  if (isAuthLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
