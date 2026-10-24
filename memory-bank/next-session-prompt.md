# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. PR 3-09 is done. Nothing was deployed. Nothing was pushed.

- `origin/dev` is still `d4d332c`
- `origin/main` is still `0f3a375`
- `dev` and `main` are not the same hash, because `main` has merge commits
- Local `dev` contains `c10a43c` (`feat(mcp): add spelling practice mcp route — words stored server-side only`)
- The notes commit on top of `c10a43c` checks off PR 3-09 and points this prompt at PR 3-10. That commit is local only
- `POST /api/mcp/spelling` and `POST /api/mcp/spelling/verify` are `c10a43c`
- Live site https://spark-tutor-app.vercel.app still shows the eight character cards. The quiz and spelling routes are not on production.

The spelling note is `quiz_sessions/{sessionId}/activeSpelling/current`. It holds `words`, `hints`, `expiresAt` (2 hours), and `parentUID`. A new list replaces that note. A wrong try returns a hint and can be tried again. The note is not deleted. The spelling is never in the reply. Do not redo that.

The reading-quiz note is still `quiz_sessions/{sessionId}/activeQuiz/current`. Do not redo PR 3-07 or PR 3-08.

The Math path was unchanged. No session was ended. The 26 Sep Blip session is still open.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

If local `dev` is ahead of `origin/dev` by the spelling commit and the notes commit, that is expected. Do not stop. Do not push unless I ask in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md`. Read the Sprint 1 decisions, the PR 3-07 note, the PR 3-08 note, the PR 3-09 note, and PR 3-10

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/dev` should still be `d4d332c`. `origin/main` should still be `0f3a375` and should contain `0b3db03` and `c0576bd`. `git log --oneline` should contain `c10a43c`, `d4d332c`, `1a0b3d7`, `f2663ca`, `0c2980c`, `5706dfc`, `8e2732e`, `7d3cc98`, `87f36d5`, `44029d9`, `63800fa`, `84b81b1`, `a7cc3e3`, `6df4460`, `dc0a074`, `c954c31`, and `9a71fcb`. Local `dev` should contain `c10a43c`. `dev` and `main` are not the same hash. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-10 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/mcp-reading-chat-trigger`. Create that branch from local `dev`. Do not start PR 3-11. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. v1 Week 3 also has a PR 3-09, and that one is already done. Do not redo it. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-09.

PR 3-10 · Wire MCP tools into the chat router

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Update `src/app/api/chat/route.ts`:

- The math practice trigger already exists. Do not break it.
- Add a reading-quiz trigger only when the subject is reading. Science is not a subject yet. Do not add it in this PR.
- Reading-quiz phrases: "quiz", "give me a quiz", "test me", "reading quiz", "comprehension"
- Add a spelling trigger for any subject.
- Spelling phrases: "spelling", "spell", "practice spelling", "spelling words", "spell a word"
- When a phrase matches, call that MCP route and put the result into Claude's context.
- Claude presents the activity in the character's voice. The child never sees raw JSON.
- The spelled word and the correct quiz choice stay on the server.

Copy the shape of the existing math trigger. Do not invent a second style.

Before writing the route, read the Next.js route handler doc in `node_modules/next/dist/docs/`. This app is Next.js 16.

Test math, reading quiz, and spelling separately. Do not print stored words, correct choice numbers, the Redis URL, or the Redis token. Do not fill a rate-limit bucket. Do not lower a cap. Do not end any session. The dev server on port 3000 may already be running. If a route returns an HTML 404, restart `npm run dev` and try again. Do not leave a `console.log` in the route.

Commit only the files for this PR. The commit message is:

`feat(api): wire reading quiz and spelling triggers into chat router`

Then update `memory-bank/activeContext.md`, `memory-bank/progress.md`, `memory-bank/systemPatterns.md`, and `memory-bank/techContext.md`. Check off PR 3-10 in `ROADMAP-v2-phase2.md`. Refresh `memory-bank/next-session-prompt.md` so the next session starts at PR 3-11. Commit those notes separately. Merge the feature branch into local `dev`. Do not push. Do not merge to `main`.

The pre-commit hook runs `tsc`, Prettier, and ESLint. Let it run. If it fails, fix the problem and make a new commit. Do not amend.

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

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo 2-25 to close that box.

Three PR 2-26 boxes stay open on purpose. They are the "no active session" line, the approve-topic line, and the reject-flow line. The Phase 1 "Zero ESLint warnings" box stays open. The PR 3-04 phone celebrate box stays open. Do not check the Sprint 2 overview box. That waits for the sprint test.

Live site: https://spark-tutor-app.vercel.app
