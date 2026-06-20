// WellDoneScreen — full-screen celebration shown when the child ends a session.
// Displays the stars earned and a warm message before the child leaves the app.
// The parent summary generates asynchronously in the background while this shows.

'use client';

interface WellDoneScreenProps {
  /** Fictional mascot name the child chose. */
  mascotName: string;
  /** Number of stars earned this session. */
  starsEarned: number;
}

/** Full-screen celebration card shown after the child ends their session. */
export function WellDoneScreen({ mascotName, starsEarned }: WellDoneScreenProps) {
  const starRow =
    starsEarned > 0
      ? Array.from({ length: Math.min(starsEarned, 10) }).map((_, i) => (
          <span key={i} className="text-4xl" aria-hidden="true">
            ⭐
          </span>
        ))
      : null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-6 py-12 text-center">
      <div className="mb-4 text-7xl" aria-hidden="true">
        🎉
      </div>

      <h1 className="mb-3 text-4xl font-extrabold text-slate-800">Great job today!</h1>

      <p className="mb-6 text-xl text-slate-500">You and {mascotName} did amazing work together!</p>

      {starRow !== null && (
        <div
          className="mb-6 flex flex-wrap justify-center gap-1"
          aria-label={`You earned ${starsEarned} star${starsEarned === 1 ? '' : 's'} today`}
        >
          {starRow}
        </div>
      )}

      {starsEarned === 0 && (
        <p className="mb-6 text-xl font-semibold text-slate-600">
          Keep going — stars are coming! ✨
        </p>
      )}

      <p className="max-w-xs text-lg text-slate-400">
        Your grown-up can see what you learned today on their screen.
      </p>
    </div>
  );
}
