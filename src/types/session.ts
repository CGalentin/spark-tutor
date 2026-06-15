// Types for tutoring sessions, messages, and session summaries.
// All session data is stored under the parent UID in Firestore (COPPA compliance).

/** The two subjects available in Spark Tutor. */
export type Subject = 'math' | 'reading';

/** Who sent a message — the child or the mascot. */
export type MessageRole = 'child' | 'mascot';

/** A single message in a tutoring conversation. */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

/** The AI-generated summary saved after a session ends. */
export interface SessionSummary {
  topicsCovered: string[];
  areasForPractice: string[];
  encouragementNote: string;
  generatedAt: Date;
}

/** A full tutoring session document as stored in Firestore.
 *  Lives at: users/{parentUID}/sessions/{sessionId} */
export interface Session {
  id: string;
  parentUID: string;
  /** The character type selected (e.g. 'robot', 'fox') — never the child's real name. */
  characterType: string;
  /** The fictional name the child gave their mascot — never a real child name. */
  characterName: string;
  subject: Subject;
  startedAt: Date;
  /** Only present after the session has ended. */
  endedAt?: Date;
  messageCount: number;
  starsEarned: number;
  /** Only present after the agentic summary has been generated. */
  summary?: SessionSummary;
}
