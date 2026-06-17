// Parent dashboard — shows session history and agentic summaries.
// Auth protection is handled by the parent layout.
// Session list and summary cards are rendered by components added in PR 3-10.

'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/parent/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** Parent dashboard page — entry point for all parent-facing session data. */
export default function DashboardPage() {
  const { parentEmail } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner with start-session CTA */}
      <DashboardHeader parentEmail={parentEmail} />

      {/* Session history — populated by SessionSummaryCard list in PR 3-10 */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            Each session your child completes will appear here with an AI-generated summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* SessionHistoryList component added in PR 3-10 */}
          <p className="py-8 text-center text-sm text-slate-400">
            No sessions yet — start a tutoring session to see summaries here!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
