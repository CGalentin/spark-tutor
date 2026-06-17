// buildSummaryPrompt — builds the user message sent to Claude for agentic session summaries.
// Separate from buildSystemPrompt.ts because summaries use a different prompt structure:
// the system prompt stays constant (SUMMARY_SYSTEM_PROMPT) and the user message
// is the full conversation transcript formatted for Claude to analyze.

import type { Message } from '@/types';

interface BuildSummaryPromptParams {
  /** The subject studied during the session. */
  subject: string;
  /** The fictional mascot name the child used. */
  mascotName: string;
  /** Full conversation history to summarize. */
  messages: Message[];
}

/**
 * Formats the session conversation into a user message for Claude's summary call.
 * Returns the user-message string to be sent alongside SUMMARY_SYSTEM_PROMPT.
 */
export function buildSummaryPrompt({
  subject,
  mascotName,
  messages,
}: BuildSummaryPromptParams): string {
  if (messages.length === 0) {
    return `The child had a ${subject} session with ${mascotName} but no messages were exchanged.`;
  }

  // Format each message as "Child: ..." or "Mascot: ..." for readability
  const transcript = messages
    .map((msg) => {
      const speaker = msg.role === 'child' ? 'Child' : `Mascot (${mascotName})`;
      // Strip [STAR EARNED] tokens from the mascot messages — parents see the note separately
      const content = msg.content.replace(/\[STAR EARNED\]/g, '').trim();
      return `${speaker}: ${content}`;
    })
    .join('\n');

  return [
    `Subject: ${subject}`,
    `Mascot name: ${mascotName}`,
    `Session length: ${messages.length} messages`,
    '',
    'Conversation transcript:',
    transcript,
    '',
    'Please provide a JSON summary with exactly these keys:',
    '{ "topicsCovered": string[], "areasForPractice": string[], "encouragementNote": string }',
  ].join('\n');
}
