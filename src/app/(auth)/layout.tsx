// Shared layout for all auth routes (/login, /signup).
// Centers the auth card on a light background with Spark Tutor branding above it.
// Wraps children in AuthRouteGuard to redirect parents who are already signed in.
// Kept as a Server Component so metadata export works correctly.

import type { Metadata } from 'next';
import { AuthRouteGuard } from '@/components/shared/AuthRouteGuard';

export const metadata: Metadata = {
  title: 'Spark Tutor — Sign In',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

/** Full-screen centered layout for parent authentication pages. */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthRouteGuard>
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
        {/* Spark Tutor brand header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl" aria-hidden="true">
            ✨
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Spark Tutor</h1>
          <p className="mt-1.5 text-sm text-slate-500">K–1 AI tutoring for curious kids</p>
        </div>

        {/* Auth card — children render the login or signup form */}
        <div className="w-full max-w-sm">{children}</div>

        {/* Footer */}
        <p className="mt-8 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Spark Tutor &middot;{' '}
          <a href="/privacy" className="underline-offset-4 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </AuthRouteGuard>
  );
}
