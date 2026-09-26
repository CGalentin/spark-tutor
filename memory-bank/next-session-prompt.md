# Next session prompt — paste this into a new Cursor chat

PR 2-15 is done on `feature/learning-path-prompt-injection` (26 Sep 2026). Waiting for review.
After you say "continue": merge 2-15 to local `dev`, then start PR 2-16.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-15 are complete. 2-15 is on `feature/learning-path-prompt-injection` and is not merged yet.

I said continue. Merge `feature/learning-path-prompt-injection` into local `dev` (no push). Then start PR 2-16 from local `dev` on branch `feature/parent-topic-approval`. Follow ROADMAP-v2_1.md exactly. After 2-16: stop, summarize, wait for me to say "continue" before merging or starting 2-17.

What's done through 2-15

Grade-band configs + prompt strings (K–3). Chat API accepts optional grade (defaults to 'K'). Child UI still does not send grade on `/api/chat`.

Topic curriculum map: TOPIC_MAP + getTopics().

Types: LearningPath, TopicMastery, EvaluationResult, LearningPathContext, DifficultyHint. MASTERED_SCORE is 90. mastered is true only when score >= 90.

Firestore: Admin CRUD in src/lib/firebase/learningPath.ts (never import from Client Components); subscribeToLearningPath in src/lib/firebase/firestore.ts. Path: users/{parentUID}/learningPath/{subject}.

Session start reads or creates a learning path and returns currentTopic, currentGrade, suggestedNextTopic.

Gemini Flash evaluator: gemini-3.5-flash. evaluateMastery + suggestNextTopic when mastered. Chat fires evaluate at topic boundaries (fire-and-forget).

Teacher system prompt is 7 layers: 1 BASE_TUTOR_RULES, 2 CHARACTER_VOICE, 3 SUBJECT_CONTEXT, 4 GRADE_BAND, 5 LEARNING_PATH, 6 RAG, 7 MCP. /api/chat fetches getLearningPath each request. difficultyHint is always 'normal' until PR 2-17. Missing path skips Layer 5.

Live check: off-topic "multiplication and dinosaurs" → mascot stayed on Counting to 10.

PR 2-16 · Parent Topic Approval API

Branch: feature/parent-topic-approval (off local `dev` after merging 2-15).

- Create /src/app/api/learning-path/approve/route.ts — POST:
  - Accepts { subject, approvedTopic }
  - Verifies Firebase auth token
  - Updates learningPath: currentTopic → approvedTopic, parentApproved → true, parentApprovedAt → now, suggestedNextTopic → null, append previous topic to topicsCompleted[]
  - Returns { approved: true, newTopic: approvedTopic }
- Create /src/app/api/learning-path/reject/route.ts — POST:
  - Accepts { subject }
  - Clears suggestedNextTopic without changing currentTopic
  - Returns { rejected: true }
- Add types to /src/types/api.ts
- npx tsc --noEmit
- Commit: feat(api): add parent topic approval and rejection endpoints

Tutoring grade is @/constants (src/constants/gradeBands.ts). Do not use RAG GradeBand from @/types.

Workflow

I am newer to coding — explain what each piece does as you build.
After each PR: stop, summarize, wait for me to say "continue" before merging or starting the next PR.
Merge each feature/ branch to local `dev` before creating the next one.
Shell is PowerShell — use ; not &&; no bash heredocs.
Do not push unless I ask.
origin/dev may be behind local `dev`; do not force-push.
Leave uncommitted AGENTS.md, CLAUDE.md, and spark_tutor_build_bible_2.docx alone.
Do not vercel --prod unless I ask. Do not merge to main.

Memory bank (required)

After every PR: activeContext.md, progress.md, check off ROADMAP-v2_1.md.
After architecture changes: also systemPatterns.md and techContext.md.
After product-scope changes: also projectbrief.md and productContext.md.

Do not mix these GradeBand types

Tutoring K–3: @/constants (src/constants/gradeBands.ts)
RAG chunks: @/types (src/types/rag.ts — 'K' | '1' | 'K-1')

After 2-16, wait for my review.
