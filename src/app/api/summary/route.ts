// POST /api/summary — Agentic session summary endpoint.
// Called by /api/session/end (fire-and-forget) after a session ends.
// Fetches the session's conversation messages from Firestore, sends the transcript
// to Claude, and returns a structured summary to be saved by /api/summary (PR 3-08).
//
// This route handles both generation (PR 3-07) and saving (PR 3-08) in one pass
// since they're always called together — keeping the Firestore write here avoids
// a separate round-trip.

import { type NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { getAnthropicClient } from '@/lib/claude/client';
import { SUMMARY_SYSTEM_PROMPT } from '@/constants/prompts';
import { buildSummaryPrompt } from '@/lib/claude/buildSummaryPrompt';
import { summaryRatelimit } from '@/lib/upstash/ratelimit';
import type { ApiResult, SummaryRequest, SummaryResponse, Message } from '@/types';

/** Parsed JSON structure expected from Claude's summary response. */
interface ClaudeSummaryJson {
  topicsCovered: string[];
  areasForPractice: string[];
  encouragementNote: string;
}

/** Extracts the JSON object from Claude's response text (which may include prose). */
function parseSummaryJson(text: string): ClaudeSummaryJson | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (match === null) return null;

  try {
    const parsed = JSON.parse(match[0]) as Partial<ClaudeSummaryJson>;

    if (
      !Array.isArray(parsed.topicsCovered) ||
      !Array.isArray(parsed.areasForPractice) ||
      typeof parsed.encouragementNote !== 'string'
    ) {
      return null;
    }

    return {
      topicsCovered: parsed.topicsCovered as string[],
      areasForPractice: parsed.areasForPractice as string[],
      encouragementNote: parsed.encouragementNote,
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  // ── 1. Verify Firebase Auth token ────────────────────────────────────────
  let parentUID: string;
  try {
    parentUID = await verifyAuthToken(request.headers.get('Authorization'));
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message } satisfies ApiResult<never>,
      { status: 401 },
    );
  }

  // ── 2. Rate limit — 10 requests per user per hour ────────────────────────
  // summaryRatelimit is null when Upstash env vars are absent (fail-open for local dev)
  if (summaryRatelimit !== null) {
    const { success } = await summaryRatelimit.limit(parentUID);
    if (!success) {
      return Response.json(
        {
          success: false,
          error: 'Too many summary requests. Please wait before ending another session.',
        } satisfies ApiResult<never>,
        { status: 429 },
      );
    }
  }

  // ── 3. Parse request body ─────────────────────────────────────────────────
  let body: SummaryRequest;
  try {
    body = (await request.json()) as SummaryRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { sessionId } = body;

  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return Response.json(
      { success: false, error: 'sessionId is required.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 4. Fetch session document from Firestore ──────────────────────────────
  let sessionData: FirebaseFirestore.DocumentData;
  try {
    const sessionRef = adminDb
      .collection('users')
      .doc(parentUID)
      .collection('sessions')
      .doc(sessionId);

    const sessionSnap = await sessionRef.get();
    if (!sessionSnap.exists) {
      return Response.json(
        { success: false, error: 'Session not found.' } satisfies ApiResult<never>,
        { status: 404 },
      );
    }
    sessionData = sessionSnap.data() ?? {};
  } catch {
    return Response.json(
      { success: false, error: 'Failed to fetch session.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 5. Build the summary prompt from session metadata ─────────────────────
  // The messages are passed in the request body (from the client's in-memory state)
  // since we don't persist individual messages to Firestore during the session.
  const sessionMessages: Message[] = Array.isArray(body.messages) ? body.messages : [];
  const subject = (sessionData['subject'] as string | undefined) ?? 'math';
  const mascotName = (sessionData['characterName'] as string | undefined) ?? 'your buddy';

  const userMessage = buildSummaryPrompt({ subject, mascotName, messages: sessionMessages });

  // ── 6. Call Claude for the structured summary ─────────────────────────────
  let summaryData: ClaudeSummaryJson;
  try {
    const anthropic = getAnthropicClient();
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SUMMARY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const responseText =
      claudeResponse.content[0]?.type === 'text' ? claudeResponse.content[0].text : '';

    const parsed = parseSummaryJson(responseText);
    if (parsed === null) {
      // Fallback summary if Claude returns unexpected format
      summaryData = {
        topicsCovered: [`${subject} practice`],
        areasForPractice: ['Continue practicing with more sessions!'],
        encouragementNote: 'Great effort today — keep up the wonderful work!',
      };
    } else {
      summaryData = parsed;
    }
  } catch {
    return Response.json(
      { success: false, error: 'Failed to generate summary.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  // ── 7. Save summary to Firestore ─────────────────────────────────────────
  try {
    const summaryRef = adminDb
      .collection('users')
      .doc(parentUID)
      .collection('sessions')
      .doc(sessionId);

    await summaryRef.update({
      summary: {
        topicsCovered: summaryData.topicsCovered,
        areasForPractice: summaryData.areasForPractice,
        encouragementNote: summaryData.encouragementNote,
        generatedAt: Timestamp.now(),
      },
    });
  } catch {
    // Saving to Firestore is best-effort — still return the summary to the caller
  }

  const responseData: SummaryResponse = {
    topicsCovered: summaryData.topicsCovered,
    areasForPractice: summaryData.areasForPractice,
    encouragementNote: summaryData.encouragementNote,
  };

  return Response.json({ success: true, data: responseData } satisfies ApiResult<SummaryResponse>);
}
