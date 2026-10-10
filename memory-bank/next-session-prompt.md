# Next session prompt — paste this into a new Cursor chat

PRs 2-01 through 2-22 are merged and pushed to `origin/dev`. PR 2-23 is committed on `feature/learning-path-history` and is not merged and not pushed (10 Oct 2026). Do not redo 2-01 through 2-23. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

On "continue": merge `feature/learning-path-history` into local `dev` first (fast-forward), then start PR 2-24 only. Stop after 2-24 and wait again. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-22 are complete and pushed to `origin/dev`. PR 2-23 is committed on `feature/learning-path-history` and is not on `dev` yet. Do not redo them. If local `dev` and `origin/dev` do not match before the merge, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. After the user says "continue": merge 2-23 into local `dev`, then start PR 2-24 only. After 2-24: stop, summarize, and wait before merging or starting 2-25.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — done and pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — committed, not merged, not pushed
- 2-24 Session summary includes mastery (`feature/session-summary-v2`) — start here after the 2-23 merge
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`)
- 2-26 Final end-to-end test on `dev`
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` into `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-23 is already built (do not redo)

`LearningPathHistory` is below session history. Math and Reading each listen with `useLearningPath`. The hook is not used to approve or reject here. Newest scores come first. The latest score on the current topic is marked In progress. Colors match the ring: red 0–49 Building, yellow 50–89 Almost there, green 90–100 Mastered! using `MASTERED_SCORE` (90).

The five newest stay on screen. "Show full history" appears only when that subject has more than five scores. This parent has three math scores, so that button is hidden. Hide Math and Hide Reading open and close each subject. Reading says "No reading topics yet."

Counting to 20 scores 40 and 30 share the timestamp `2026-09-26T17:56:08.773Z`. The timeline treats the later list entry as newer, so 30 is In progress and 40 is the earlier try. Counting to 10 is 100, Mastered, dated just before those two.

Browser check: Hide Math collapsed the scores and Show Math brought them back. Same for Reading. Child chat: Blip named Buddy, Math. Session start 200, the input was on screen, End session 200, "Great job today!" showed. No chat message was sent. Two earlier empty Buddy sessions were left open because End was clicked before the session id existed. Those two were then ended with `POST /api/session/end` (200). The older unended sessions were not closed. The learning path was not changed.

PR 2-24 · Session Summary v2

Branch: `feature/session-summary-v2` off local `dev` after 2-23 is merged.

Update `/src/lib/claude/buildSummaryPrompt.ts`:

- Add mastery evaluation data to the summary context
- Claude includes in the summary: topic mastered yes/no, score achieved, suggested focus for the next session

Update `SessionSummaryCard.tsx`:

- Mastery score badge, color coded red/yellow/green
- "Topic mastered" when score >= 90
- "Suggested next: [topic]" when a suggestion exists

- `npx tsc --noEmit`
- Commit: `feat(parent-ui): update session summary with mastery scores and topic suggestion`
- Check the parent dashboard in the browser: click the real control. Child chat must keep working.

What is already built (do not redo)

`TopicSuggestionCard` and `useLearningPath` are on the dashboard, above `LiveSessionPanel`, for math and for reading. The card shows only when `suggestedNextTopic` is set and `parentApproved` is false. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. The hook also returns `error` for a listener failure. It does not import `src/lib/firebase/learningPath.ts`.

The evaluator's short reason is not on the learning path document. The card finds it on the newest session evaluation whose `topic` is the current topic and whose `suggestedNext` is the suggestion. If none matches, the card says the evaluator did not leave a note.

`MasteryIndicator` takes `topic` and `score`. The ring does not subscribe to Firestore. `LiveSessionPanel` mounts it.

`useLiveSession` reuses `subscribeToSessions` and keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. Empty copy is "No active session".

This parent still has older sessions that were never ended. The live card therefore shows Counting to 20, grade K, 4 messages, score 0, until a newer open session exists. Do not close those old sessions unless asked.

Tutoring grade is `@/constants`: `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types`: `'K' | '1' | 'K-1'`. Never mix them.

`MASTERED_SCORE` is 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. `suggestedNextTopic` is null and `parentApproved` is true. Scores are Counting to 10: 100, then Counting to 20: 40 and 30. Those two share one timestamp; 30 is the later list entry. The next Math chat uses the **easier** hint until two higher scores are saved. Do not reset that path unless I ask. Reading has no learning path for this parent.

Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic`. Reject does not set `parentApproved` back to true.

Production is still the v1 app at https://spark-tutor-app.vercel.app. Do not run `vercel --prod` unless I ask.

I am newer to coding. Explain what each piece does as you build it, in plain language.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. For git commits, `git commit -m "message"` is fine.

Do not push unless I ask. Do not force-push.

Leave uncommitted `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` alone. Do not commit them.

Parent UI changes must be checked in the browser before you call the PR done. Child chat must keep working.

After the PR: update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop and wait.

Hard parts (do not rediscover these)

1. There is no Cursor browser tool here. Check the parent dashboard with playwright-core in `%TEMP%\spark-playwright`, not as a project dependency. Use `channel: 'chrome'`. Sign in with a Firebase Admin custom token and the Firebase 12.14.0 CDN client on the default app name, then reload `/dashboard`. Do not print the token or any `.env` value. Delete temp scripts before the commit. Set `NODE_PATH` to the temp install. `npx -p playwright-core` did not resolve.

2. Shadcn `CardTitle` is a `div`, not a heading. `getByRole('heading', { name: 'Learning path' })` will not find it. Use the visible text. "Counting to 20" appears twice in the timeline (scores 40 and 30), so a strict text lookup matches two nodes. "In progress" also appears in the card description. Match the badge with an exact text lookup, or read the first row.

3. The chat page shows "Say something..." as soon as Math is tapped, before `POST /api/session/start` returns. `handleEndSession` returns immediately while `sessionId` is still null, and no end request is sent. The session stays open. Wait for start status 200, then a short pause, then click End (accessible name "End session", visible text "All Done!"). Confirm end status 200 and the heading "Great job today!".

4. On 10 Oct 2026 that early End click left two empty Buddy sessions open. They were closed with `POST /api/session/end` (200 each). A third empty Buddy session was started and ended for the successful check. No chat message was sent. Do not close the older unended sessions. Those are why the live card still shows Counting to 20, grade K, 4 messages, score 0.

5. Do not click "Yes, start this next" on this path unless I ask. Approve would leave Counting to 20.

6. A cold Turbopack compile can make approve/reject look like they failed if Firestore is read too soon. Wait for HTTP 200. `POST /api/session/start` and `/api/session/end` once returned an HTML 404 while the routes existed. That was a stale dev server. Restart `npm run dev` and re-check. Do not leave a `console.log` in a route.

7. PowerShell: use `;` between commands. `Invoke-WebRequest -SkipHttpErrorCheck` is not supported. Use `curl.exe`.

8. ESLint `react-hooks/refs` forbids reading or writing a ref during render. The pre-commit hook runs `tsc`, `prettier --check src/`, and `eslint`. Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.
