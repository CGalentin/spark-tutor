// POST /api/session/start — Creates a new tutoring session in Firestore.
// Called when the child picks a subject in the chat screen.
// All session data is stored under the parent UID (COPPA: no child accounts).
// The learning path is read first so the session document can store the topic,
// grade, and difficulty the child will actually practice.
// A suggested next topic is not taught until the parent approves it.
//
// Request body: { characterType, characterName, subject }
// Response:     { success: true, data: { sessionId, currentTopic, currentGrade, suggestedNextTopic, learningPath } }

import { type NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken, adminDb } from '@/lib/firebase/admin';
import { createLearningPath, getLearningPath } from '@/lib/firebase/learningPath';
import { getDifficultyHint } from '@/lib/claude/adaptDifficulty';
import { getTopics, type GradeBand } from '@/constants';
import type {
  ApiResult,
  DifficultyHint,
  LearningPath,
  LearningPathSummary,
  SessionStartRequest,
  SessionStartResponse,
  Subject,
} from '@/types';

/** New learning paths start at Kindergarten until the child UI sends a grade. */
const DEFAULT_GRADE: GradeBand = 'K';

/**
 * Returns the parent's learning path for this subject, creating one on first use.
 * A brand-new path starts at Kindergarten and the first topic in TOPIC_MAP.
 */
async function resolveLearningPath(parentUID: string, subject: Subject): Promise<LearningPath> {
  const existing = await getLearningPath(parentUID, subject);
  if (existing !== null) {
    return existing;
  }

  const firstTopic = getTopics(subject, DEFAULT_GRADE)[0];
  if (firstTopic === undefined) {
    throw new Error(`No topics configured for ${subject} grade ${DEFAULT_GRADE}.`);
  }

  return createLearningPath(parentUID, subject, firstTopic, DEFAULT_GRADE);
}

/**
 * Topic this session will teach.
 * A waiting suggestion stays a suggestion. Approval already copies the new topic
 * onto currentTopic, so this never teaches suggestedNextTopic.
 */
function topicForNewSession(path: LearningPath): string {
  const suggestionWaiting =
    path.parentApproved === false &&
    typeof path.suggestedNextTopic === 'string' &&
    path.suggestedNextTopic.length > 0;

  if (suggestionWaiting) {
    return path.currentTopic;
  }

  return path.currentTopic;
}

/** Builds the snapshot returned to the chat page and stored on the session. */
function toLearningPathSummary(
  path: LearningPath,
  topic: string,
  difficultyHint: DifficultyHint,
): LearningPathSummary {
  return {
    subject: path.subject,
    currentTopic: topic,
    currentGrade: path.currentGrade,
    suggestedNextTopic: path.suggestedNextTopic,
    parentApproved: path.parentApproved,
    difficultyHint,
    topicsCompleted: path.topicsCompleted,
  };
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

  // ── 2. Parse and validate request body ───────────────────────────────────
  let body: SessionStartRequest;
  try {
    body = (await request.json()) as SessionStartRequest;
  } catch {
    return Response.json(
      { success: false, error: 'Request body must be valid JSON.' } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  const { characterType, characterName, subject } = body;

  if (
    typeof characterType !== 'string' ||
    characterType.trim().length === 0 ||
    typeof characterName !== 'string' ||
    (subject !== 'math' && subject !== 'reading')
  ) {
    return Response.json(
      {
        success: false,
        error:
          'Required fields: characterType (string), characterName (string), subject ("math"|"reading").',
      } satisfies ApiResult<never>,
      { status: 400 },
    );
  }

  // ── 3. Read or create the learning path before writing the session ───────
  let learningPath: LearningPath;
  try {
    learningPath = await resolveLearningPath(parentUID, subject);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load the learning path.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }

  const sessionTopic = topicForNewSession(learningPath);
  const difficultyHint = getDifficultyHint(learningPath.masteryHistory, sessionTopic);
  const learningPathSummary = toLearningPathSummary(learningPath, sessionTopic, difficultyHint);

  // ── 4. Create session document in Firestore ───────────────────────────────
  // Auto-generated document ID becomes the sessionId returned to the client.
  try {
    const sessionsRef = adminDb.collection('users').doc(parentUID).collection('sessions');
    const sessionRef = sessionsRef.doc();

    await sessionRef.set({
      parentUID,
      characterType: characterType.trim(),
      // Empty string is valid — child may not enter a name; UI falls back to default
      characterName: characterName.trim(),
      subject,
      startedAt: FieldValue.serverTimestamp(),
      messageCount: 0,
      starsEarned: 0,
      currentTopic: sessionTopic,
      currentGrade: learningPath.currentGrade,
      difficultyHint,
    });

    const responseData: SessionStartResponse = {
      sessionId: sessionRef.id,
      currentTopic: sessionTopic,
      currentGrade: learningPath.currentGrade,
      suggestedNextTopic: learningPath.suggestedNextTopic,
      learningPath: learningPathSummary,
    };

    return Response.json({
      success: true,
      data: responseData,
    } satisfies ApiResult<SessionStartResponse>);
  } catch {
    return Response.json(
      { success: false, error: 'Failed to create session.' } satisfies ApiResult<never>,
      { status: 500 },
    );
  }
}
