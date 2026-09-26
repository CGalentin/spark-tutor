# Next session prompt — paste this into a new Cursor chat

PR 2-17 is committed on `feature/difficulty-adaptation` (26 Sep 2026). It is NOT merged. Local `dev` includes PR 2-16. `origin/dev` is still at PR 2-15 — do not force-push.

If the user says "continue": merge `feature/difficulty-adaptation` into local `dev` first, then start PR 2-18. Do not start 2-18 before that merge. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-16 are complete and merged to local `dev`. `origin/dev` is still at PR 2-15. Do not redo them. Do not force-push.

PR 2-17 is committed on `feature/difficulty-adaptation` and is waiting for review. Do not redo it. Do not merge it and do not start PR 2-18 until I say "continue". When I say "continue", merge `feature/difficulty-adaptation` into local `dev` first, then start PR 2-18 from that updated `dev`.

What's done through 2-17

Grade-band configs + prompt strings (K–3). Chat API accepts optional grade (defaults to 'K'). Child UI still does not send grade on `/api/chat`.

Topic curriculum map: TOPIC_MAP + getTopics().

Types: LearningPath, TopicMastery, EvaluationResult, LearningPathContext, DifficultyHint. MASTERED_SCORE is 90 (not 80). mastered is true only when score >= 90. Use the shared MASTERED_SCORE constant. Rubric: 71–89 close, 90–100 mastered.

Firestore: Admin CRUD in src/lib/firebase/learningPath.ts (never import from Client Components); subscribeToLearningPath in src/lib/firebase/firestore.ts. Path: users/{parentUID}/learningPath/{subject}.

Session start reads or creates a learning path and returns currentTopic, currentGrade, suggestedNextTopic.

Gemini Flash evaluator: getGeminiFlashClient() is a separate singleton from embeddings. Model is gemini-3.5-flash. evaluateMastery(messages, topic, grade) returns EvaluationResult. Prompt lives in src/lib/gemini/buildEvaluatorPrompt.ts. Unreadable JSON falls back to score 0 / mastered false.

Topic boundary: detectTopicBoundary in src/lib/mcp/topicBoundary.ts. TOPIC_BLOCK_SIZE = 6. Also true if the last child message says "I'm done" / "im done" / "next topic" / "something else". Count 0 is not a boundary.

POST /api/evaluate: auth, evaluateMastery, saves evaluations[] on the session doc, saveMasteryResult on the learning path. If mastered: parentApproved = false and src/lib/gemini/suggestNextTopic.ts (curriculum + mastery history; rolls to next grade). Saves learningPath.suggestedNextTopic.

Chat: after each mascot reply, increment topicMessageCount, detectTopicBoundary, fire-and-forget POST /api/evaluate, reset the counter. Failures are silent.

Teacher system prompt is 7 layers: 1 BASE_TUTOR_RULES, 2 CHARACTER_VOICE, 3 SUBJECT_CONTEXT, 4 GRADE_BAND, 5 LEARNING_PATH, 6 RAG, 7 MCP. /api/chat fetches getLearningPath each request and injects currentTopic + masteredTopics. Missing path skips Layer 5.

Difficulty (PR 2-17, not merged): getDifficultyHint in src/lib/claude/adaptDifficulty.ts. Last two scores on the current topic: both < 50 → easier, both > 85 → harder, otherwise normal. Fewer than two scores stays normal. /api/chat passes the hint into Layer 5. Easier and harder append a teaching line. Normal adds no extra line — Layer 4 is the standard grade-band prompt.

Parent topic approval (PR 2-16, merged to local dev, not pushed):
- POST /api/learning-path/approve { subject, approvedTopic } — currentTopic becomes approvedTopic, parentApproved true, parentApprovedAt now, suggestedNextTopic null, previous topic appended to topicsCompleted[] (skip if already listed or if it is the same topic). Returns { approved: true, newTopic }.
- POST /api/learning-path/reject { subject } — clears suggestedNextTopic only. currentTopic stays. Returns { rejected: true }.
- Both verify Firebase auth. Missing learning path returns 404. currentGrade is not changed. Child UI does not call these (dashboard is PR 2-22).

Live check (2-15): off-topic "multiplication and dinosaurs" → mascot stayed on Counting to 10.

PR 2-18 · Session Start Full Learning Path Integration

Branch: feature/session-full-integration (off local `dev` AFTER 2-17 is merged).

- Update /src/app/api/session/start/route.ts:
  - Check learningPath.parentApproved — if false and suggestedNextTopic exists, session starts on current topic (not the suggested one) until parent approves
  - Save currentTopic, currentGrade, difficultyHint to session doc at start
  - Return full learning path summary in SessionStartResponse
- Update chat page to pass currentGrade and currentTopic with every chat request
- Update chat API route to use these values in prompt composition
- npx tsc --noEmit
- Commit: feat(api): full learning path integration in session start flow

Tutoring grade is @/constants (src/constants/gradeBands.ts) — 'K' | '1' | '2' | '3'. Do not use RAG GradeBand from @/types.

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

After 2-18, wait for my review.
