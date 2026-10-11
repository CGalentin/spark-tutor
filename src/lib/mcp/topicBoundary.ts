// Detects when one "topic block" of tutoring is over and the evaluator should run.
// A topic block is TOPIC_BLOCK_SIZE child messages (currently 6).
// The child can also end a block early by asking to move on.
//
// This file is safe to import from Client Components — no Firebase Admin, no API keys.

import type { Message } from '@/types';

/** How many child messages make one topic block before we score mastery. */
export const TOPIC_BLOCK_SIZE = 6;

/**
 * Phrases that mean the child wants a new topic.
 * Matched with includes() on the last child message (case-insensitive).
 * "im done" covers kids who skip the apostrophe in "I'm done".
 */
const MOVE_ON_PHRASES = ["i'm done", 'im done', 'next topic', 'something else'] as const;

/**
 * Returns true when the evaluator should score the current topic.
 *
 * @param messageCount - child messages in this topic block (use topicMessageCount from the session store)
 * @param messages - the conversation so far; we only inspect the last child message for "move on" phrases
 */
export function detectTopicBoundary(messageCount: number, messages: Message[]): boolean {
  if (messageCount > 0 && messageCount % TOPIC_BLOCK_SIZE === 0) {
    return true;
  }

  return childAskedToMoveOn(messages);
}

/** True when the most recent child message asks to leave this topic. */
function childAskedToMoveOn(messages: Message[]): boolean {
  const lastChild = lastChildMessage(messages);
  if (lastChild === undefined) {
    return false;
  }

  const lower = lastChild.content.toLowerCase();
  return MOVE_ON_PHRASES.some((phrase) => lower.includes(phrase));
}

function lastChildMessage(messages: Message[]): Message | undefined {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message !== undefined && message.role === 'child') {
      return message;
    }
  }

  return undefined;
}
