// LiveSessionPanel — parent card for the tutoring session happening right now.
// The mastery ring receives the score as a prop. This file does not listen to Firestore itself.

'use client';

import { MasteryIndicator } from '@/components/parent/MasteryIndicator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GRADE_BAND_CONFIGS, type GradeBand } from '@/constants';
import { useLiveSession } from '@/hooks/useLiveSession';

/** Parent-facing grade name. Older sessions may not have a grade stored. */
function gradeLabel(grade: GradeBand | undefined): string {
  if (grade === undefined) {
    return 'Grade not set';
  }

  return GRADE_BAND_CONFIGS[grade].label;
}

/** "1 star" or "2 stars". */
function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Shows the open session, or a quiet empty state when the child is not learning. */
export function LiveSessionPanel() {
  const { isActive, currentSession, mastery, isLoading, error } = useLiveSession();
  const topic = currentSession?.currentTopic ?? 'This lesson';
  const waitingForScore = isActive && (currentSession?.evaluations?.length ?? 0) === 0;
  const subjectLabel = currentSession?.subject === 'reading' ? 'Reading' : 'Math';
  const subjectVariant = currentSession?.subject === 'reading' ? 'secondary' : 'default';

  let body = <p className="text-base text-slate-500">No active session</p>;

  if (isLoading) {
    body = <p className="text-base text-slate-500">Checking for a live session…</p>;
  } else if (error !== null) {
    body = <p className="text-base text-red-600">{error}</p>;
  } else if (isActive && currentSession !== null) {
    body = (
      <div className="flex flex-col gap-4">
        <Badge variant={subjectVariant} className="h-auto px-2.5 py-1 text-base">
          {subjectLabel}
        </Badge>
        <MasteryIndicator topic={topic} score={mastery} />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-base text-slate-600">
          <span>{gradeLabel(currentSession.currentGrade)}</span>
          <span>{countLabel(currentSession.starsEarned, 'star', 'stars')}</span>
          <span>{countLabel(currentSession.messageCount, 'message', 'messages')}</span>
        </div>
        {waitingForScore && (
          <p className="text-base text-slate-500">
            The score shows up after your child works through a topic block.
          </p>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live session</CardTitle>
        <CardDescription>What your child is working on right now.</CardDescription>
      </CardHeader>
      <CardContent aria-live="polite">{body}</CardContent>
    </Card>
  );
}
