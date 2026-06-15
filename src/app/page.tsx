// Root page — redirects to /login until the auth provider (PR 1-10) can make smart redirects.
// Once AuthProvider is in place, authenticated parents will be sent to /dashboard instead.

import { redirect } from 'next/navigation';

/** Redirects all root visits to the parent login page. */
export default function RootPage() {
  redirect('/login');
}
