// Anthropic SDK client initialization — server-side only.
// Singleton pattern prevents multiple instances from being created during
// Next.js module evaluation in development (hot reload).

import Anthropic from '@anthropic-ai/sdk';

let _client: Anthropic | null = null;

/** Returns the singleton Anthropic client. Call this inside API route handlers. */
export function getAnthropicClient(): Anthropic {
  if (_client === null) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _client;
}
