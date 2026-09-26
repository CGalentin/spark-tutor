// Central re-export for all shared TypeScript types.
// Import from '@/types' anywhere in the app instead of reaching into individual files.

export type { CharacterConfig, CharacterVoice } from './character';

export type { Subject, MessageRole, Message, SessionSummary, Session } from './session';

export type {
  ApiResult,
  ChatRequest,
  ChatResponse,
  RagRequest,
  RagResponse,
  MathGrade,
  MathDifficulty,
  MathProblemRequest,
  MathProblemResponse,
  SessionStartRequest,
  SessionStartResponse,
  SessionEndRequest,
  SessionEndResponse,
  SummaryRequest,
  SummaryResponse,
  EvaluateRequest,
  EvaluateResponse,
} from './api';

export type { CurriculumChunk, RankedChunk, GradeBand } from './rag';

export { MASTERED_SCORE } from './learningPath';
export type {
  TopicMastery,
  LearningPath,
  EvaluationResult,
  EvaluationConfidence,
  DifficultyHint,
  LearningPathContext,
} from './learningPath';
