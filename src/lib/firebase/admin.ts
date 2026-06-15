// Firebase Admin SDK initialization — server-side only.
// Used by API routes to verify Firebase Auth ID tokens.
// Never import this file in any client-side component or hook.

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

/** Initializes the Admin SDK once and returns the app — safe to call repeatedly. */
function getAdminApp(): App {
  if (getApps().length > 0) {
    // Return existing app on Next.js hot reloads
    return getApps()[0]!;
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // .env.local stores the private key with literal \n — replace them with real newlines
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = getAdminApp();

/** Firebase Admin Auth — use to verify ID tokens in API routes. */
export const adminAuth: Auth = getAuth(adminApp);
