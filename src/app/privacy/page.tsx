// Privacy Policy page — /privacy
// COPPA-compliant disclosure of what Spark Tutor collects and does not collect.
// Intentionally written in plain English for parents, not legal jargon.
// Linked from the auth layout footer and the signup form.

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Spark Tutor',
  description: 'How Spark Tutor collects and protects your data.',
};

/** Section heading with consistent styling. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-8 text-xl font-bold text-slate-800 first:mt-0">{children}</h2>
  );
}

/** Styled bullet list. */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-0.5 shrink-0 text-violet-500">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Privacy Policy — plain English, COPPA-compliant. */
export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to Sign In
          </Link>
          <div className="mb-3 text-4xl" aria-hidden="true">🔒</div>
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="mt-2 text-slate-500">
            Last updated: June {currentYear} &middot; Spark Tutor
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {/* Intro */}
          <p className="text-slate-600">
            Spark Tutor is a K–1 tutoring app for children ages 5–6. We take your family&apos;s
            privacy seriously and are designed from the ground up to comply with the{' '}
            <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong>. This page
            explains exactly what we collect, what we do not collect, and how your data is used.
          </p>

          {/* COPPA callout */}
          <div className="my-6 rounded-xl border border-violet-100 bg-violet-50 px-5 py-4">
            <p className="font-semibold text-violet-800">COPPA Compliance</p>
            <p className="mt-1 text-sm text-violet-700">
              Spark Tutor never creates accounts for children. All data is stored under the
              parent&apos;s account. No personal information is ever collected from a child.
            </p>
          </div>

          {/* What we collect */}
          <SectionHeading>What We Collect</SectionHeading>
          <p className="mb-3 text-slate-600">
            We collect only the minimum data needed to run the app:
          </p>
          <BulletList
            items={[
              'Your email address — used only to sign you in to your parent account.',
              'Session activity data — the subject your child chose (Math or Reading), the number of messages exchanged, and the number of stars earned.',
              'A fictional character type and name — for example "Blip the robot" or "Luna". This is chosen by your child and is not their real name.',
              'An AI-generated session summary — a short, structured note covering topics explored and an encouragement message, created automatically after each session ends.',
            ]}
          />

          {/* What we do NOT collect */}
          <SectionHeading>What We Do NOT Collect</SectionHeading>
          <p className="mb-3 text-slate-600">
            We go out of our way to avoid collecting sensitive information:
          </p>
          <BulletList
            items={[
              "Your child's real name — we never ask for it.",
              "Your child's age, grade level, school, or location.",
              "Photos, voice recordings, or videos of any kind.",
              "Device identifiers, advertising IDs, or tracking cookies.",
              "Any personal information from a child — ever.",
              'Credit card or payment information — Spark Tutor is free.',
            ]}
          />

          {/* How data is used */}
          <SectionHeading>How Your Data Is Used</SectionHeading>
          <BulletList
            items={[
              'Your email is used solely to authenticate you and let you sign in.',
              'Session activity data is used to generate the AI summary shown on your parent dashboard.',
              'We do not sell, share, or use your data for advertising or profiling of any kind.',
              'Session summaries are visible only to you — they are stored under your account and cannot be accessed by anyone else.',
            ]}
          />

          {/* Data retention */}
          <SectionHeading>Data Retention</SectionHeading>
          <p className="text-slate-600">
            Session data is stored until you delete your parent account. You can request deletion
            of all your data at any time by emailing us (see contact below). We will permanently
            delete your account and all associated session data within 30 days of your request.
          </p>

          {/* Third-party services */}
          <SectionHeading>Third-Party Services</SectionHeading>
          <p className="mb-3 text-slate-600">
            Spark Tutor uses the following third-party services to operate:
          </p>
          <BulletList
            items={[
              'Firebase (Google) — authentication and database storage. Data is stored in the US.',
              'Anthropic Claude — AI model that generates mascot responses and session summaries. Chat transcripts are sent to Anthropic solely to generate responses; they are not stored by Anthropic beyond their API retention period.',
              'Vercel — hosting and infrastructure.',
            ]}
          />
          <p className="mt-3 text-sm text-slate-500">
            None of these services receive your child&apos;s real name or any other personal
            information about your child.
          </p>

          {/* Contact */}
          <SectionHeading>Contact Us</SectionHeading>
          <p className="text-slate-600">
            If you have questions about this policy, want to request deletion of your data, or want
            to report a privacy concern, please email us at{' '}
            <a
              href="mailto:privacy@spark-tutor.app"
              className="font-medium text-violet-600 underline-offset-4 hover:underline"
            >
              privacy@spark-tutor.app
            </a>
            .
          </p>

          {/* Footer note */}
          <p className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-400">
            &copy; {currentYear} Spark Tutor. This policy may be updated periodically. We will
            notify you of material changes via the email address on your account.
          </p>
        </div>

        {/* Back link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="underline-offset-4 hover:underline">
            Return to Sign In
          </Link>
          {' · '}
          <Link href="/signup" className="underline-offset-4 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
