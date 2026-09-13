# Next session prompt — paste this into a new Cursor chat

Sprint 2 is complete on local `dev` (PR 2-14, 13 Sep 2026). Waiting for review.
After you say "continue": start PR 2-15. Do not merge to main. Do not vercel --prod unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-14 are complete and merged to local `dev`. Sprint 2 is done. Do not redo them.

I said continue. Start PR 2-15 from local `dev` on branch `feature/learning-path-prompt-injection`. Follow ROADMAP-v2_1.md exactly. After 2-15: stop, summarize, wait for me to say "continue" before merging or starting 2-16.

What's done through 2-14

Grade-band configs + prompt strings (K–3). Chat API accepts optional grade (defaults to 'K'). Child UI still does not send grade on `/api/chat`.

Topic curriculum map: TOPIC_MAP + getTopics().

Types: LearningPath, TopicMastery, EvaluationResult. MASTERED_SCORE is 90 (not 80). mastered is true only when score >= 90. Use the shared MASTERED_SCORE constant. Rubric: 71–89 close, 90–100 mastered.

Firestore: Admin CRUD in src/lib/firebase/learningPath.ts (never import from Client Components); subscribeToLearningPath in src/lib/firebase/firestore.ts. Path: users/{parentUID}/learningPath/{subject}.

Session start reads or creates a learning path and returns currentTopic, currentGrade, suggestedNextTopic.

Gemini Flash evaluator: getGeminiFlashClient() is a separate singleton from embeddings. Model is gemini-3.5-flash. evaluateMastery(messages, topic, grade) returns EvaluationResult. Prompt lives in src/lib/gemini/buildEvaluatorPrompt.ts. Unreadable JSON falls back to score 0 / mastered false.

Topic boundary: detectTopicBoundary in src/lib/mcp/topicBoundary.ts. TOPIC_BLOCK_SIZE = 6. Also true if the last child message says "I'm done" / "im done" / "next topic" / "something else". Count 0 is not a boundary.

POST /api/evaluate: auth, evaluateMastery, saves evaluations[] on the session doc, saveMasteryResult on the learning path. If mastered: parentApproved = false and src/lib/gemini/suggestNextTopic.ts (curriculum + mastery history; rolls to next grade). Saves learningPath.suggestedNextTopic.

Chat: after each mascot reply, increment topicMessageCount, detectTopicBoundary, fire-and-forget POST /api/evaluate, reset the counter. Failures are silent.

Sprint 2 live check: 6 Math messages on Counting to 10 → evaluate after message 6 → evaluations[] + masteryHistory. Score 65 / not mastered, so suggestedNextTopic stayed null. tsc and npm run build passed. vercel --prod was skipped.

Current system prompt layers (before 2-15): 1 BASE_TUTOR_RULES, 2 CHARACTER_VOICE, 3 SUBJECT_CONTEXT, 4 GRADE_BAND, 5 RAG_CONTEXT, 6 MCP_CONTEXT. PR 2-15 inserts Learning Path as Layer 5 (after grade band, before RAG) — shift RAG/MCP down. Difficulty hint can be a placeholder until PR 2-17.

PR 2-15 · Learning Path Injects Into Teacher Prompt

Branch: feature/learning-path-prompt-injection (off local `dev`).

- Update /src/lib/claude/buildSystemPrompt.ts:
  - Add optional learningPathContext?: LearningPathContext param
  - Add Layer 5 (after grade band, before RAG):
    Current topic: ${currentTopic}
    Topics this child has already mastered: ${masteredTopics.join(', ')}
    Difficulty level: ${difficultyHint}
    Focus exclusively on ${currentTopic} until the child shows understanding.
    Do not introduce new topics — let the parent decide when to advance.
- Create LearningPathContext type in /src/types/learningPath.ts
- Update /src/app/api/chat/route.ts:
  - Fetch learning path at start of each chat request
  - Pass learning path context into buildSystemPrompt()
- Test: verify Claude stays on current topic and doesn't wander
- npx tsc --noEmit
- Commit: feat(api): inject learning path context into teacher agent system prompt

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

After 2-15, wait for my review.
