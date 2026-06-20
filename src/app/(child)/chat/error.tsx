// Next.js error boundary for the child chat route.
// Must be a Client Component — the App Router requires this for error.tsx files.
// Shows a child-friendly message; never exposes technical error details to the child.

'use client';

import { ErrorMessage } from '@/components/shared/ErrorMessage';

interface ChatErrorProps {
  /** The error that caused the boundary to activate. */
  error: Error & { digest?: string };
  /** Callback provided by Next.js to attempt re-rendering the route segment. */
  reset: () => void;
}

/** Error boundary for the chat route — shows a warm child-safe fallback. */
export default function ChatError({ reset }: ChatErrorProps) {
  return (
    <ErrorMessage
      variant="child"
      message="Oops! Something went a little sideways. Let's try again! 🌟"
      onRetry={reset}
    />
  );
}
