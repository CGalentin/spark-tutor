# Next session prompt — paste this into a new Cursor chat

PRs 2-01 through 2-23 are merged and pushed to `origin/dev` (10 Oct 2026). Local `dev` matches `origin/dev` at the PR 2-23 docs commit. Do not redo them. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

Next session starts at PR 2-24 only. Stop after 2-24 and wait. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-23 are complete and pushed to `origin/dev`. Do not redo them. Local `dev` and `origin/dev` should match. If they do not, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. Start with PR 2-24 only. After 2-24: stop, summarize, and wait for me to say "continue" before merging or starting 2-25.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — done and pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — done and pushed
- 2-24 Session summary includes mastery (`feature/session-summary-v2`) — start here
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`)
- 2-26 Final end-to-end test on `dev`
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` into `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-24 · Session Summary v2

Branch: `feature/session-summary-v2` off local `dev`.

Update `/src/lib/claude/buildSummaryPrompt.ts`:

- Add mastery evaluation data to the summary context
- Claude includes in the summary: topic mastered yes/no, score achieved, suggested focus for the next session

Update `SessionSummaryCard.tsx`:

- Mastery score badge, color coded red / yellow / green
- "Topic mastered" when the score is >= 90 (`MASTERED_SCORE`)
- "Suggested next: [topic]" when a suggestion exists

- `npx tsc --noEmit`
- Commit: `feat(parent-ui): update session summary with mastery scores and topic suggestion`
- Check the parent dashboard in the browser: click the real control. Child chat must keep working.

What the summary code does today (do not rediscover this)

`POST /api/summary` already verifies the Firebase token, rate-limits when Upstash is configured, loads `users/{parentUID}/sessions/{sessionId}`, and calls Claude Haiku (`claude-haiku-4-5-20251001`, max_tokens 600) with `SUMMARY_SYSTEM_PROMPT` plus `buildSummaryPrompt`.

Individual chat messages are not stored on the session. The end route forwards the in-memory `messages` array into `/api/summary`. An empty transcript becomes the sentence "The child had a {subject} session with {mascotName} but no messages were exchanged." The JSON keys today are only `topicsCovered`, `areasForPractice`, and `encouragementNote`. A bad Claude reply falls back to a generic practice note. The saved field is `session.summary` (nested, not a subcollection) plus `generatedAt`.

`Session.evaluations[]` is already on the session document. Each entry is an `EvaluationResult`: topic, score, mastered, confidence, suggestedNext, reasoning. The learning path document does not store reasoning. The summary route already has the session document, so it can read `evaluations` there. Do not ask the child client to send mastery scores.

`SessionSummaryCard` shows the date, subject badge, message count, stars, topics covered, "Keep Practicing", and the encouragement quote. While `summary` is missing it says "Summary generating — check back in a moment…". Parent text should stay at least 16px. Use Shadcn `Badge`. Do not edit files in `src/components/ui/`.

Score colors, same as the ring: red 0–49 Building, yellow 50–89 Almost there, green 90–100 Mastered!. Green starts at `MASTERED_SCORE` (90), not at the evaluator's "close" band (71).

A session with no evaluation has no score. Do not paint that as 0 / Building, because 0 means the evaluator ran and scored zero. Show a plain "No mastery score yet" line instead. Several empty Buddy sessions from 10 Oct 2026 have no messages and no evaluations. Their cards should still look fine.

What is already built (do not redo)

`LearningPathHistory` sits below session history. Math and Reading each listen with `useLearningPath`. Newest scores first. The latest score on the current topic is marked In progress. When two scores share a timestamp, the later entry in `masteryHistory` wins. Only the five newest stay visible. "Show full history" appears only when that subject has more than five scores. This parent has three, so that button is hidden. Hide Math and Hide Reading open and close each subject. Reading says "No reading topics yet."

`TopicSuggestionCard` sits above `LiveSessionPanel` for math and for reading. It shows only when `suggestedNextTopic` is set and `parentApproved` is false. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. The hook also returns `error`. It does not import `src/lib/firebase/learningPath.ts`. The evaluator note is looked up from the session evaluation whose `topic` is the current topic and whose `suggestedNext` is the suggestion. If none matches, the card says the evaluator did not leave a note.

`MasteryIndicator` takes `topic` and `score`. It does not subscribe to Firestore. `LiveSessionPanel` mounts it. `useLiveSession` keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. Empty copy is "No active session".

This parent still has older sessions that were never ended. The live card therefore shows Counting to 20, grade K, 4 messages, score 0, until a newer open session exists. Do not close those old sessions unless asked.

On 10 Oct 2026 several short Math sessions named Buddy were started and ended with no chat message. They belong in session history with a summary and no mastery score. The learning path was not reset.

Tutoring grade is `@/constants` (`src/constants/gradeBands.ts`): `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types` (`src/types/rag.ts`): `'K' | '1' | 'K-1'`. Never mix them. `@/types` re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

`MASTERED_SCORE` is 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

Firestore learning path: `users/{parentUID}/learningPath/{subject}`. Admin CRUD is `src/lib/firebase/learningPath.ts`. Never import that file from a Client Component. Live reads: `subscribeToLearningPath` in `src/lib/firebase/firestore.ts`. It casts `snap.data()` as `LearningPath` and does not fill missing fields.

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. `suggestedNextTopic` is null and `parentApproved` is true. History, in saved order:

- Counting to 10, score 100, mastered, `2026-09-26T17:55:51.558Z`
- Counting to 20, score 40, not mastered, `2026-09-26T17:56:08.773Z`
- Counting to 20, score 30, not mastered, same timestamp as the 40

The 40 and 30 share one timestamp. The later list entry is 30, so the timeline marks 30 as In progress. The next Math chat uses the **easier** hint until two higher scores on Counting to 20 are saved. Do not reset that path unless I ask. Reading has no learning path for this parent.

Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic`. Reject does not set `parentApproved` back to true. Do not click **Yes, start this next** unless I ask. Approve would leave Counting to 20 and append it to `topicsCompleted`.

