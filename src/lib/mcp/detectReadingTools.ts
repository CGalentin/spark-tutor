// Detects when a child is asking for a reading quiz or a spelling list.
// The chat route uses these phrases, then calls the MCP routes.
// Those routes keep the correct choice and the spelling on the server.

/**
 * Detects whether the child's message is asking for a reading quiz.
 * The chat route only honors this when the subject is reading.
 */
export function detectsReadingQuizRequest(message: string): boolean {
  const lower = message.toLowerCase();
  const triggers = ['quiz', 'give me a quiz', 'test me', 'reading quiz', 'comprehension'];
  return triggers.some((trigger) => lower.includes(trigger));
}

/**
 * Detects whether the child's message is asking to practice spelling.
 * This can run in any subject.
 */
export function detectsSpellingRequest(message: string): boolean {
  const lower = message.toLowerCase();
  const triggers = ['spelling', 'spell', 'practice spelling', 'spelling words', 'spell a word'];
  return triggers.some((trigger) => lower.includes(trigger));
}
