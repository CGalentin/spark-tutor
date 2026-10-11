// SessionSummaryCard — displays a single session's details and AI-generated summary.
// Used in the parent dashboard to show date, subject, stars, topics, and encouragement.
// The mastery badge reads session.evaluations. A missing score is not shown as 0.

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MASTERED_SCORE } from '@/types';
import type { EvaluationResult, Session } from '@/types';

interface SessionSummaryCardProps {
  session: Session;
}

/**
 * Yellow starts here, matching the mastery ring.
 * The evaluator calls 71–89 "close". This badge uses the wider yellow band, 50–89.
 */
const ALMOST_THERE_SCORE = 50;

type ScoreBand = 'building' | 'almost' | 'mastered';

const BAND_CLASS: Record<ScoreBand, string> = {
  building: 'border-transparent bg-red-100 text-red-800',
  almost: 'border-transparent bg-yellow-100 text-yellow-900',
  mastered: 'border-transparent bg-green-100 text-green-800',
};

/** Formats a Date as a readable locale string like "Jun 17, 2026". */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Keeps a real score inside 0–100. Only call this when an evaluation exists. */
function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/** Same bands as the mastery ring. Green starts at MASTERED_SCORE (90), yellow at 50. */
function scoreBand(score: number): ScoreBand {
  if (score >= MASTERED_SCORE) return 'mastered';
  if (score >= ALMOST_THERE_SCORE) return 'almost';
  return 'building';
}

/** Words on the badge. "Mastered!" uses the same 90 cutoff as the evaluator. */
function bandLabel(band: ScoreBand): 'Building' | 'Almost there' | 'Mastered!' {
  if (band === 'mastered') return 'Mastered!';
  if (band === 'almost') return 'Almost there';
  return 'Building';
}

/** The newest score on this session. No entry means the evaluator never ran. */
function latestEvaluation(session: Session): EvaluationResult | null {
  const evaluations = session.evaluations;
  if (evaluations === undefined || evaluations.length === 0) {
    return null;
  }

  return evaluations[evaluations.length - 1];
}

/** The evaluator's next-topic string, or null when this score did not suggest one. */
function suggestedTopic(evaluation: EvaluationResult): string | null {
  const topic = evaluation.suggestedNext;
  if (topic === null) return null;

  const trimmed = topic.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Renders a star emoji row capped at 10. */
function StarRow({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div
      className="flex flex-wrap gap-0.5"
      aria-label={`${count} star${count === 1 ? '' : 's'} earned`}
    >
      {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
        <span key={i} className="text-base" aria-hidden="true">
          ⭐
        </span>
      ))}
    </div>
  );
}

interface MasterySummaryProps {
  session: Session;
}

/**
 * Score badge from the session's own evaluations.
 * No evaluation stays a plain line. A real 0 is "Building", because the evaluator ran.
 */
function MasterySummary({ session }: MasterySummaryProps) {
  const evaluation = latestEvaluation(session);

  if (evaluation === null) {
    return <p className="text-base text-slate-600">No mastery score yet</p>;
  }

  const score = clampScore(evaluation.score);
  const band = scoreBand(score);
  const label = bandLabel(band);
  const nextTopic = suggestedTopic(evaluation);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-base font-medium text-slate-900">{evaluation.topic}</p>
        <Badge className={cn('h-auto px-2.5 py-1 text-base', BAND_CLASS[band])}>
          {score} · {label}
        </Badge>
      </div>
      {score >= MASTERED_SCORE && <p className="text-base text-slate-900">Topic mastered</p>}
      {nextTopic !== null && (
        <p className="text-base text-slate-900">Suggested next: {nextTopic}</p>
      )}
    </div>
  );
}

/** Parent-facing card showing one session's summary, stars, topics, and mastery score. */
export function SessionSummaryCard({ session }: SessionSummaryCardProps) {
  const subjectLabel = session.subject === 'math' ? 'Math' : 'Reading';
  const subjectVariant = session.subject === 'math' ? 'default' : 'secondary';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">
              {session.characterName.trim().length > 0
                ? `Session with ${session.characterName}`
                : 'Tutoring Session'}
            </CardTitle>
            <CardDescription className="text-base">{formatDate(session.startedAt)}</CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge variant={subjectVariant} className="h-auto px-2.5 py-1 text-base">
              {subjectLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-base text-slate-600">
          <span>{session.messageCount} messages</span>
          {session.starsEarned > 0 && (
            <span className="flex items-center gap-1">
              <StarRow count={session.starsEarned} />
            </span>
          )}
        </div>

        <MasterySummary session={session} />

        {session.summary !== undefined ? (
          <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
            {session.summary.topicsCovered.length > 0 && (
              <div>
                <p className="mb-1.5 text-base font-semibold text-slate-700">Topics Covered</p>
                <div className="flex flex-wrap gap-1.5">
                  {session.summary.topicsCovered.map((topic) => (
                    <Badge key={topic} variant="outline" className="h-auto px-2.5 py-1 text-base">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {session.summary.areasForPractice.length > 0 && (
              <div>
                <p className="mb-1.5 text-base font-semibold text-slate-700">Keep Practicing</p>
                <ul className="list-inside list-disc space-y-0.5 text-base text-slate-700">
                  {session.summary.areasForPractice.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {session.summary.encouragementNote.length > 0 && (
              <p className="text-base italic text-slate-700">
                &ldquo;{session.summary.encouragementNote}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <p className="text-base italic text-slate-600">
            Summary generating — check back in a moment…
          </p>
        )}
      </CardContent>
    </Card>
  );
}
