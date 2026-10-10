# Next session prompt — paste this into a new Cursor chat

PR 2-24 is merged into local `dev` (10 Oct 2026) and is not pushed. `origin/dev` is still `75822ba`. Local `dev` should be ahead of `origin/dev`, not behind it and not diverged. If it is not, stop and tell me. Do not redo PRs 2-01 through 2-24. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

Next session starts at PR 2-25 only. Stop after 2-25 and wait. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-23 are complete and pushed to `origin/dev`. PR 2-24 is merged into local `dev` and is not pushed. `origin/dev` is still `75822ba`. Local `dev` should be ahead of that commit. If it is behind, diverged, or missing the session-summary commits, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. Start with PR 2-25 only. After 2-25: stop, summarize, and wait for me to say "continue" before starting 2-26.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — done and pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — done and pushed
- 2-24 Session summary includes mastery (`feature/session-summary-v2`) — merged into local `dev`, not pushed
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`) — start here
- 2-26 Final end-to-end test on `dev`
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` into `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-25 · Rate Limiting Update

Branch: `feature/rate-limiting-v2` off local `dev`.

Add a rate limit to these three routes. Do not change the existing chat limit (30/hour) or summary limit (10/hour).

- `/api/evaluate` — max 60 per user per hour. This fires often, once per topic block.
- `/api/learning-path/approve` — max 20 per user per hour
- `/api/learning-path/reject` — max 20 per user per hour
- Each one returns HTTP 429 with a plain-English message when the limit is hit
- `npx tsc --noEmit`
- Commit: `feat(api): add rate limiting to all v2 ai and learning path endpoints`

How rate limiting works today (do not rediscover this)

`src/lib/upstash/ratelimit.ts` builds one Redis client. If `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` is missing or empty, the client is null and every limiter stays null. Null means fail-open: the route skips the check and the request continues. That is how local dev survives a missing Redis setup.

Existing limiters, already wired:

- `chatRatelimit` — sliding window, 30 per user per hour, prefix `rl:chat`, used by `/api/chat`
- `summaryRatelimit` — sliding window, 10 per user per hour, prefix `rl:summary`, used by `/api/summary`

The check sits after `verifyAuthToken` and before the request body is parsed. Copy that shape. Do not rate-limit an anonymous caller, because the limit key is the parent UID from the token.

```ts
if (summaryRatelimit !== null) {
  try {
    const { success } = await summaryRatelimit.limit(parentUID);
    if (!success) {
      return Response.json(
        { success: false, error: 'Too many summary requests. Please wait before ending another session.' },
        { status: 429 },
      );
    }
  } catch {
    // Bad Upstash credentials — fail open, do not block the parent
  }
}
```

Chat's 429 is written for a child: "You've sent a lot of messages today! Take a short break and try again in a little while." Evaluate, approve, and reject are parent-facing, so use plain English like the summary message. Suggested wording, you may tighten it:

- evaluate: "Too many mastery checks. Please wait a bit before the next one."
- approve: "Too many topic approvals. Please wait before starting another topic."
- reject: "Too many topic updates. Please wait before trying that again."

Add three exports next to the existing ones. Same fail-open shape. Separate prefixes so the counters do not share a bucket: `rl:evaluate`, `rl:approve`, `rl:reject`. Use `Ratelimit.slidingWindow(60, '1 h')` and `Ratelimit.slidingWindow(20, '1 h')`.

Where to insert the check:

- `src/app/api/evaluate/route.ts` — after the auth block (step 1) and before "Parse and validate request body" (step 2). The Gemini call is later. Stopping here saves that call.
- `src/app/api/learning-path/approve/route.ts` — same place, after auth, before the body parse.
- `src/app/api/learning-path/reject/route.ts` — same place, after auth, before the body parse.

Upstash is configured in `.env.local` on this machine, so the limiters will not be null locally. Do not print the URL or token. Do not delete or edit `.env.local`.

How to prove the limit without clicking Approve

Do not click **Yes, start this next**. Approve would leave Counting to 20 and append it to `topicsCompleted`, which changes the easier-hint scores (40 and 30).

A request with no token should still be 401, and it must not consume the limit, because the check runs only after a real parent UID. Use `curl.exe` (PowerShell `Invoke-WebRequest -SkipHttpErrorCheck` is not supported):

- `POST /api/evaluate` with no Authorization header → 401
- `POST /api/learning-path/approve` with no Authorization header → 401
- `POST /api/learning-path/reject` with no Authorization header → 401

If any of those return an HTML 404 while the route file exists, the dev server is stale. Restart `npm run dev` and re-check. Do not rewrite the route. Do not leave a `console.log` in a route file. Port 3000 may already be taken. A second `npm run dev` exits. If the POST returns 401, the route is there. Do not kill that process.

Do not lower the cap in committed code just to see a 429. Do not send 60 real `/api/evaluate` calls: each one calls Gemini and writes a score. If you need to see the 429 body, call `evaluateRatelimit.limit(uid)` in a temp script outside the repo, then delete the script. Do not print the Redis token. That loop fills the parent's evaluate bucket for about an hour. Say so in the summary. Do not fill the approve or reject buckets. A real approve changes the learning path.

Child chat must still work after the route edits. One empty Math session is enough: Blip, name Buddy, tap Math, wait for `POST /api/session/start` status 200, confirm "Say something...", click End (accessible name "End session"), confirm end status 200 and the heading "Great job today!". Do not send a chat message. Do not close older unended sessions.

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

The only session document with an evaluation is the unended 26 Sep 2026 session named Blip: 7 messages, topic Counting to 10, score 100, `suggestedNext` Counting to 20. Its card shows the green badge, "Topic mastered", and "Suggested next: Counting to 20", and it still says "Summary generating — check back in a moment…" because that session was never ended. Do not end it.

On 10 Oct 2026 an empty Math session named Buddy was started and ended with no chat message so the new card could be checked. It shows 0 messages, "No mastery score yet", and a short encouragement quote. Its topic and practice lists are empty. Several older empty Buddy sessions from the same day also have no evaluations. Their cards should still say "No mastery score yet".

What is already built (do not redo)

`LearningPathHistory` sits below session history. Math and Reading each listen with `useLearningPath`. Newest scores first. The latest score on the current topic is marked In progress. When two scores share a timestamp, the later entry in `masteryHistory` wins. Only the five newest stay visible. "Show full history" appears only when that subject has more than five scores. This parent has three, so that button is hidden. Hide Math and Hide Reading open and close each subject. Reading says "No reading topics yet."

`TopicSuggestionCard` sits above `LiveSessionPanel` for math and for reading. It shows only when `suggestedNextTopic` is set and `parentApproved` is false. Right now the math suggestion is null and `parentApproved` is true, so the card is hidden. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. The hook also returns `error`. It does not import `src/lib/firebase/learningPath.ts`. The evaluator note is looked up from the session evaluation whose `topic` is the current topic and whose `suggestedNext` is the suggestion. If none matches, the card says the evaluator did not leave a note.

`MasteryIndicator` takes `topic` and `score`. It does not subscribe to Firestore. `LiveSessionPanel` mounts it. `useLiveSession` keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. Empty copy is "No active session". The ring's 0 is not the same as the session card. The live ring uses 0 before the first score. The session card must not.

This parent still has older sessions that were never ended. The live card therefore shows an open session (Counting to 20, grade K, messages, score 0) until a newer open session exists. Do not close those old sessions unless asked. The Sep 26 Blip session with score 100 is also unended. Do not close that one either.

Tutoring grade is `@/constants` (`src/constants/gradeBands.ts`): `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types` (`src/types/rag.ts`): `'K' | '1' | 'K-1'`. Never mix them. `@/types` re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

`MASTERED_SCORE` is 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

Firestore learning path: `users/{parentUID}/learningPath/{subject}`. Admin CRUD is `src/lib/firebase/learningPath.ts`. Never import that file from a Client Component. Live reads: `subscribeToLearningPath` in `src/lib/firebase/firestore.ts`. It casts `snap.data()` as `LearningPath` and does not fill missing fields.

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. `suggestedNextTopic` is null and `parentApproved` is true. History, in saved order:

- Counting to 10, score 100, mastered, `2026-09-26T17:55:51.558Z`
- Counting to 20, score 40, not mastered, `2026-09-26T17:56:08.773Z`
- Counting to 20, score 30, not mastered, same timestamp as the 40

The 40 and 30 share one timestamp. The later list entry is 30, so the timeline marks 30 as In progress. The next Math chat uses the **easier** hint until two higher scores on Counting to 20 are saved. Do not reset that path unless I ask. Reading has no learning path for this parent.

Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic`. Reject does not set `parentApproved` back to true. Do not click **Yes, start this next** unless I ask.

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
