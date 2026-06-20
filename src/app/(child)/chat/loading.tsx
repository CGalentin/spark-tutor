// Next.js route-level loading UI for the child chat page.
// Shown automatically by the App Router while the chat page suspends.

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

/** Shown while the chat page is loading. */
export default function ChatLoading() {
  return (
    <div className="flex h-dvh flex-col bg-gradient-to-b from-violet-50 to-white">
      <LoadingSpinner message="Getting your tutor ready..." />
    </div>
  );
}
