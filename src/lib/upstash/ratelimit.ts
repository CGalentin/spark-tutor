// Upstash Redis rate limiter instances for AI API routes.
// Uses a fail-open design: if UPSTASH_REDIS_REST_URL / TOKEN are not set
// (e.g. local dev without a Redis instance), rate limiting is silently skipped
// rather than blocking every request.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** Builds a Redis client from env vars; returns null when vars are absent. */
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url === undefined || url === '' || token === undefined || token === '') return null;
  return new Redis({ url, token });
}

const redis = createRedisClient();

/**
 * 30 requests per user per sliding hour window.
 * Applied to /api/chat — the most expensive AI endpoint.
 * Null when Upstash is not configured (fail-open for local dev).
 */
export const chatRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 h'),
      prefix: 'rl:chat',
    })
  : null;

/**
 * 10 requests per user per sliding hour window.
 * Applied to /api/summary — called once per session end.
 * Null when Upstash is not configured (fail-open for local dev).
 */
export const summaryRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      prefix: 'rl:summary',
    })
  : null;
