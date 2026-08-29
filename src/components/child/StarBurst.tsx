// StarBurst — animated star that pops when the child earns a star.
// Renders as an overlay that auto-dismisses after the CSS animation completes.
// Uses a CSS keyframe animation via a <style> tag so we don't need a JS animation library.

'use client';

import { useEffect, useState } from 'react';

interface StarBurstProps {
  /** When this flips to true, the burst animation plays once. */
  triggered: boolean;
  /** Called after the animation finishes so the parent can reset the trigger. */
  onComplete: () => void;
}

/** Full-screen star burst overlay that plays a quick celebration animation. */
export function StarBurst({ triggered, onComplete }: StarBurstProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!triggered) return;

    // Intentional setState-in-effect: visible is an animation trigger that must
    // turn on in the same tick as the effect, then auto-off via the timer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);

    // Animation duration matches the CSS keyframe duration (800ms)
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 900);

    return () => clearTimeout(timer);
  }, [triggered, onComplete]);

  if (!visible) return null;

  return (
    <>
      {/* Inline keyframes — avoids needing globals.css changes */}
      <style>{`
        @keyframes starPop {
          0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          40%  { transform: scale(1.4) rotate(8deg);  opacity: 1; }
          70%  { transform: scale(0.9) rotate(-4deg); opacity: 1; }
          100% { transform: scale(1.2) rotate(0deg);  opacity: 0; }
        }
        .star-pop {
          animation: starPop 0.8s ease-out forwards;
        }
      `}</style>

      {/* Semi-transparent overlay so the star pops over the chat */}
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        aria-live="polite"
        aria-label="Star earned!"
      >
        <span
          className="star-pop text-[120px] leading-none select-none"
          role="img"
          aria-hidden="true"
        >
          ⭐
        </span>
      </div>
    </>
  );
}
