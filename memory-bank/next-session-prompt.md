# Next session prompt — paste this into a new Cursor chat

Sprint 3 is complete and pushed to `origin/dev` (26 Sep 2026). Tomorrow starts Sprint 4 at PR 2-20. Do not redo 2-01 through 2-19. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-19 are complete and pushed to `origin/dev`. Do not redo them. Local `dev` and `origin/dev` should match. If they do not, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. Start with PR 2-20 only. After 2-20: stop, summarize, and wait for me to say "continue" before merging or starting 2-21.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — start here
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`)
- 2-22 TopicSuggestionCard + useLearningPath, calls approve/reject (`feature/topic-suggestion-card`)
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`)
- 2-24 Session summary includes mastery (`feature/session-summary-v2`)
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`)
- 2-26 Final end-to-end test on `dev` (`test: final v2 phase 1 end-to-end test pass`)
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` → `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-20 · Mastery Indicator Component

Branch: `feature/mastery-indicator` off local `dev`.

Create `/src/components/parent/MasteryIndicator.tsx`:

- Circular progress ring (SVG) for a mastery score from 0 to 100
- Colors: red 0–49, yellow 50–89, green 90–100
- Shows the topic name, the numeric score, and a confidence label: "Building" (0–49), "Almost there" (50–89), "Mastered!" (90–100)
- Use the shared `MASTERED_SCORE` constant (90) for the mastered label. The ring's yellow band is 50–89, which is wider than the evaluator's "close" band (71–89). Follow the ring colors in the roadmap.
- Animates smoothly when the score prop changes. The live Firestore listener is PR 2-21 (`useLiveSession`). This component should accept the score as a prop and animate when that prop changes. Do not subscribe to Firestore inside the ring, and do not mount it on the dashboard yet.
- Use the Shadcn `Badge` for the confidence label. Parent UI uses Shadcn. Child UI does not.
- Accessible: an `aria-label` that includes the topic and the score for screen readers
- Keep the component under 200 lines
- `npx tsc --noEmit`
- Commit: `feat(parent-ui): add mastery indicator component with animated progress ring`

Parent dashboard today lives at `src/app/(parent)/dashboard/page.tsx`. Existing parent components: `src/components/parent/DashboardHeader.tsx`, `src/components/parent/SessionSummaryCard.tsx`. Shadcn pieces are in `src/components/ui/` — do not edit those files; wrap them.

What is already built (do not redo)

Tutoring grade is `@/constants` (`src/constants/gradeBands.ts`): `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types` (`src/types/rag.ts`): `'K' | '1' | 'K-1'`. Never mix them. `@/types` re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

`MASTERED_SCORE` is 90. `mastered` is true only when score >= 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

Topic map: `TOPIC_MAP` + `getTopics()` in `src/constants/topicMap.ts`. Math and reading, K–3. Science is a Phase 2 placeholder.

Firestore learning path: `users/{parentUID}/learningPath/{subject}`. Admin CRUD is `src/lib/firebase/learningPath.ts` — never import that file from a Client Component. Live reads for the dashboard already exist: `subscribeToLearningPath` in `src/lib/firebase/firestore.ts` (client SDK). Session live reads: `subscribeToSessions`.

Learning path fields: `currentGrade`, `currentTopic`, `topicsCompleted`, `masteryHistory` (each entry has topic, subject, grade, score, mastered, evaluatedAt), `suggestedNextTopic`, `parentApproved`, `parentApprovedAt`, `lastEvaluatedAt`.

Session start reads or creates a path, teaches `currentTopic` even when `suggestedNextTopic` is set and `parentApproved` is false, saves `currentTopic` / `currentGrade` / `difficultyHint` on the session doc, and returns those plus a `learningPath` summary.

Chat page sends `grade` (the session's `currentGrade`) and `currentTopic` on every `/api/chat` request. If `grade` is omitted, the API still defaults to `'K'`. The sent topic wins over a newer path topic so a mid-session approval does not change the lesson already open.

Teacher system prompt is 7 layers: 1 BASE_TUTOR_RULES, 2 CHARACTER_VOICE, 3 SUBJECT_CONTEXT, 4 GRADE_BAND, 5 LEARNING_PATH, 6 RAG, 7 MCP. Missing path and no sent topic skips Layer 5.

Difficulty (`src/lib/claude/adaptDifficulty.ts`): last two scores on the current topic. Both < 50 → easier ("Use more visual descriptions, break into smaller steps, extra encouragement"). Both > 85 → harder ("Challenge with slightly harder variations, ask follow-up questions"). Otherwise normal, and normal adds no extra line because Layer 4 is already the grade-band prompt. Fewer than two scores on that topic stays normal. Scores of exactly 50 or exactly 85 stay normal.

Evaluator: `getGeminiFlashClient()` is a separate singleton from embeddings. Model is `gemini-3.5-flash` (`gemini-2.0-flash` was shut down 1 Jun 2026). `evaluateMastery` lives in `src/lib/gemini/evaluate.ts`. Prompt is `src/lib/gemini/buildEvaluatorPrompt.ts`. When mastered, `/api/evaluate` sets `parentApproved` false and saves `suggestedNextTopic` from `src/lib/gemini/suggestNextTopic.ts` (curriculum order + mastery history; rolls K→1→2→3). Grade 3 with nothing left stays on the last listed topic.

Topic boundary: `detectTopicBoundary` in `src/lib/mcp/topicBoundary.ts`. `TOPIC_BLOCK_SIZE` is 6. Also true if the last child message says "I'm done" / "im done" / "next topic" / "something else". Count 0 is not a boundary. Chat increments `topicMessageCount` after each mascot reply, and on a boundary fire-and-forgets `POST /api/evaluate`, then resets the counter. Failures are silent. The child never sees the score.

Parent topic API (dashboard wires these in 2-22, not before):

- `POST /api/learning-path/approve` body `{ subject, approvedTopic }`. Sets `currentTopic` to that topic, `parentApproved` true, `parentApprovedAt` now, `suggestedNextTopic` null, and appends the topic being left onto `topicsCompleted` (skip if it is already listed, or if it is the same topic). Returns `{ approved: true, newTopic }`. Does not change `currentGrade`.
- `POST /api/learning-path/reject` body `{ subject }`. Clears `suggestedNextTopic` only. `currentTopic` stays. Returns `{ rejected: true }`.
- Both verify the Firebase ID token. A missing learning path returns 404. Responses use `ApiResult`: `{ success: true, data }` or `{ success: false, error }`.

Approve does not roll `currentGrade` when the new topic belongs to the next grade. That is still true.

Live check from 26 Sep 2026 (already done): six Math messages on Counting to 10, evaluate score 100, suggested Counting to 20, approve switched the path, a new session taught Counting to 20, and two scores under 50 produced a one-hand finger-counting reply.

Live data warning

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. The latest mastery scores on Counting to 20 are 40 and 30, so the next Math chat uses the **easier** hint until two higher scores are saved. Do not reset that path unless I ask. Reading it is fine. A new session for that parent will start on Counting to 20, not Counting to 10.

Production is still the v1 app at https://spark-tutor-app.vercel.app. Sprint 4 is not deployed. Do not run `vercel --prod` unless I ask.

Workflow

I am newer to coding. Explain what each piece does as you build it, in plain language.

After each PR: stop, summarize what changed and how to tell it worked, and wait for me to say "continue" before merging or starting the next PR.

Merge each `feature/` branch into local `dev` before creating the next one. PR 2-26 and the final test run on `dev`. PR 2-27 is the only one that touches `main`, and only after I say to deploy.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. Do not use bash heredocs. For git commits, `git commit -m "message"` is fine.

Do not push unless I ask. `origin/dev` may fall behind local `dev` again; do not force-push.

Leave uncommitted `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` alone. Do not commit them.

Parent UI changes must be checked in the browser before you call the PR done: click the real control, not just a screenshot. Child chat must keep working. If no browser tool is available, say exactly what you could not click.

Memory bank (required)

After every PR: `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md` so the next chat can resume.

After architecture changes: also `systemPatterns.md` and `techContext.md`.

After product-scope changes: also `projectbrief.md` and `productContext.md`.

After 2-20, wait for my review.
