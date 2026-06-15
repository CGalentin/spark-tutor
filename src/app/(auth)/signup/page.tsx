// Parent signup page — thin wrapper that renders the SignupForm within the auth layout.

import type { Metadata } from 'next';
import { SignupForm } from '@/components/parent/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account — Spark Tutor',
};

/** Parent account creation page. */
export default function SignupPage() {
  return <SignupForm />;
}
