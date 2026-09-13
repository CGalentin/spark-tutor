# Next session prompt — paste this into a new Cursor chat

Paused after PR 2-12 (merged to local `dev` on 13 Sep 2026). Resume with PR 2-13, then 2-14.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-12 are complete and merged to local `dev`. Do not redo them.

Start PR 2-13 from local `dev` on branch `feature/next-topic-suggester`. Follow ROADMAP-v2_1.md exactly. After 2-13: stop, summarize, wait for me to say "continue" before merging or starting 2-14.

What's done through 2-12

Grade-band configs + prompt strings (K–3). Chat API accepts optional grade (defaults to 'K'). Child UI still does not send grade on `/api/chat`.

Topic curriculum map: TOPIC_MAP + getTopics().

Types: LearningPath, TopicMastery, EvaluationResult. MASTERED_SCORE is 90 (not 80). mastered is true only when score >= 90. Use the shared MASTERED_SCORE constant. Rubric: 71–89 close, 90–100 mastered.

Firestore: Admin CRUD in src/lib/firebase/learningPath.ts (never import from Client Components); subscribeToLearningPath in src/lib/firebase/firestore.ts. Path: users/{parentUID}/learningPath/{subject}.

Session start reads or creates a learning path and returns currentTopic, currentGrade, suggestedNextTopic.

Gemini Flash evaluator: getGeminiFlashClient() is a separate singleton from embeddings. Model is gemini-3.5-flash (gemini-2.0-flash was shut down 1 Jun 2026). evaluateMastery(messages, topic, grade) returns EvaluationResult. Prompt lives in src/lib/gemini/buildEvaluatorPrompt.ts. Unreadable JSON falls back to score 0 / mastered false.

Topic boundary: detectTopicBoundary in src/lib/mcp/topicBoundary.ts. TOPIC_BLOCK_SIZE = 6. Also true if the last child message says "I'm done" / "im done" / "next topic" / "something else". Count 0 is not a boundary. useSessionStore.topicMessageCount tracks the current block.

POST /api/evaluate: auth, evaluateMastery, saves evaluations[] on the session doc, saveMasteryResult on the learning path. If mastered: sets parentApproved = false. The route currently has a **local** suggestNextTopic() helper (next topic in the current grade only — does not use mastery history or roll to the next grade). PR 2-13 replaces that with src/lib/gemini/suggestNextTopic.ts.

Chat: after each mascot reply, increment topicMessageCount, detectTopicBoundary, fire-and-forget POST /api/evaluate, reset the counter. Failures are silent — no child UI change.

PR 2-13 · Next Topic Suggester

Branch: feature/next-topic-suggester (off local `dev`).

- Create /src/lib/gemini/suggestNextTopic.ts:
  - suggestNextTopic(subject, grade, completedTopics, masteryHistory) → string
  - Uses TopicMap to find unmastered topics in current grade
  - Picks the most logical next topic based on curriculum sequence
  - If all topics in current grade mastered: suggests first topic of next grade
  - Returns topic name as a plain string
- Update /src/app/api/evaluate/route.ts:
  - Call suggestNextTopic() when mastered: true
  - Save suggestion to learningPath.suggestedNextTopic in Firestore
  - Remove the local helper in the route
- Verify TypeScript compiles: npx tsc --noEmit
- Commit: feat(gemini): add next topic suggester using curriculum map and mastery history

Tutoring grade is @/constants (src/constants/gradeBands.ts) — 'K' | '1' | '2' | '3'. Do not use RAG GradeBand from @/types.

PR 2-14 · Sprint 2 Integration Test (only after I say continue and 2-13 is merged)

Branch: `dev` (no feature branch).

- Run a 6-message chat session on a Math topic
- Verify /api/evaluate is called after message 6 (Network tab)
- Check Firestore — evaluations[] on the session doc
- Check Firestore — learningPath updated with mastery result
- If mastered: suggestedNextTopic populated on learningPath
- Verify chat never paused or blocked during evaluation
- npx tsc --noEmit
- npm run build
- Do not vercel --prod unless I ask
- Commit: chore: sprint 2 complete — evaluator agent live with gemini flash

Workflow

I am newer to coding — explain what each piece does as you build.
After each PR: stop, summarize, wait for me to say "continue" before merging or starting the next PR.
Merge each feature/ branch to local `dev` before creating the next one.
Shell is PowerShell — use ; not &&; no bash heredocs.
Do not push unless I ask.
origin/dev may be behind local `dev`; do not force-push.
Leave uncommitted AGENTS.md, CLAUDE.md, and spark_tutor_build_bible_2.docx alone.

Memory bank (required)

After every PR: activeContext.md, progress.md, check off ROADMAP-v2_1.md.
After architecture changes: also systemPatterns.md and techContext.md.
After product-scope changes: also projectbrief.md and productContext.md.
When 2-13 starts, you can delete or shorten next-session-prompt.md if it is stale.

Do not mix these GradeBand types

Tutoring K–3: @/constants (src/constants/gradeBands.ts)
RAG chunks: @/types (src/types/rag.ts — 'K' | '1' | 'K-1')

After 2-13, wait for my review.
