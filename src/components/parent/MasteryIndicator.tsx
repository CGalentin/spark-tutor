// MasteryIndicator — circular score ring for the parent dashboard.
// The score arrives as a prop and the arc eases to the new value.
// Live Firestore updates are PR 2-21. This file does not subscribe, and it is not on the dashboard yet.

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MASTERED_SCORE } from '@/types';

/**
 * Yellow starts here.
 * The evaluator calls 71–89 "close". This ring paints a wider yellow band, 50–89, on purpose.
 */
const ALMOST_THERE_SCORE = 50;

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type RingBand = 'building' | 'almost' | 'mastered';

interface MasteryIndicatorProps {
  topic: string;
  score: number;
}

/** Keeps a mastery score inside 0–100. Anything that is not a real number becomes 0. */
function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/** Picks the ring color. Green starts at MASTERED_SCORE (90), yellow at 50. */
function getRingBand(score: number): RingBand {
  if (score >= MASTERED_SCORE) return 'mastered';
  if (score >= ALMOST_THERE_SCORE) return 'almost';
  return 'building';
}

/** Words shown on the badge. "Mastered!" uses the same 90 cutoff as the evaluator. */
function confidenceLabel(band: RingBand): 'Building' | 'Almost there' | 'Mastered!' {
  if (band === 'mastered') return 'Mastered!';
  if (band === 'almost') return 'Almost there';
  return 'Building';
}

/** Empty amount of the ring. A full circumference is an empty ring; 0 is a full ring. */
function ringDashOffset(score: number): number {
  return RING_CIRCUMFERENCE - (score / 100) * RING_CIRCUMFERENCE;
}

const RING_STROKE: Record<RingBand, string> = {
  building: 'stroke-red-500',
  almost: 'stroke-yellow-500',
  mastered: 'stroke-green-500',
};

const BADGE_CLASS: Record<RingBand, string> = {
  building: 'border-transparent bg-red-100 text-red-800',
  almost: 'border-transparent bg-yellow-100 text-yellow-900',
  mastered: 'border-transparent bg-green-100 text-green-800',
};

/** Circular mastery ring with the topic name, the score, and a confidence badge. */
export function MasteryIndicator({ topic, score }: MasteryIndicatorProps) {
  const clampedScore = clampScore(score);
  const band = getRingBand(clampedScore);
  const label = confidenceLabel(band);
  const ariaLabel = `${topic}, mastery score ${clampedScore} out of 100, ${label}`;

  return (
    <div role="img" aria-label={ariaLabel} className="flex items-center gap-4">
      <div className="relative size-28 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-slate-200"
          />
          {/*
            The arc length has to be a CSS property, not only an SVG attribute,
            or the browser jumps to the new score instead of easing.
          */}
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap={clampedScore === 0 ? 'butt' : 'round'}
            strokeDasharray={RING_CIRCUMFERENCE}
            style={{ strokeDashoffset: ringDashOffset(clampedScore) }}
            className={cn(
              'transition-all duration-700 ease-out motion-reduce:transition-none',
              RING_STROKE[band],
            )}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums text-slate-900">
          {clampedScore}
        </span>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-2">
        <p className="text-base font-medium text-slate-900">{topic}</p>
        <Badge variant="outline" className={cn('h-auto px-2.5 py-1 text-base', BADGE_CLASS[band])}>
          {label}
        </Badge>
      </div>
    </div>
  );
}
