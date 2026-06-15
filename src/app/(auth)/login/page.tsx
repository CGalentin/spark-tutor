// Parent login page — thin wrapper that renders the LoginForm within the auth layout.

import type { Metadata } from 'next';
import { LoginForm } from '@/components/parent/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Spark Tutor',
};

/** Parent login page. */
export default function LoginPage() {
  return <LoginForm />;
}
