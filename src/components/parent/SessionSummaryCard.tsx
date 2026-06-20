// SessionSummaryCard — displays a single session's details and AI-generated summary.
// Used in the parent dashboard to show date, subject, stars, topics, and encouragement.
// Uses Shadcn Card and Badge components per the parent-UI rules.

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Session } from '@/types';

interface SessionSummaryCardProps {
  session: Session;
}

/** Formats a Date as a readable locale string like "Jun 17, 2026". */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Renders a star emoji row capped at 10. */
function StarRow({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex flex-wrap gap-0.5" aria-label={`${count} star${count === 1 ? '' : 's'} earned`}>
      {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
        <span key={i} className="text-base" aria-hidden="true">⭐</span>
      ))}
    </div>
  );
}

/** Parent-facing card showing one session's summary, stars, and topics. */
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
            <CardDescription>{formatDate(session.startedAt)}</CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge variant={subjectVariant}>{subjectLabel}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Stars and message count row */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{session.messageCount} messages</span>
          {session.starsEarned > 0 && (
            <span className="flex items-center gap-1">
              <StarRow count={session.starsEarned} />
            </span>
          )}
        </div>

        {/* AI-generated summary */}
        {session.summary !== undefined ? (
          <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
            {/* Topics covered */}
            {session.summary.topicsCovered.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Topics Covered
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {session.summary.topicsCovered.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Areas for practice */}
            {session.summary.areasForPractice.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Keep Practicing
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
                  {session.summary.areasForPractice.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Encouragement note */}
            {session.summary.encouragementNote.length > 0 && (
              <p className="text-sm italic text-slate-600">
                &ldquo;{session.summary.encouragementNote}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm italic text-slate-400">
            Summary generating — check back in a moment…
          </p>
        )}
      </CardContent>
    </Card>
  );
}
