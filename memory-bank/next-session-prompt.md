# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. PR 3-07 is done on local `dev`. `POST /api/mcp/reading-quiz` is committed as `0c2980c` (`feat(mcp): add reading quiz generator mcp route — answers server-side only`). It is not deployed. https://spark-tutor-app.vercel.app still shows the eight character cards.

The answer note is `quiz_sessions/{sessionId}/activeQuiz/current`. Firestore needs the file name `current` because the plan's path ended on a folder. The note has `answers` (three numbers, each 0, 1, or 2), `expiresAt` (2 hours), and `parentUID`. The hint text is not stored. Client rules deny `quiz_sessions`.

A post with no token returned 401 before the body was read. One grade K quiz on Story comprehension returned a passage and 3 questions. The reply had no `correctIndex`. The Math path was unchanged. The 26 Sep Blip session is still open.

`origin/dev` is still `5706dfc`. `origin/main` is still `0f3a375`. Local `dev` is ahead of `origin/dev` because this session did not push. That is expected. Do not push to make them match.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md` (this is the plan). Read the Sprint 1 decisions, the PR 3-07 note, and PR 3-08

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Local `dev` should be ahead of `origin/dev` and should contain `0c2980c`. `origin/dev` should still be `5706dfc`. `origin/main` should be `0f3a375` and should contain `0b3db03` and `c0576bd`. `git log --oneline` should also contain `5706dfc`, `8e2732e`, `7d3cc98`, `87f36d5`, `44029d9`, `63800fa`, `84b81b1`, `a7cc3e3`, `6df4460`, `dc0a074`, `c954c31`, and `9a71fcb`. `dev` and `main` are not the same hash, because `main` has merge commits. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-08 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/mcp-quiz-verify`. Create that branch from local `dev`. Do not start PR 3-09. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28 or 3-01 through 3-07.

PR 3-08 · Quiz answer verification route

Build `POST /api/mcp/reading-quiz/verify`. Check the signed-in parent before reading the body. Add a rate limit of 60 per parent per hour, in its own bucket. Do not lower an existing cap. The route accepts a session id, a question index, and the choice the child picked. Read the correct choice from `quiz_sessions/{sessionId}/activeQuiz/current`. Confirm that note belongs to the same parent. If the expiry has passed, treat the note as missing. If the choice is right, reply with praise. If it is wrong, reply with a hint only. Never return which choice was correct. The hint text was not stored on the note in PR 3-07. The child already received a hint with the question. Delete the note after all 3 questions are answered. I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Commit only the files for this PR. Then update `memory-bank/activeContext.md`, `memory-bank/progress.md`, check off PR 3-08 in `ROADMAP-v2-phase2.md`, and refresh `memory-bank/next-session-prompt.md` so the next session starts at PR 3-09. Commit those notes separately. Merge the feature branch into local `dev`. Do not push. Do not merge to `main`.

Decisions already made. Do not undo them:

- Stella's voice prompt stays. Sample phrases are examples. "keep floating along" was enough.
- Do not run a six-message lesson to force a star. The chat celebrate check stays open.
- The name question still uses the character emoji, as in "What will you name your 🐻?". Leave that sentence.

Character facts already in the code:

- Bram: id `bram`, type `bear`, card `bg-amber-500` / `text-amber-800`, emoji 🐻, SVG in `BramAvatar.tsx`, `viewBox="0 0 120 120"`
- Stella: id `stella`, type `starfish`, card `bg-rose-400` / `text-rose-600`, emoji ⭐, SVG in `StellaAvatar.tsx`, same 120 viewBox
- The live avatars use 120, not the roadmap's 150. Keep it that way.
- `elevenlabsVoiceId` is `''` on all 8 characters

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path. Do not click "Yes, start this next" or "Keep practicing current topic". Do not close older unended sessions. Do not end the 26 Sep 2026 Blip session. It has 7 messages, Counting to 10, score 100, suggested next Counting to 20, and it still says the summary is generating.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo 2-25 to close that box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Three PR 2-26 boxes stay open on purpose. The Phase 1 "Zero ESLint warnings" box stays open. The PR 3-04 phone celebrate box stays open.

Live site: https://spark-tutor-app.vercel.app
