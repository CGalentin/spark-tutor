# Next session prompt — paste this into a new Cursor chat

PR 2-25 is merged into local `dev` (10 Oct 2026) and is not pushed. `origin/dev` is still `75822ba`. Local `dev` is ahead of that commit (PR 2-24 plus PR 2-25). If it is behind, diverged, or missing those commits, stop and tell me. Do not redo PRs 2-01 through 2-25. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

Next session starts at PR 2-26 only. Stop after 2-26 and wait. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-23 are complete and pushed to `origin/dev`. PRs 2-24 and 2-25 are merged into local `dev` and are not pushed. `origin/dev` is still `75822ba`. Local `dev` should be ahead of that commit. If it is behind, diverged, or missing the session-summary or rate-limit commits, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. Do one PR at a time. Start with PR 2-26 only. After 2-26: stop, summarize, and wait. Do not start 2-27 unless I explicitly say to deploy.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — done and pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — done and pushed
- 2-24 Session summary includes mastery (`feature/session-summary-v2`) — merged into local `dev`, not pushed
- 2-25 Rate limits (`feature/rate-limiting-v2`) — merged into local `dev`, not pushed
- 2-26 Final end-to-end test on `dev` — start here
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` into `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-26 · Final v2 End-to-End Test

Branch: `dev` (no feature branch).

Work through the checklist in ROADMAP-v2_1.md for PR 2-26. `npx tsc --noEmit` and `npm run build`. Commit: `test: final v2 phase 1 end-to-end test pass`.

The roadmap says the dashboard shows no active session. This parent still has older sessions that were never ended, so the live card shows an open lesson. Do not close those sessions. Report that, and do not treat it as a failure of the live card.

Do not click **Yes, start this next** unless I ask in this message. Approve changes `currentTopic` and appends Counting to 20 to `topicsCompleted`, which changes the easier-hint scores (40 and 30). The suggestion card is hidden because `suggestedNextTopic` is null. Do not seed a suggestion just to click Approve. If the checklist reaches the approve step, stop and ask me first.

A 6-message Math chat will call `/api/evaluate`, call Gemini, and write a new score. Do that only as part of this test, and say what score was saved. Do not reset the learning path.

What PR 2-25 already did (do not redo)

`src/lib/upstash/ratelimit.ts` still builds one Redis client. Missing or empty Upstash env vars leave every limiter null, and null means fail-open. A thrown Redis error also fail-opens. Do not change the chat limit (30/hour, `rl:chat`) or the summary limit (10/hour, `rl:summary`).

New limiters, already wired after `verifyAuthToken` and before the body is parsed:

- `evaluateRatelimit` — sliding window, 60 per parent per hour, prefix `rl:evaluate`, on `/api/evaluate`
- `approveRatelimit` — sliding window, 20 per parent per hour, prefix `rl:approve`, on `/api/learning-path/approve`
- `rejectRatelimit` — sliding window, 20 per parent per hour, prefix `rl:reject`, on `/api/learning-path/reject`

429 text, already in the routes:

- evaluate: "Too many mastery checks. Please wait a bit before the next one."
- approve: "Too many topic approvals. Please wait before starting another topic."
- reject: "Too many topic updates. Please wait before trying that again."

A request with no token is 401 and does not consume a bucket. That was checked with `curl.exe` on 10 Oct 2026: all three posts returned 401 JSON.

A live 429 was not observed. The Redis host in `.env.local` does not resolve (`ENOTFOUND`), and the stored token is only 8 characters, so the limiter throws and the route lets the request through. The parent's evaluate, approve, and reject buckets were not filled. Do not print the URL or token. Do not edit `.env.local`. Do not lower a cap to force a 429. Do not send 60 real `/api/evaluate` calls.

What PR 2-24 already did (do not redo)

`POST /api/summary` passes `session.evaluations` into `buildSummaryPrompt`. The child client does not send scores. JSON keys are still only `topicsCovered`, `areasForPractice`, and `encouragementNote`. Claude is told mastered yes/no (yes when the score is >= 90), the score achieved, and a suggested focus for the next session. The suggested focus goes in `areasForPractice`. Mastered yes/no and the score go in `encouragementNote`. No evaluation tells Claude not to invent a score. A bad Claude reply still falls back to a generic practice note. The saved field is still `session.summary` (nested, not a subcollection) plus `generatedAt`.