Production is still the v1 app at https://spark-tutor-app.vercel.app. Do not run `vercel --prod` unless I ask.

I am newer to coding. Explain what each piece does as you build it, in plain language.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. For git commits, `git commit -m "message"` is fine.

Do not push unless I ask. Do not force-push.

Leave uncommitted `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` alone. Do not commit them.

Parent UI changes must be checked in the browser before you call the PR done. Child chat must keep working.

After the PR: update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop and wait.

Hard parts from the last sessions (do not rediscover these)

These slowed PR 2-22 and PR 2-23. Read them before a browser check or before touching the learning path.

1. There is no Cursor browser tool in this workspace. Check the dashboard with playwright-core installed in `%TEMP%\spark-playwright`, not added to this repo. Use `channel: 'chrome'`. Sign in with a Firebase Admin custom token and the Firebase CDN client `12.14.0` (`firebase-app-compat.js` and `firebase-auth-compat.js`) on the default app name, so IndexedDB persistence matches the Next app, then reload `/dashboard`. Do not print the token or any `.env` value. Delete temp scripts before the commit. `npx -p playwright-core` did not resolve for a local script. Set `NODE_PATH` to the temp install. `firebase-admin` resolves from this project's `node_modules`.

2. Shadcn `CardTitle` and `CardDescription` are `div`s, not headings. `getByRole('heading', { name: 'Learning path' })` does not find that card. The real heading on the dashboard is "Parent Dashboard". "Great job today!" on the child side is an `h1`, so a heading lookup works there. "Counting to 20" appears twice in the timeline. "In progress" also appears in the card description, so use exact text for the badge. Scope lookups to the card that contains the text "Learning path", or the live-session card will match the same topic.

3. The chat page sets the subject, and shows "Say something...", as soon as Math is tapped. `POST /api/session/start` may still be in flight. `handleEndSession` returns immediately while `sessionId` is still null, and no end request is sent. The session stays open, and the live card then shows that new empty session instead of the old one. Wait for start status 200, pause briefly so React can store the id, then click End. The button's visible text is "All Done!" and its accessible name is "End session". Confirm end status 200 and the heading "Great job today!". The subject picker comes before the input. Click Math before waiting for the placeholder.

4. On 10 Oct 2026 that early End click left two empty Buddy sessions open. They were closed afterward with `POST /api/session/end` (200 each). Another empty Buddy session was started and ended on purpose so the input and the Well Done screen could be checked. No chat message was sent in any of them. Do not close the older unended sessions. Those are why the live card still shows Counting to 20, grade K, 4 messages, score 0.

5. A cold Turbopack compile can take about 2 seconds. The topic card hides as soon as a button is clicked, before the API finishes. Wait for HTTP 200 and read Firestore again after the response. An early read that still shows `suggestedNextTopic` is the optimistic hide, not a failed save. Reject only clears the suggestion. It does not set `parentApproved` back to true.

6. On this machine, `POST /api/session/start` and `POST /api/session/end` once returned a Next.js HTML 404 while the route files existed and `/api/chat` returned 401. That was a stale Turbopack dev server, not a missing route. Restart `npm run dev` and re-check. Do not rewrite the route. Do not leave a `console.log` in a route file. The chat page still shows the input if start returns 404, because it falls back to a client session id. Confirm the network status is 200.

7. PowerShell on this Windows machine: use `;` between commands. `Invoke-WebRequest -SkipHttpErrorCheck` is not supported. Use `curl.exe` to see error status codes. Quote paths that contain `(parent)`.

8. ESLint `react-hooks/refs` forbids reading or writing a ref during render. Reset a click-lock ref inside `useEffect`. The pre-commit hook runs `npx tsc --noEmit`, `npx prettier --check src/`, and `npx eslint src/ --ext .ts,.tsx`. A docs-only commit still runs it. The new `src/components/ui/collapsible.tsx` was added with `npx shadcn@latest add collapsible` and then formatted with Prettier. Do not hand-edit files in `src/components/ui/`. Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.

9. Do not click "Yes, start this next" on this parent's Math path unless I ask. Approve changes `currentTopic` and appends Counting to 20 to `topicsCompleted`, which changes the easier-hint scores.
