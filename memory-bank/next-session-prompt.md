# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. PR 3-07 and PR 3-08 are done. `POST /api/mcp/reading-quiz` is `0c2980c`. `POST /api/mcp/reading-quiz/verify` is `1a0b3d7`. Neither route is deployed. https://spark-tutor-app.vercel.app still shows the eight character cards.

The answer note is `quiz_sessions/{sessionId}/activeQuiz/current`. It holds `answers`, `hints`, `solvedQuestionIndexes`, `expiresAt` (2 hours), and `parentUID`. A wrong choice returns the stored hint and can be tried again. The note is deleted after questions 0, 1, and 2 have all been gotten right. The correct choice number is never in the reply.

The Math path was unchanged. The 26 Sep Blip session is still open.

`origin/main` is `0f3a375`. `dev` and `main` are not the same hash. After this notes commit is pushed, local `dev` and `origin/dev` should both contain `1a0b3d7`.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md` (this is the plan). Read the Sprint 1 decisions, the PR 3-07 and PR 3-08 notes, and PR 3-09

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Local `dev` and `origin/dev` should contain `1a0b3d7`, `f2663ca`, `0c2980c`, and `5706dfc`. `origin/main` should be `0f3a375` and should contain `0b3db03` and `c0576bd`. `git log --oneline` should also contain `8e2732e`, `7d3cc98`, `87f36d5`, `44029d9`, `63800fa`, `84b81b1`, `a7cc3e3`, `6df4460`, `dc0a074`, `c954c31`, and `9a71fcb`. `dev` and `main` are not the same hash, because `main` has merge commits. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-09 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/mcp-spelling`. Create that branch from local `dev`. Do not start PR 3-10. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28 or 3-01 through 3-08.

PR 3-09 · Spelling practice MCP route

Build `POST /api/mcp/spelling` and `POST /api/mcp/spelling/verify`. Check the signed-in parent before reading the body on both routes. Add a rate limit of 30 per parent per hour for the word list, and 60 per parent per hour for the answer check. Use separate buckets. Do not lower an existing cap. The word-list route accepts a session id, a grade, a topic, and a count from 3 to 5. Claude writes grade-appropriate spelling words. The browser gets a clue, a letter count, and a hint for each word. The real words stay in a server-only Firestore note. Use the same folder pattern as the quiz: `quiz_sessions/{sessionId}/activeSpelling/current`. The check route accepts a session id, a word index, and the child's attempt. Compare without caring about capital letters. Reply with whether it was right and a short feedback line. Never send the correct spelling. I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Add the types in `src/types/api.ts`: `SpellingWord`, `SpellingRequest`, `SpellingResponse`.

Commit only the files for this PR. Then update `memory-bank/activeContext.md`, `memory-bank/progress.md`, check off PR 3-09 in `ROADMAP-v2-phase2.md`, and refresh `memory-bank/next-session-prompt.md` so the next session starts at PR 3-10. Commit those notes separately. Merge the feature branch into local `dev`. Do not push. Do not merge to `main`.

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
