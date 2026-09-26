# Next session prompt — paste this into a new Cursor chat

PR 2-18 is committed on `feature/session-full-integration` (26 Sep 2026). It is NOT merged. Local `dev` includes PR 2-17. `origin/dev` is still at PR 2-15 — do not force-push.

If the user says "continue": merge `feature/session-full-integration` into local `dev` first, then do PR 2-19 on `dev`. Do not start 2-19 before that merge. Do not push unless asked. Do not `vercel --prod` unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-17 are complete and merged to local `dev`. `origin/dev` is still at PR 2-15. Do not redo them. Do not force-push.

PR 2-18 is committed on `feature/session-full-integration` and is waiting for review. Do not redo it. Do not merge it and do not start PR 2-19 until I say "continue". When I say "continue", merge `feature/session-full-integration` into local `dev` first, then do PR 2-19 on `dev`.

What's done through 2-18

Grade-band configs + prompt strings (K–3). Chat page sends the session's currentGrade and currentTopic on every `/api/chat` request. If grade is omitted, the API still defaults to 'K'.

Topic curriculum map: TOPIC_MAP + getTopics().

Types: LearningPath, TopicMastery, EvaluationResult, LearningPathContext, DifficultyHint, LearningPathSummary. MASTERED_SCORE is 90. mastered is true only when score >= 90. Rubric: 71–89 close, 90–100 mastered.

Firestore: Admin CRUD in src/lib/firebase/learningPath.ts (never import from Client Components); subscribeToLearningPath in src/lib/firebase/firestore.ts. Path: users/{parentUID}/learningPath/{subject}.

Session start reads or creates a learning path first. If parentApproved is false and suggestedNextTopic is set, the session teaches currentTopic. The session doc stores currentTopic, currentGrade, and difficultyHint. Response includes those fields plus a learningPath summary.

Gemini Flash evaluator: getGeminiFlashClient() is a separate singleton. Model is gemini-3.5-flash. evaluateMastery returns EvaluationResult. Unreadable JSON falls back to score 0 / mastered false.

Topic boundary: detectTopicBoundary. TOPIC_BLOCK_SIZE = 6. Also true for "I'm done" / "im done" / "next topic" / "something else". Count 0 is not a boundary.

POST /api/evaluate: auth, evaluateMastery, saves evaluations[] and mastery history. If mastered: parentApproved = false and suggestNextTopic(). Saves suggestedNextTopic.

Chat: after each mascot reply, increment topicMessageCount, detectTopicBoundary, fire-and-forget POST /api/evaluate, reset the counter. Failures are silent.

Teacher prompt is 7 layers. /api/chat uses the request grade for Layer 4 and the request currentTopic for Layer 5 (that topic wins over a newer path topic). Difficulty: last two scores on that topic, both < 50 → easier, both > 85 → harder, otherwise normal. Fewer than two scores stays normal. Missing path with no sent topic skips Layer 5.

Parent topic approval (merged to local dev):
- POST /api/learning-path/approve { subject, approvedTopic }
- POST /api/learning-path/reject { subject } clears suggestedNextTopic only
- Child UI does not call these (dashboard is PR 2-22). currentGrade is not changed by approve.

PR 2-19 · Sprint 3 Integration Test

Branch: `dev` (after 2-18 is merged).

- Full flow test:
  - Start session → chat 6 messages on Math topic → verify evaluation fires
  - Check Firestore: mastery scored + next topic suggested
  - Verify Teacher Agent stays focused on current topic in next messages
  - Call approve endpoint manually → verify topic updates
  - Start new session → verify Teacher prompt now references the new approved topic
- Test difficulty adaptation: set a low mastery score → verify Teacher uses easier language
- npx tsc --noEmit
- npm run build
- Commit: chore: sprint 3 complete — agentic learning path fully wired

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

After 2-19, wait for my review.
