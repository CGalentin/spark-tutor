import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // firebase-admin uses jwks-rsa which tries to require() the ESM-only jose package.
  // Marking firebase-admin as external tells Next.js not to bundle it, so Node.js
  // resolves it at runtime using its own ESM loader instead — fixing the ERR_REQUIRE_ESM
  // crash in Vercel serverless functions.
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
