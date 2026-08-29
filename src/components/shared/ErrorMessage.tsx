// Reusable error display component with two visual modes.
// "child" mode shows a warm, kid-friendly message with a large retry button.
// "parent" mode shows a plain-English message styled with the Shadcn neutral palette.

interface ErrorMessageProps {
  /** The error description to show the user. */
  message: string;
  /** Callback invoked when the user taps/clicks the retry button. */
  onRetry?: () => void;
  /** Visual variant — child UI gets bright colors, parent UI gets neutral Shadcn style. */
  variant?: 'child' | 'parent';
}

/** Displays an error state with an optional retry action. */
export function ErrorMessage({ message, onRetry, variant = 'parent' }: ErrorMessageProps) {
  if (variant === 'child') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-violet-50 to-white px-6 text-center">
        {/* Large emoji keeps the child's attention without technical jargon */}
        <span className="text-7xl" aria-hidden="true">
          🤔
        </span>
        <p className="text-2xl font-bold text-violet-700">{message}</p>
        {onRetry !== undefined && (
          <button
            onClick={onRetry}
            className="min-h-[56px] rounded-3xl bg-violet-500 px-8 py-3 text-xl font-bold text-white transition-all hover:bg-violet-400 active:scale-95"
          >
            Try again!
          </button>
        )}
      </div>
    );
  }

  // Parent (default) variant — clean, readable, Shadcn-aligned
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <p className="text-base text-slate-600">{message}</p>
      {onRetry !== undefined && (
        <button
          onClick={onRetry}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Retry
        </button>
      )}
    </div>
  );
}
