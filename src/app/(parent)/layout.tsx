// Protected layout for all parent-facing routes (/dashboard, etc.).
// Redirects unauthenticated users to /login.
// Renders a simple nav bar with Dashboard and Sign Out links.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ParentLayoutProps {
  children: React.ReactNode;
}

/** Route guard + nav bar — only renders children once a parent is confirmed authenticated. */
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

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Top nav bar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-3 py-3 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              ⭐
            </span>
            <span className="font-semibold text-slate-700">Spark Tutor</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-slate-600"
            >
              Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8">{children}</main>
    </div>
  );
}
