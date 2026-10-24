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

/**
 * 60 requests per user per sliding hour window.
 * Applied to /api/evaluate — one call per topic block, so it fires more often than chat.
 * Null when Upstash is not configured (fail-open for local dev).
 */
export const evaluateRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 h'),
      prefix: 'rl:evaluate',
    })
  : null;

/**
 * 20 requests per user per sliding hour window.
 * Applied to /api/learning-path/approve — parent confirms the next topic.
 * Null when Upstash is not configured (fail-open for local dev).
 */
export const approveRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'),
      prefix: 'rl:approve',
    })
  : null;

/**
 * 20 requests per user per sliding hour window.
 * Applied to /api/learning-path/reject — parent clears a topic suggestion.
 * Null when Upstash is not configured (fail-open for local dev).
 */
export const rejectRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'),
      prefix: 'rl:reject',
    })
  : null;

/**
 * 30 requests per parent per sliding hour window.
 * Applied to /api/mcp/reading-quiz — one new quiz, not the later answer checks.
 * Own prefix so this counter does not share the chat bucket.
 * Null when Upstash is not configured (fail-open for local dev).
 */
export const readingQuizRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 h'),
      prefix: 'rl:reading-quiz',
    })
  : null;
