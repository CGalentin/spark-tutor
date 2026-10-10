# Next session prompt — paste this into a new Cursor chat

PRs 2-01 through 2-22 are merged and pushed to `origin/dev` (10 Oct 2026). Local `dev` matches `origin/dev` at the PR 2-22 docs commit. Do not redo them. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

Next session starts at PR 2-23 only. Stop after 2-23 and wait. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-22 are complete and pushed to `origin/dev`. Do not redo them. Local `dev` and `origin/dev` should match. If they do not, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. Start with PR 2-23 only. After 2-23: stop, summarize, and wait for me to say "continue" before merging or starting 2-24.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — done and pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — start here
- 2-24 Session summary includes mastery (`feature/session-summary-v2`)
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`)
- 2-26 Final end-to-end test on `dev`
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` into `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-23 · Learning Path History

Branch: `feature/learning-path-history` off local `dev`.

Create `/src/components/parent/LearningPathHistory.tsx`:

- Timeline of mastered topics with scores and dates
- Groups by subject (Math | Reading)
- Shows the current topic in progress with its live score
- Collapses to the last 5 entries by default, expandable to the full history
- Shadcn `Card`, `Badge`, and `Collapsible`. Do not edit files in `src/components/ui/`

Add it to the parent dashboard below session history.

- `npx tsc --noEmit`
- Commit: `feat(parent-ui): add learning path history timeline to parent dashboard`
- Check the parent dashboard in the browser: click the real control. Child chat must keep working.

What is already built (do not redo)

`TopicSuggestionCard` and `useLearningPath` are on the dashboard, above `LiveSessionPanel`, for math and for reading. The card shows only when `suggestedNextTopic` is set and `parentApproved` is false. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. The hook also returns `error` for a listener failure. It does not import `src/lib/firebase/learningPath.ts`.

The evaluator's short reason is not on the learning path document. The card finds it on the newest session evaluation whose `topic` is the current topic and whose `suggestedNext` is the suggestion. If none matches, the card says the evaluator did not leave a note.

`MasteryIndicator` takes `topic` and `score`. Red 0–49 Building, yellow 50–89 Almost there, green 90–100 Mastered! using `MASTERED_SCORE` (90). The ring does not subscribe to Firestore. `LiveSessionPanel` mounts it.

`useLiveSession` reuses `subscribeToSessions` and keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. The live card is above session history. Empty copy is "No active session".

This parent still has older sessions that were never ended. The live card therefore shows Counting to 20, grade K, 4 messages, score 0, until a newer open session exists. Do not close those old sessions unless asked.

Two short Math sessions named Buddy were started and ended on 10 Oct 2026. No chat message was sent in either. They belong in session history. The learning path was not reset.

Tutoring grade is `@/constants` (`src/constants/gradeBands.ts`): `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types` (`src/types/rag.ts`): `'K' | '1' | 'K-1'`. Never mix them. `@/types` re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

`MASTERED_SCORE` is 90. `mastered` is true only when score >= 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

Topic map: `TOPIC_MAP` + `getTopics()` in `src/constants/topicMap.ts`. Math and reading, K–3. Science is a Phase 2 placeholder.

Firestore learning path: `users/{parentUID}/learningPath/{subject}`. Admin CRUD is `src/lib/firebase/learningPath.ts` — never import that file from a Client Component. Live reads: `subscribeToLearningPath` in `src/lib/firebase/firestore.ts`. That listener casts `snap.data()` as `LearningPath` and does not fill in missing fields. Session live reads: `subscribeToSessions`.

Learning path fields: `currentGrade`, `currentTopic`, `topicsCompleted`, `masteryHistory` (each entry has topic, subject, grade, score, mastered, evaluatedAt — no reasoning), `suggestedNextTopic`, `parentApproved`, `parentApprovedAt`, `lastEvaluatedAt`. Reasoning lives on session `evaluations[]`.

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. `suggestedNextTopic` is null and `parentApproved` is true. The latest mastery scores on Counting to 20 are 40 and 30 (an older Counting to 10 score of 100 is still in history), so the next Math chat uses the **easier** hint until two higher scores are saved. Do not reset that path unless I ask. Reading has no learning path for this parent.

Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic`. Reject does not set `parentApproved` back to true.

