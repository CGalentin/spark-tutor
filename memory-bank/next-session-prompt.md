# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 10 Oct 2026. Sprint 4, PR 2-26 is done and pushed to `origin/dev`. PR 2-27 was not started. Production was not deployed. `main` was not updated.

Local `dev` and `origin/dev` should match. `git status -sb` should show `dev...origin/dev` with no ahead or behind. The test commit is `dc0a074` (`test: final v2 phase 1 end-to-end test pass`). The tip commit records leaving the Shapes card and points this session at the deploy.

`feature/session-summary-v2` and `feature/rate-limiting-v2` are already contained in `dev`. Do not merge them again. Do not recreate them.

If `dev` is behind `origin/dev`, diverged, or missing `9a71fcb`, `c954c31`, or `dc0a074`, stop and tell me. Do not force-push.

These files are dirty on purpose and must stay uncommitted: `AGENTS.md`, `CLAUDE.md`, `spark_tutor_build_bible_2.docx`.

## Where this session begins

PR 2-27 only. This message is the go-ahead to deploy. Do not start PR 2-28 in this same session.

Leave the Shapes card alone. On 10 Oct 2026 I said to leave it. Do not click **Yes, start this next** or **Keep practicing current topic**. Do not ask again.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

Confirm local `dev` matches `origin/dev`, and that `git log --oneline` contains `dc0a074`, `c954c31`, and `9a71fcb`. If `dev` is behind, diverged, or those commits are missing, stop and tell me. Do not force-push.

This is Sprint 4. Do PR 2-27 only. I am explicitly saying to deploy. After 2-27, stop and wait. Do not start PR 2-28 unless I ask in that same message.

Sprint 4 map

- 2-20 through 2-23 are done and were already on `origin/dev`
- 2-24 session summary with mastery is on `origin/dev`
- 2-25 rate limits are on `origin/dev`. Do not redo them
- 2-26 final end-to-end test is on `origin/dev`. Do not redo the 6-message chat
- 2-27 production deploy — start here
- 2-28 README + CLAUDE.md — do not start this session

PR 2-27 · v2 Production Deploy

Branch: `main`.

Work through the PR 2-27 checklist in `ROADMAP-v2_1.md`.

1. Confirm whether any environment variable names were added after the current Vercel project settings. Do not print values. The rate-limit work reused the existing Upstash variables. Do not edit `.env.local`.
2. Run `npm run build` and confirm zero errors.
3. Run `vercel --prod`.
4. Smoke test the live URL with a short child flow and a look at the parent dashboard. Do not send another 6-message Math chat. Do not click the Shapes card.
5. Merge `dev` into `main`. Push `main`. Do not force-push.
6. Commit on the result: `chore: v2 phase 1 production deploy — AI intelligence layer live`.
7. Update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md` so the next session starts at PR 2-28. Then stop.

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path.

Do not close older unended sessions. One of them is why the live card still shows an open lesson after the test session ended: Counting to 20, Kindergarten, 0 stars, 4 messages, score 0. Do not end the 26 Sep 2026 Blip session. It has 7 messages, Counting to 10, score 100, suggested next Counting to 20, and it still says the summary is generating.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." The 429 sentences are already in the routes. A live 429 could not be shown because Redis did not answer. Do not redo 2-25 to close that box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Three PR 2-26 boxes stay open on purpose: the dashboard does have an older open session, approve was not clicked, and reject was not clicked.

What the 2-26 test already proved

Blip, name Buddy, tap Math, `POST /api/session/start` 200, six chats each 200, `POST /api/evaluate` 200, saved score 92, mastered, suggested next Shapes. The live ring changed from 0 / Building to 92 / Mastered! while the session was open. `POST /api/session/end` 200 and the heading "Great job today!" showed. The session card shows "92 · Mastered!", "Topic mastered", "Suggested next: Shapes", and a summary whose practice note is "Learning about shapes".

I am newer to coding. Explain what each deploy step does in plain language before you run it, and tell me the live URL when it is done.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Leave `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` uncommitted.
