# Next session prompt — paste this into a new Cursor chat

PR 2-24 is committed on `feature/session-summary-v2` (10 Oct 2026). It is not merged into `dev` and not pushed. Local `dev` still matches `origin/dev` at `75822ba`. Do not redo PRs 2-01 through 2-23. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

If the user says "continue": merge `feature/session-summary-v2` into local `dev` first (fast-forward, no force-push), then start PR 2-25 only. Stop after 2-25 and wait. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-23 are complete and pushed to `origin/dev`. PR 2-24 is committed on `feature/session-summary-v2` and is not merged. If I say "continue", merge that branch into local `dev` first, then start PR 2-25 only. If local `dev` and `origin/dev` do not both point at `75822ba` before that merge, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. After 2-25: stop, summarize, and wait for me to say "continue" before starting 2-26.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — done and pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — done and pushed
- 2-24 Session summary includes mastery (`feature/session-summary-v2`) — committed, not merged, not pushed
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`) — start here after the 2-24 merge
- 2-26 Final end-to-end test on `dev`
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` into `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-25 · Rate Limiting Update

Branch: `feature/rate-limiting-v2` off local `dev`, after `feature/session-summary-v2` is merged.

- Add a rate limit to `/api/evaluate` — max 60 per user per hour
- Add a rate limit to `/api/learning-path/approve` — max 20 per user per hour
- Add a rate limit to `/api/learning-path/reject` — max 20 per user per hour
- Each limited route returns 429 with a plain-English message
- `npx tsc --noEmit`
- Commit: `feat(api): add rate limiting to all v2 ai and learning path endpoints`
- Do not click "Yes, start this next" to test approve. A 401 without a token is enough to prove the route still exists. Do not burn the parent's real approve or reject.

What rate limiting does today (do not rediscover this)

`src/lib/upstash/ratelimit.ts` builds one Redis client. If `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` is missing, the client is null and every limiter stays null. That is fail-open: local dev without Upstash still works.

Existing limiters:

- `chatRatelimit` — 30 per user per sliding hour, prefix `rl:chat`, on `/api/chat`
- `summaryRatelimit` — 10 per user per sliding hour, prefix `rl:summary`, on `/api/summary`

Both routes check the limiter after the Firebase token is verified and before the expensive work. A null limiter is skipped. A thrown Upstash error is caught and the request continues. Do not change the chat or summary limits.

Add three new exports in that same file, same fail-open shape, separate prefixes (`rl:evaluate`, `rl:approve`, `rl:reject`). Wire each route the same way as `/api/summary`: after auth, before the body is parsed. 429 message is plain English for a parent. Evaluate can say the topic could not be scored right now. Approve and reject can say to wait before trying that action again.

What PR 2-24 already did (do not redo)

`POST /api/summary` passes `session.evaluations` into `buildSummaryPrompt`. The child client does not send scores. JSON keys are still only `topicsCovered`, `areasForPractice`, and `encouragementNote`. Claude is told mastered yes/no (score >= 90), the score, and a suggested focus. No evaluation tells Claude not to invent a score. The saved field is still `session.summary` plus `generatedAt`.

`SessionSummaryCard` reads the latest evaluation. The badge is `score · Building` (red, 0–49), `Almost there` (yellow, 50–89), or `Mastered!` (green, 90–100). "Topic mastered" shows at `MASTERED_SCORE` (90). "Suggested next: [topic]" shows when that evaluation's `suggestedNext` is a non-empty string. No evaluation is the plain line "No mastery score yet". Parent text on the card is 16px. Shadcn `Badge` is used. Do not edit `src/components/ui/`.

The only session document with an evaluation is the unended 26 Sep 2026 Blip session: 7 messages, Counting to 10, score 100, suggestedNext Counting to 20. Its card shows the green badge and still says "Summary generating" because it was never ended. Do not end it.

On 10 Oct 2026 an empty Math session named Buddy was started and ended with no chat message so the new card could be checked. It shows 0 messages, "No mastery score yet", and a short encouragement quote. Topic and practice lists on that summary are empty. The learning path was not reset.

What is already built (do not redo)

`LearningPathHistory` sits below session history. Math and Reading each listen with `useLearningPath`. Newest scores first. The latest score on the current topic is marked In progress. When two scores share a timestamp, the later entry in `masteryHistory` wins. Only the five newest stay visible. "Show full history" appears only when that subject has more than five scores. This parent has three, so that button is hidden. Hide Math and Hide Reading open and close each subject. Reading says "No reading topics yet."

`TopicSuggestionCard` sits above `LiveSessionPanel` for math and for reading. It shows only when `suggestedNextTopic` is set and `parentApproved` is false. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. The hook also returns `error`. It does not import `src/lib/firebase/learningPath.ts`. The evaluator note is looked up from the session evaluation whose `topic` is the current topic and whose `suggestedNext` is the suggestion. If none matches, the card says the evaluator did not leave a note.

`MasteryIndicator` takes `topic` and `score`. It does not subscribe to Firestore. `LiveSessionPanel` mounts it. `useLiveSession` keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. Empty copy is "No active session".

This parent still has older sessions that were never ended. The live card therefore shows an open session until a newer open session exists. Do not close those old sessions unless asked.

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

After the PR: update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop and wait.

Hard parts from the last sessions (do not rediscover these)

1. There is no Cursor browser tool in this workspace. Check the dashboard with playwright-core installed in `%TEMP%\spark-playwright`, not added to this repo. Use `channel: 'chrome'`. Sign in with a Firebase Admin custom token and the Firebase CDN client `12.14.0` (`firebase-app-compat.js` and `firebase-auth-compat.js`) on the default app name, so IndexedDB persistence matches the Next app, then reload `/dashboard`. Do not print the token or any `.env` value. Delete temp scripts before the commit. `npx -p playwright-core` did not resolve for a local script. Set `NODE_PATH` to the temp install and to this project's `node_modules`. `firebase-admin` resolves from this project's `node_modules`. Temp scripts must be `.cjs`. A `.mjs` file throws `require is not defined`. `page.goto` with `networkidle` never finishes on the dashboard because Firestore listeners stay open. Use `domcontentloaded`.

2. Shadcn `CardTitle` and `CardDescription` are `div`s, not headings. `getByRole('heading', { name: 'Learning path' })` does not find that card. The real heading on the dashboard is "Parent Dashboard". "Great job today!" on the child side is an `h1`, so a heading lookup works there. "Counting to 20" appears in the timeline and on the live card. Scope session cards to the `[data-slot="card"]` that contains "Recent Sessions". The mastered badge "100 · Mastered!" and the line "Topic mastered" belong to the unended Sep 26 Blip session.

3. The chat page sets the subject, and shows "Say something...", as soon as Math is tapped. `POST /api/session/start` may still be in flight. `handleEndSession` returns immediately while `sessionId` is still null, and no end request is sent. The session stays open, and the live card then shows that new empty session instead of the old one. Wait for start status 200, pause briefly so React can store the id, then click End. The button's visible text is "All Done!" and its accessible name is "End session". Confirm end status 200 and the heading "Great job today!". The subject picker comes before the input. Click Math before waiting for the placeholder.

4. Do not close the older unended sessions. One of them is why the live card still shows an open lesson. Another is the Sep 26 Blip session with the score 100 evaluation. Ending that one would finally generate its summary. Do not do that unless asked.

5. A cold Turbopack compile can take about 2 seconds. The topic card hides as soon as a button is clicked, before the API finishes. Wait for HTTP 200 and read Firestore again after the response. An early read that still shows `suggestedNextTopic` is the optimistic hide, not a failed save. Reject only clears the suggestion. It does not set `parentApproved` back to true.

6. On this machine, `POST /api/session/start` and `POST /api/session/end` once returned a Next.js HTML 404 while the route files existed and `/api/chat` returned 401. That was a stale Turbopack dev server, not a missing route. Restart `npm run dev` and re-check. Do not rewrite the route. Do not leave a `console.log` in a route file. The chat page still shows the input if start returns 404, because it falls back to a client session id. Confirm the network status is 200. Port 3000 may already be taken by a healthy `next dev`. A second `npm run dev` exits. If `POST /api/session/start` returns 401 with no token, the route is there. Do not kill that process.

7. PowerShell on this Windows machine: use `;` between commands. `Invoke-WebRequest -SkipHttpErrorCheck` is not supported. Use `curl.exe` to see error status codes. Quote paths that contain `(parent)`.

8. ESLint `react-hooks/refs` forbids reading or writing a ref during render. Reset a click-lock ref inside `useEffect`. The pre-commit hook runs `npx tsc --noEmit`, `npx prettier --check src/`, and `npx eslint src/ --ext .ts,.tsx`. A docs-only commit still runs it. Do not hand-edit files in `src/components/ui/`. Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.

9. Do not click "Yes, start this next" on this parent's Math path unless I ask. Approve changes `currentTopic` and appends Counting to 20 to `topicsCompleted`, which changes the easier-hint scores.