`SessionSummaryCard` reads the latest entry in `session.evaluations`. It does not read the score out of Claude's JSON.

- Badge text is `{score} · Building`, `{score} · Almost there`, or `{score} · Mastered!`
- Red 0–49 Building, yellow 50–89 Almost there, green 90–100 Mastered!
- Green starts at `MASTERED_SCORE` (90), not at the evaluator's close band (71)
- "Topic mastered" only when the score is >= 90
- "Suggested next: [topic]" only when that same evaluation's `suggestedNext` is a non-empty string
- No evaluation shows the plain line "No mastery score yet". Do not paint that as 0 / Building. A real 0 means the evaluator ran and scored zero
- Parent text on this card is 16px (`text-base`). Shadcn `Badge` is used. Do not edit files in `src/components/ui/`

The only session document with an evaluation, before this test, is the unended 26 Sep 2026 session named Blip: 7 messages, topic Counting to 10, score 100, `suggestedNext` Counting to 20. Its card shows the green badge, "Topic mastered", and "Suggested next: Counting to 20", and it still says "Summary generating — check back in a moment…" because that session was never ended. Do not end it.

On 10 Oct 2026 an empty Math session named Buddy was started and ended with no chat message so the summary card could be checked. Another empty Math session named Buddy was started and ended the same day while checking the rate-limit routes. Both show 0 messages and "No mastery score yet" once the summary arrives. Do not end the older unended sessions.

What is already built (do not redo)

`LearningPathHistory` sits below session history. Math and Reading each listen with `useLearningPath`. Newest scores first. The latest score on the current topic is marked In progress. When two scores share a timestamp, the later entry in `masteryHistory` wins. Only the five newest stay visible. "Show full history" appears only when that subject has more than five scores. This parent has three, so that button is hidden. Hide Math and Hide Reading open and close each subject. Reading says "No reading topics yet."

`TopicSuggestionCard` sits above `LiveSessionPanel` for math and for reading. It shows only when `suggestedNextTopic` is set and `parentApproved` is false. Right now the math suggestion is null and `parentApproved` is true, so the card is hidden. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. The hook also returns `error`. It does not import `src/lib/firebase/learningPath.ts`. The evaluator note is looked up from the session evaluation whose `topic` is the current topic and whose `suggestedNext` is the suggestion. If none matches, the card says the evaluator did not leave a note.

`MasteryIndicator` takes `topic` and `score`. It does not subscribe to Firestore. `LiveSessionPanel` mounts it. `useLiveSession` keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. Empty copy is "No active session". The ring's 0 is not the same as the session card. The live ring uses 0 before the first score. The session card must not.

This parent still has older sessions that were never ended. The live card therefore shows an open session (Counting to 20, grade K, messages, score 0) until a newer open session exists. Do not close those old sessions unless asked. The Sep 26 Blip session with score 100 is also unended. Do not close that one either.

Tutoring grade is `@/constants` (`src/constants/gradeBands.ts`): `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types` (`src/types/rag.ts`): `'K' | '1' | 'K-1'`. Never mix them. `@/types` re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

`MASTERED_SCORE` is 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

Firestore learning path: `users/{parentUID}/learningPath/{subject}`. Admin CRUD is `src/lib/firebase/learningPath.ts`. Never import that file from a Client Component. Live reads: `subscribeToLearningPath` in `src/lib/firebase/firestore.ts`. It casts `snap.data()` as `LearningPath` and does not fill missing fields.

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. `suggestedNextTopic` is null and `parentApproved` is true. History, in saved order, before this test:

- Counting to 10, score 100, mastered, `2026-09-26T17:55:51.558Z`
- Counting to 20, score 40, not mastered, `2026-09-26T17:56:08.773Z`
- Counting to 20, score 30, not mastered, same timestamp as the 40

