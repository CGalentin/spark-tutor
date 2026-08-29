// SessionProgressBar — visual progress indicator for the active tutoring session.
// Shows how far through a 10-message session the child is, plus the current star count.
// Uses bright, kid-friendly colors and large touch-safe sizing.

'use client';

import { useSessionStore } from '@/store/useSessionStore';

/** Number of messages that fills the bar to 100%. */
const SESSION_LENGTH = 10;

/** Session progress bar displayed at the top of the chat screen. */
export function SessionProgressBar() {
  const messageCount = useSessionStore((s) => s.messageCount);
  const starsEarned = useSessionStore((s) => s.starsEarned);

  // Cap at 100% so the bar doesn't overflow if the session runs long
  const progressPercent = Math.min((messageCount / SESSION_LENGTH) * 100, 100);

  return (
    <div className="flex items-center gap-3 px-4 py-2" aria-label="Session progress">
      {/* Progress bar track */}
      <div
        className="relative h-4 flex-1 overflow-hidden rounded-full bg-violet-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPercent)}
        aria-label={`${messageCount} of ${SESSION_LENGTH} messages`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Star count badge — only visible after the first star is earned */}
      {starsEarned > 0 && (
        <div
          className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-base font-bold text-yellow-700"
          aria-label={`${starsEarned} star${starsEarned === 1 ? '' : 's'} earned`}
        >
          <span aria-hidden="true">⭐</span>
          <span>{starsEarned}</span>
        </div>
      )}
    </div>
  );
}
