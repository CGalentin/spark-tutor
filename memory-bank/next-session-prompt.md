# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 10 Oct 2026. Sprint 4, PR 2-27 is done. v2 is live at https://spark-tutor-app.vercel.app. `dev` was merged into `main` and `main` was pushed. It was not a force-push.

`git log --oneline` should contain the commit `chore: v2 phase 1 production deploy — AI intelligence layer live`, plus `dc0a074`, `c954c31`, and `9a71fcb`. Local `dev`, `origin/dev`, local `main`, and `origin/main` should match. If a branch is behind, diverged, or those commits are missing, stop and tell me. Do not force-push.

`feature/session-summary-v2` and `feature/rate-limiting-v2` are already contained in `dev`. Do not merge them again. Do not recreate them. Do not redo PR 2-25, PR 2-26, or the production deploy.

These files are dirty on purpose and must stay uncommitted: `AGENTS.md`, `CLAUDE.md`, `spark_tutor_build_bible_2.docx`.

## Where this session begins

PR 2-28 only. Do not deploy again unless I ask in that same message.

Leave the Shapes card alone. On 10 Oct 2026 I said to leave it. Do not click **Yes, start this next** or **Keep practicing current topic**. Do not ask again.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

Confirm local `dev` matches `origin/dev` and `origin/main`, and that `git log --oneline` contains the commit `chore: v2 phase 1 production deploy — AI intelligence layer live`, plus `dc0a074`, `c954c31`, and `9a71fcb`. If a branch is behind, diverged, or those commits are missing, stop and tell me. Do not force-push.

This is Sprint 4. Do PR 2-28 only. After 2-28, stop and wait.

Sprint 4 map

- 2-20 through 2-23 are done and are on `main`
- 2-24 session summary with mastery is on `main`
- 2-25 rate limits are on `main`. Do not redo them
- 2-26 final end-to-end test is on `main`. Do not redo the 6-message chat
- 2-27 production deploy is done. Live URL: https://spark-tutor-app.vercel.app. Do not deploy again
- 2-28 README + CLAUDE.md — start here

PR 2-28 · Update README and Portfolio Docs

Branch: `feature/readme-v2`.

Work through the PR 2-28 checklist in `ROADMAP-v2_1.md`.

1. Update `README.md` with a v2 architecture section, the portfolio talking points, Gemini Flash in the tech stack, and the live URL https://spark-tutor-app.vercel.app.
2. Update `CLAUDE.md` with v2 architecture notes.
3. `CLAUDE.md` already has uncommitted edits from before the deploy. Read that diff first. Do not throw those edits away. Do not commit `AGENTS.md` or `spark_tutor_build_bible_2.docx`.
4. Commit: `docs: update readme and claude.md for v2 phase 1 architecture`.
5. Update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop.

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path.

Do not close older unended sessions. One of them is why the live card still shows an open lesson after a session ends: Counting to 20, Kindergarten, 0 stars, 4 messages, score 0. Do not end the 26 Sep 2026 Blip session. It has 7 messages, Counting to 10, score 100, suggested next Counting to 20, and it still says the summary is generating.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." The 429 sentences are already in the routes. A live 429 could not be shown because Redis did not answer. Do not redo 2-25 to close that box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Three PR 2-26 boxes stay open on purpose: the dashboard does have an older open session, approve was not clicked, and reject was not clicked.

What production already proved

The live site is https://spark-tutor-app.vercel.app. A short visit on 10 Oct 2026 picked Blip, named Buddy, tapped Math, got `POST /api/session/start` 200 on Counting to 20, saw the chat input, sent no chat message, got `POST /api/session/end` 200, and saw "Great job today!". The dashboard still showed the Shapes card and the older open lesson. The 26 Sep session was not ended.

The earlier 2-26 test, already on `main`, proved the 6-message path: score 92, mastered, suggested next Shapes, live ring 92 / Mastered!, session card "92 · Mastered!", "Topic mastered", "Suggested next: Shapes", practice note "Learning about shapes".

I am newer to coding. Explain what each docs change does in plain language before you edit it.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Leave `AGENTS.md` and `spark_tutor_build_bible_2.docx` uncommitted.
