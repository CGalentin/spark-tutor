// Next.js route-level loading UI for the parent dashboard.
// Shown automatically by the App Router while the dashboard page suspends.

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

/** Shown while the parent dashboard is loading. */
export default function DashboardLoading() {
  return <LoadingSpinner message="Loading your dashboard..." />;
}
