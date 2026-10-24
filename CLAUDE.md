@AGENTS.md
"Key Files to Read"
- ROADMAP-v2.md     — 28 PRs across 4 sprints for the AI Intelligence Layer
- spark_tutor_build_bible_v2.docx — v2 architecture decisions and data model

## Stack
- Teacher Agent: Claude Haiku (`claude-haiku-4-5-20251001`) — mascot voice and Socratic chat
- Evaluator Agent: Gemini Flash (`gemini-3.5-flash`) — silent mastery scoring. `gemini-2.0-flash` shut down 1 Jun 2026
- Embeddings: Gemini `gemini-embedding-001` — RAG only, never child-facing text

## Prompt layers
The Teacher system prompt has 7 layers. The original project notes described 3.
1. `BASE_TUTOR_RULES`
2. `CHARACTER_VOICE`
3. `SUBJECT_CONTEXT`
4. `GRADE_BAND`
5. `LEARNING_PATH`
6. `RAG_CONTEXT`
7. `MCP_CONTEXT`

## Mastery
`MASTERED_SCORE` is 90. A topic is mastered only when the evaluator score is 90 or higher.

## Two GradeBand types — do not mix them
- Tutoring grades: `'K' | '1' | '2' | '3'` in `src/constants/gradeBands.ts`
- RAG chunk grades: `'K' | '1' | 'K-1'` in `src/types/rag.ts`

## Current Math path — do not reset
Live Math path for the test parent. Leave it as it is.
- `currentTopic`: Counting to 20
- `currentGrade`: K
- `suggestedNextTopic`: Shapes
- `parentApproved`: false
- `topicsCompleted`: Counting to 10 only
- History in saved order:
  - Counting to 10, score 100, at `2026-09-26T17:55:51.558Z`
  - Counting to 20, score 40, at `2026-09-26T17:56:08.773Z`
  - Counting to 20, score 30, at `2026-09-26T17:56:08.773Z`
  - Counting to 20, score 92, at `2026-10-10T23:03:46.508Z`
- The last two scores are 30 and 92, so the next Math chat uses the normal hint.
- Do not click "Yes, start this next" or "Keep practicing current topic".