Production is still the v1 app at https://spark-tutor-app.vercel.app. Do not run `vercel --prod` unless I ask.

I am newer to coding. Explain what each piece does as you build it, in plain language.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. For git commits, `git commit -m "message"` is fine.

Do not push unless I ask. Do not force-push.

Leave uncommitted `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` alone. Do not commit them.

Parent UI changes must be checked in the browser before you call the PR done. Child chat must keep working.

After the PR: update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop and wait.

Hard parts from PR 2-22 (do not rediscover these)

These slowed the last session down. Read them before writing a browser check or touching the learning path.

1. There is no Cursor browser tool in this workspace. The parent dashboard was checked with playwright-core installed in a temp folder (`%TEMP%\spark-playwright`), not added to this repo. Use `channel: 'chrome'`. Sign in with a Firebase Admin custom token and the Firebase CDN client on the default app name, so IndexedDB persistence matches the Next app, then reload `/dashboard`. Do not print the token or any `.env` value. Delete temp scripts before the commit. `npx -p playwright-core` did not resolve for a local script; set `NODE_PATH` to the temp install.

2. The card hides the moment a button is clicked, before the API finishes. The first reject check looked like a failure because Firestore was read about 1.5 seconds later, while a cold Turbopack compile of `POST /api/learning-path/reject` took about 2.3 seconds. Wait for the HTTP status and read Firestore again after the response. A 200 with `suggestedNextTopic` still set on an early read is the optimistic hide, not a bug.

3. To make the card visible, a temp Admin script set `suggestedNextTopic` to `Shapes` and `parentApproved` to false. It did not touch `currentTopic`, grade, `topicsCompleted`, or `masteryHistory`. Reject then cleared only the suggestion. `parentApproved` stayed false, because reject does not restore it. A second script set `parentApproved` back to true. The path is Counting to 20, grade K, completed Counting to 10, suggestion null, approved true, scores Counting to 10:100, Counting to 20:40, Counting to 20:30. Do not click **Yes, start this next** on this path unless I ask. Approve would leave Counting to 20 and append it to `topicsCompleted`, which changes the easier hint.

4. The Shapes suggestion had no matching session evaluation, so the card correctly showed "The evaluator did not leave a note for this suggestion." Do not invent a reason, and do not add `reasoning` onto the learning path document.

5. Child chat checks: the subject picker comes before the input. Click Math before waiting for "Say something...". The end button's visible text is "All Done!" and its accessible name is "End session". `getByText('Live session')` also matches "Checking for a live session…"; use an exact match. The chat page shows the input even when `/api/session/start` returns 404, because it falls back to a client session id. Confirm start and end both return 200.

6. On this machine, `POST /api/session/start` and `POST /api/session/end` once returned a Next.js HTML 404 while the route files existed and `/api/chat` returned 401. That was a stale Turbopack dev server, not a missing route. Touching the route file forced a recompile; the next request hit the handler. A `console.log` was added to diagnose it and then removed. Do not leave debug logs. If it happens again, restart `npm run dev` and re-check. Do not rewrite the route.

7. PowerShell: `Invoke-WebRequest -SkipHttpErrorCheck` is not supported here. Use `curl.exe` to see error status codes. Use `;` between commands.

8. ESLint `react-hooks/refs` forbids reading or writing a ref during render. Reset a click-lock ref inside `useEffect`. Setting state during render to clear a derived "hidden" flag was allowed.

9. The pre-commit hook runs `npx tsc --noEmit`, `npx prettier --check src/`, and `npx eslint src/ --ext .ts,.tsx`. A docs-only commit still runs it. Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.
