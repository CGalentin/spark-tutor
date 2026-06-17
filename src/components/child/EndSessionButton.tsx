// EndSessionButton — "All Done!" button shown in the child chat screen.
// Calls /api/session/end to finalize the session in Firestore, then shows
// the WellDoneScreen so the child sees a celebration before the parent dashboard.

'use client';

interface EndSessionButtonProps {
  /** Whether the button should be disabled (e.g. while a message is loading). */
  disabled?: boolean;
  /** Called when the child taps "All Done!" — parent component handles the API call. */
  onEndSession: () => void;
}

/** Large, touch-safe "All Done!" button for ending the current session. */
export function EndSessionButton({ disabled = false, onEndSession }: EndSessionButtonProps) {
  return (
    <button
      onClick={onEndSession}
      disabled={disabled}
      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3 text-lg font-bold text-white shadow-sm transition-all hover:bg-emerald-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="End session"
    >
      <span aria-hidden="true">🎉</span>
      All Done!
    </button>
  );
}
