// Parent dashboard — topic suggestion, live session, then session history.
// Auth protection is handled by the parent layout.
// Uses onSnapshot via useSessionHistory so the summary appears as soon as Claude generates it.

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { DashboardHeader } from '@/components/parent/DashboardHeader';
import { LiveSessionPanel } from '@/components/parent/LiveSessionPanel';
import { SessionSummaryCard } from '@/components/parent/SessionSummaryCard';
import { TopicSuggestionCard } from '@/components/parent/TopicSuggestionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** Parent dashboard — live session history with agentic AI summaries. */
export default function DashboardPage() {
  const { parentEmail } = useAuth();
  const { sessions, isLoading, error } = useSessionHistory();

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner with start-session CTA */}
      <DashboardHeader parentEmail={parentEmail} />

      {/* Approve or keep the current topic before the live session card */}
      <TopicSuggestionCard subject="math" sessions={sessions} sessionsLoading={isLoading} />
      <TopicSuggestionCard subject="reading" sessions={sessions} sessionsLoading={isLoading} />

      {/* Open session and live mastery ring */}
      <LiveSessionPanel />

      {/* Session history */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            Each session your child completes appears here with an AI-generated summary.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <p className="py-8 text-center text-sm text-slate-400">Loading sessions…</p>
          )}

          {error !== null && <p className="py-8 text-center text-sm text-red-500">{error}</p>}

          {!isLoading && error === null && sessions.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              No sessions yet — start a tutoring session to see summaries here!
            </p>
          )}

          {!isLoading && sessions.length > 0 && (
            <div className="flex flex-col gap-4">
              {sessions.map((session) => (
                <SessionSummaryCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
