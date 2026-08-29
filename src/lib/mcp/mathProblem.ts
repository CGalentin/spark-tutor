// mathProblem.ts — server-side MCP tool implementation for math problem generation.
// Called directly by /api/chat when a child requests a practice problem.
// This avoids an HTTP round-trip to /api/mcp/math-problem during the chat flow.
// The answer is computed here and stays on the server — never returned to the client.

import { getAnthropicClient } from '@/lib/claude/client';
import type { MathGrade, MathDifficulty, MathProblemResponse } from '@/types';

/** System prompt for the math problem generator (same as the API route). */
const MCP_SYSTEM_PROMPT = `You are a K-1 math problem generator for children ages 5-6.

Given a grade level, topic, and difficulty, produce ONE math problem suitable for the child.

Rules:
- Use simple, clear language a 5-6 year old can understand
- Kindergarten (K): counting 1-20, basic shapes, comparing sizes, patterns
- Grade 1: addition and subtraction up to 20, place value tens/ones, measurement, time
- easy: concrete, single-step, uses small numbers or familiar objects
- medium: slightly abstract, may have a small story context, slightly larger numbers

Respond ONLY with valid JSON in exactly this format — no extra text, no markdown:
{
  "problem": "the problem text shown to the child",
  "hint": "a gentle hint Claude can use to guide the child",
  "answer": "the correct answer (kept server-side, never shown to child)"
}`.trim();

interface McpJson {
  problem: string;
  hint: string;
  answer: string;
}

/** Extracts the first JSON object from Claude's response text. */
function parseMcpJson(text: string): McpJson | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (match === null) return null;

  try {
    const parsed = JSON.parse(match[0]) as Partial<McpJson>;

    if (
      typeof parsed.problem !== 'string' ||
      typeof parsed.hint !== 'string' ||
      typeof parsed.answer !== 'string'
    ) {
      return null;
    }

    return { problem: parsed.problem, hint: parsed.hint, answer: parsed.answer };
  } catch {
    return null;
  }
}

/**
 * Generates a grade-appropriate math problem using Claude.
 * Returns only problem and hint — the answer stays server-side.
 * Returns null if generation fails (caller should fall back to RAG).
 */
export async function generateMathProblem(
  grade: MathGrade,
  topic: string,
  difficulty: MathDifficulty,
): Promise<MathProblemResponse | null> {
  try {
    const anthropic = getAnthropicClient();

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: MCP_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Grade: ${grade}\nTopic: ${topic.trim()}\nDifficulty: ${difficulty}`,
        },
      ],
    });

    const responseText =
      claudeResponse.content[0]?.type === 'text' ? claudeResponse.content[0].text : '';

    const parsed = parseMcpJson(responseText);
    if (parsed === null) return null;

    // Return only problem + hint — answer intentionally excluded from the return type
    return { problem: parsed.problem, hint: parsed.hint };
  } catch {
    return null;
  }
}

/**
 * Detects whether the child's message is requesting a math practice problem.
 * Matches common phrasings a K-1 child might use.
 */
export function detectsProblemRequest(message: string): boolean {
  const lower = message.toLowerCase();
  const triggers = [
    'give me a problem',
    'give me a math problem',
    'can i try one',
    'can i have a problem',
    'i want a problem',
    'i want to try',
    'practice problem',
    'math problem',
    'try a problem',
    'let me try',
    'can we do a problem',
    'do a problem',
    'give me one',
  ];
  return triggers.some((trigger) => lower.includes(trigger));
}
