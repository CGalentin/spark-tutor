// Next.js error boundary for the parent dashboard route.
// Must be a Client Component — the App Router requires this for error.tsx files.
// Shows a clear, plain-English message with a retry action.

'use client';

import { ErrorMessage } from '@/components/shared/ErrorMessage';

interface DashboardErrorProps {
  /** The error that caused the boundary to activate. */
  error: Error & { digest?: string };
  /** Callback provided by Next.js to attempt re-rendering the route segment. */
  reset: () => void;
}

/** Error boundary for the parent dashboard — shows a plain-English fallback. */
export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <ErrorMessage
      variant="parent"
      message="We couldn't load your dashboard. Please try again."
      onRetry={reset}
    />
  );
}
