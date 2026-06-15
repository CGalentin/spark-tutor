// Reusable full-screen loading spinner shown while auth state is resolving.
// Used by route guards to prevent a flash of protected content.

interface LoadingSpinnerProps {
  /** Optional message displayed below the spinner. */
  message?: string;
}

/** Full-screen centered spinner for loading states. */
export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"
        role="status"
        aria-label="Loading"
      />
      {message !== undefined && (
        <p className="text-sm text-slate-500">{message}</p>
      )}
    </div>
  );
}
