// One column of learning-path scores: topic, grade, score band, and the date it was scored.

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MASTERED_SCORE } from '@/types';

/** Yellow starts here, matching the mastery ring. Green still starts at 90. */
const ALMOST_THERE_SCORE = 50;

type ScoreBand = 'building' | 'almost' | 'mastered';

/** One scored topic, already sorted by the subject section. */
export interface LearningPathTimelineEntry {
  key: string;
  topic: string;
  grade: string;
  score: number;
  dateLabel: string;
  inProgress: boolean;
}

interface LearningPathScoreListProps {
  entries: LearningPathTimelineEntry[];
}

const BAND_CLASS: Record<ScoreBand, string> = {
  building: 'border-transparent bg-red-100 text-red-800',
  almost: 'border-transparent bg-yellow-100 text-yellow-900',
  mastered: 'border-transparent bg-green-100 text-green-800',
};

/** Same bands as the mastery ring: red under 50, yellow through 89, green at 90. */
function scoreBand(score: number): ScoreBand {
  if (score >= MASTERED_SCORE) return 'mastered';
  if (score >= ALMOST_THERE_SCORE) return 'almost';
  return 'building';
}

/** Short label next to the score. "Mastered!" uses the same 90 cutoff as the evaluator. */
function bandLabel(band: ScoreBand): 'Building' | 'Almost there' | 'Mastered!' {
  if (band === 'mastered') return 'Mastered!';
  if (band === 'almost') return 'Almost there';
  return 'Building';
}

/** Renders the score rows for one slice of a subject's history. */
export function LearningPathScoreList({ entries }: LearningPathScoreListProps) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => {
        const band = scoreBand(entry.score);
        return (
          <li key={entry.key} className="flex flex-col gap-2 border-l-2 border-slate-200 py-3 pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-medium text-slate-900">{entry.topic}</p>
              <Badge variant="outline" className="h-auto px-2 py-1 text-base">
                Grade {entry.grade}
              </Badge>
              {entry.inProgress && (
                <Badge variant="secondary" className="h-auto px-2 py-1 text-base">
                  In progress
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn('h-auto px-2 py-1 text-base', BAND_CLASS[band])}>
                {entry.score} · {bandLabel(band)}
              </Badge>
              <span className="text-base text-slate-600">{entry.dateLabel}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