The 40 and 30 share one timestamp. The later list entry is 30, so the timeline marks 30 as In progress. The next Math chat uses the **easier** hint until two higher scores on Counting to 20 are saved. Do not reset that path unless I ask. Reading has no learning path for this parent.

Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic`. Reject does not set `parentApproved` back to true.

Production is still the v1 app at https://spark-tutor-app.vercel.app. Do not run `vercel --prod` unless I ask.

I am newer to coding. Explain what each piece does as you build it, in plain language.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. For git commits, `git commit -m "message"` is fine.

Do not push unless I ask. Do not force-push.

Leave uncommitted `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` alone. Do not commit them.

After the PR: update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop and wait.

Hard parts from the last sessions (do not rediscover these)

1. There is no Cursor browser tool in this workspace. Check the dashboard with playwright-core installed in `%TEMP%\spark-playwright`, not added to this repo. Use `channel: 'chrome'`. Sign in with a Firebase Admin custom token and the Firebase CDN client `12.14.0` (`firebase-app-compat.js` and `firebase-auth-compat.js`) on the default app name, so IndexedDB persistence matches the Next app, then reload `/dashboard`. Do not print the token or any `.env` value. Delete temp scripts before the commit. `npx -p playwright-core` did not resolve for a local script. Set `NODE_PATH` to the temp install and to this project's `node_modules`. `firebase-admin` resolves from this project's `node_modules`. Temp scripts must be `.cjs`. A `.mjs` file throws `require is not defined`. `page.goto` with `networkidle` never finishes on the dashboard because Firestore listeners stay open. Use `domcontentloaded`.

2. Shadcn `CardTitle` and `CardDescription` are `div`s, not headings. `getByRole('heading', { name: 'Learning path' })` does not find that card. The real heading on the dashboard is "Parent Dashboard". "Great job today!" on the child side is an `h1`, so a heading lookup works there. "Counting to 20" appears in the timeline and on the live card. "In progress" also appears in the card description, so use exact text for the badge. Scope session cards to the `[data-slot="card"]` that contains the text "Recent Sessions". Scope learning-path lookups to the card that contains "Learning path". The mastered badge "100 · Mastered!" and the line "Topic mastered" belong to the unended Sep 26 Blip session inside Recent Sessions.

3. The chat page sets the subject, and shows "Say something...", as soon as Math is tapped. `POST /api/session/start` may still be in flight. `handleEndSession` returns immediately while `sessionId` is still null, and no end request is sent. The session stays open, and the live card then shows that new empty session instead of the old one. Wait for start status 200, pause briefly so React can store the id, then click End. The button's visible text is "All Done!" and its accessible name is "End session". Confirm end status 200 and the heading "Great job today!". The subject picker comes before the input. Click Math before waiting for the placeholder.

4. Do not close the older unended sessions. One of them is why the live card still shows an open lesson. Another is the Sep 26 Blip session with the score 100 evaluation. Ending that one would finally generate its summary. Do not do that unless asked. The 10 Oct empty Buddy sessions belong in history with a summary and no mastery score.

5. A cold Turbopack compile can take about 2 seconds. The topic card hides as soon as a button is clicked, before the API finishes. Wait for HTTP 200 and read Firestore again after the response. An early read that still shows `suggestedNextTopic` is the optimistic hide, not a failed save. Reject only clears the suggestion. It does not set `parentApproved` back to true.

6. On this machine, `POST /api/session/start` and `POST /api/session/end` once returned a Next.js HTML 404 while the route files existed and `/api/chat` returned 401. That was a stale Turbopack dev server, not a missing route. Restart `npm run dev` and re-check. Do not rewrite the route. Do not leave a `console.log` in the route. The chat page still shows the input if start returns 404, because it falls back to a client session id. Confirm the network status is 200. Port 3000 may already be taken by a healthy `next dev`. A second `npm run dev` exits. If `POST /api/session/start` returns 401 with no token, the route is there. Do not kill that process.

7. PowerShell on this Windows machine: use `;` between commands. `Invoke-WebRequest -SkipHttpErrorCheck` is not supported. Use `curl.exe` to see error status codes. Quote paths that contain `(parent)`.

8. ESLint `react-hooks/refs` forbids reading or writing a ref during render. Reset a click-lock ref inside `useEffect`. The pre-commit hook runs `npx tsc --noEmit`, `npx prettier --check src/`, and `npx eslint src/ --ext .ts,.tsx`. A docs-only commit still runs it. Do not hand-edit files in `src/components/ui/`. Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.

9. Do not click "Yes, start this next" on this parent's Math path unless I ask. Approve changes `currentTopic` and appends Counting to 20 to `topicsCompleted`, which changes the easier-hint scores. The suggestion card is hidden right now because `suggestedNextTopic` is null. Do not seed a suggestion just to click Approve.
