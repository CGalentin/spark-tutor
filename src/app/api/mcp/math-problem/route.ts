// POST /api/mcp/math-problem — MCP Math Problem Generator tool.
// Accepts a grade, topic, and difficulty; uses Claude to create a grade-appropriate
// math problem and returns only the problem text and a hint.
//
// SECURITY: The generated answer is computed server-side and NEVER included in the
// response — only problem + hint are returned so the child must work toward the answer.
//
// Called by /api/chat when the child asks for a practice problem.

import { type NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { getAnthropicClient } from '@/lib/claude/client';
import type { ApiResult, MathProblemRequest, MathProblemResponse } from '@/types';

/** System prompt that instructs Claude to produce structured math problem output. */
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

/** Parsed structure from Claude's MCP response. */
interface McpJson {
  problem: string;
  hint: string;
  answer: string;
}

/** Extracts the JSON object from Claude's response, even if wrapped in prose. */
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

    return {
      problem: parsed.problem,
      hint: parsed.hint,
      answer: parsed.answer,
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  // ── 1. Verify Firebase Auth token ────────────────────────────────────────
  try {
    await verifyAuthToken(request.headers.get('Authorization'));
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message } satisfies ApiResult<never>,
      { status: 401 },
    );
  }

  // ── 2. Parse and validate request body ───────────────────────────────────
  let body: MathProblemRequest;
  try {
    body = (await request.json()) as MathProblemRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { grade, topic, difficulty } = body;

  if (
    (grade !== 'K' && grade !== '1') ||
    typeof topic !== 'string' ||
    topic.trim().length === 0 ||
    (difficulty !== 'easy' && difficulty !== 'medium')
  ) {
    return Response.json(
      {
        success: false,
        error: 'Required: grade ("K"|"1"), topic (string), difficulty ("easy"|"medium").',
      } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Generate math problem with Claude ──────────────────────────────────
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

    if (parsed === null) {
      return Response.json(
        {
          success: false,
          error: 'Failed to parse problem from Claude.',
        } satisfies ApiResult<never>,
        { status: 500 },
      );
    }

    // ── 4. Return problem + hint ONLY — answer stays server-side ──────────
    const responseData: MathProblemResponse = {
      problem: parsed.problem,
      hint: parsed.hint,
    };

    return Response.json({
      success: true,
      data: responseData,
    } satisfies ApiResult<MathProblemResponse>);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to generate math problem.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }
}
