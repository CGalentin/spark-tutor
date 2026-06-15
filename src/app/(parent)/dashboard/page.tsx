// Parent dashboard page — placeholder for Week 3.
// Displays a welcome message and sign-out link so the auth flow has a valid landing page.
// Full session history and agentic summaries will be added in Week 3.

'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

/** Placeholder parent dashboard — Week 3 will add session history and summaries. */
export default function DashboardPage() {
  const router = useRouter();
  const { parentEmail } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-4xl mb-2">⭐</p>
          <h1 className="text-2xl font-bold text-slate-800">Spark Tutor</h1>
          <p className="text-slate-500 text-sm mt-1">{parentEmail}</p>
        </div>

        {/* Placeholder card */}
        <Card>
          <CardHeader>
            <CardTitle>Parent Dashboard</CardTitle>
            <CardDescription>
              Session summaries and progress reports are coming in Week 3. For now, head to
              the tutoring session to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/character-select')}
              className="w-full"
            >
              Start a Tutoring Session 🚀
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
