# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it. The chat that finished PR 2-26 was told to stop and wait.

## Where the last session stopped

Date: 10 Oct 2026. Sprint 4, PR 2-26 was tested on local `dev`. PR 2-27 was not started.

`origin/dev` is still `75822ba` (`docs: point the next session at PR 2-24 after pushing PR 2-23`).

Local `dev` is a straight fast-forward ahead of that commit. Nothing was pushed. Do not push unless asked. Do not force-push. Do not merge to `main`. Do not run `vercel --prod`.

Commits on local `dev` that are not on `origin/dev`, oldest first:

1. `9a71fcb` feat(parent-ui): update session summary with mastery scores and topic suggestion
2. `0e1755d` docs: check off PR 2-24 and update memory bank
3. `261ae80` docs: record PR 2-24 merge into local dev and point the next session at PR 2-25
4. `c954c31` feat(api): add rate limiting to all v2 ai and learning path endpoints
5. `2cda498` docs: check off PR 2-25 and point the next session at PR 2-26
6. `3a94214` docs: record the PR 2-25 stop point for the next session
7. The test commit that saved this prompt: `test: final v2 phase 1 end-to-end test pass`

If local `dev` is behind `75822ba`, diverged from it, or missing `9a71fcb` or `c954c31`, stop and tell me. Do not merge `feature/rate-limiting-v2` again. Do not recreate it.

These files were dirty on purpose and must stay uncommitted: `AGENTS.md`, `CLAUDE.md`, `spark_tutor_build_bible_2.docx`.

## Where the next session begins

Do not redo PR 2-26. Do not send another 6-message Math chat unless I ask. That test already called Gemini and saved a score.

Do not start PR 2-27 unless I explicitly say to deploy. PR 2-27 is `vercel --prod`, then merge `dev` into `main`. Do not start PR 2-28.

The suggestion card is on the parent dashboard. Suggested next is **Shapes**. Do not click **Yes, start this next** unless I ask in that message. Do not click **Keep practicing current topic** unless I ask in that message. Do not seed a different suggestion.

One roadmap checkbox from PR 2-25 is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo PR 2-25 to close it. Do not lower a cap. Do not fill a rate-limit bucket.

Three PR 2-26 boxes are still open on purpose:

- "Dashboard shows no active session" is false. An older session was never ended.
- "Approve topic from dashboard" was not clicked.
- "Test reject flow" was not clicked, because reject would clear the real Shapes suggestion.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

Confirm `git log --oneline origin/dev..HEAD` is a straight fast-forward from `75822ba` and includes `9a71fcb`, `c954c31`, and a commit whose message is `test: final v2 phase 1 end-to-end test pass`. If `dev` is behind, diverged, or those commits are missing, stop and tell me. Do not force-push. Do not push unless I ask.

PR 2-26 already ran. Do not repeat it. Wait for my instruction.

If I explicitly say to deploy, that is PR 2-27 only. Do not start PR 2-28 in the same step.

If I explicitly say to approve the suggestion, click **Yes, start this next** once, then tell me the new current topic. Approve appends Counting to 20 to `topicsCompleted` and does not change `currentGrade`.

If I explicitly say to reject the suggestion, click **Keep practicing current topic** once. Reject only clears `suggestedNextTopic`. It does not set `parentApproved` back to true. Current topic stays Counting to 20.

If I do not mention approve, reject, or deploy, stop and ask. Do not choose for me.

What the 2-26 test changed

On 10 Oct 2026 a child session used Blip, the name Buddy, and Math. `POST /api/session/start` returned 200. Topic was Counting to 20, grade K, difficulty hint easier. Six chats each returned 200. `POST /api/evaluate` returned 200 and saved score **92**, mastered, confidence high, suggested next **Shapes**. `POST /api/session/end` returned 200. The heading "Great job today!" showed.

The live ring updated during that open session from 0 / Building to 92 / Mastered!. The new session card shows "92 · Mastered!", "Topic mastered", "Suggested next: Shapes", and a summary. The practice note is "Learning about shapes". The encouragement note mentions the score 92.

The learning path `users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math` is still on Counting to 20, grade K. `topicsCompleted` is still only Counting to 10. `suggestedNextTopic` is Shapes. `parentApproved` is false. History, in saved order:

- Counting to 10, score 100, mastered, `2026-09-26T17:55:51.558Z`
- Counting to 20, score 40, not mastered, `2026-09-26T17:56:08.773Z`
- Counting to 20, score 30, not mastered, same timestamp as the 40
- Counting to 20, score 92, mastered, `2026-10-10T23:03:46.508Z`

The last two scores on Counting to 20 are 30 and 92, so the next Math chat uses the **normal** hint. The easier hint was already confirmed in the test session, before this 92 was saved. Do not reset the path.

The timeline shows 92 at the top and does not mark that row In progress. That badge is only added when the latest score on the current topic is under 90. There are four scores, so "Show full history" stays hidden. Reading has no learning path.

After the test session ended, the live card returned to an older open lesson: Counting to 20, Kindergarten, 0 stars, 4 messages, score 0, with the line about the score showing up after a topic block. Do not close that session. Do not end the unended 26 Sep 2026 Blip session (7 messages, Counting to 10, score 100, suggested next Counting to 20, summary still generating).

What not to redo

PR 2-25 rate limits are in `src/lib/upstash/ratelimit.ts`. Missing Upstash env vars, or a Redis error, fail open. Chat is 30/hour. Summary is 10/hour. Evaluate is 60/hour (`rl:evaluate`). Approve is 20/hour (`rl:approve`). Reject is 20/hour (`rl:reject`). The check is after `verifyAuthToken` and before the body is parsed. A live 429 was not shown because Redis did not answer. Do not print the Redis URL or token. Do not edit `.env.local`.

PR 2-24 summary behavior is unchanged. The card reads `session.evaluations`. No evaluation shows "No mastery score yet". Do not edit `src/components/ui/`.

Tutoring grade is `@/constants` (`'K' | '1' | '2' | '3'`). RAG grade is `@/types` (`'K' | '1' | 'K-1'`). Never mix them. `MASTERED_SCORE` is 90.

Port 3000 was already serving `next dev` during the test. Leave a healthy server running. A second `npm run dev` exits. `POST /api/session/start` with no token returned 401 JSON, not an HTML 404.

I am newer to coding. Explain what each step does in plain language.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.
