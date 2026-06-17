// DashboardHeader — welcome banner at the top of the parent dashboard.
// Shows the parent's email address and a link to start a new tutoring session.

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  /** Parent's email address — displayed as their identity. */
  parentEmail: string | null;
}

/** Welcome header for the parent dashboard with start-session CTA. */
export function DashboardHeader({ parentEmail }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Parent Dashboard</h1>
        {parentEmail !== null && (
          <p className="mt-0.5 text-sm text-slate-500">{parentEmail}</p>
        )}
      </div>

      <Button
        onClick={() => router.push('/character-select')}
        className="mt-3 sm:mt-0"
      >
        Start a Session 🚀
      </Button>
    </div>
  );
}
