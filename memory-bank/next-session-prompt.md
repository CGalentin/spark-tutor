# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. PR 3-07 and PR 3-08 are done and pushed. Nothing was deployed.

- `origin/dev` is `d4d332c` (`docs: check off PR 3-08 and point the next session at the spelling route`)
- `origin/main` is `0f3a375`
- `dev` and `main` are not the same hash, because `main` has merge commits
- `POST /api/mcp/reading-quiz` is `0c2980c`
- `POST /api/mcp/reading-quiz/verify` is `1a0b3d7`
- Live site https://spark-tutor-app.vercel.app still shows the eight character cards. The quiz routes are not on production.

The quiz note is `quiz_sessions/{sessionId}/activeQuiz/current`. It holds `answers`, `hints`, `solvedQuestionIndexes`, `expiresAt` (2 hours), and `parentUID`. A wrong choice returns the stored hint and can be tried again. The note is deleted after questions 0, 1, and 2 have all been gotten right. The correct choice number is never in the reply. Do not redo that.

The Math path was unchanged. The 26 Sep Blip session is still open.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

If local `dev` is one commit ahead of `origin/dev`, and that commit only refreshes this prompt, that is the close-out. Do not stop. Do not push it unless I ask in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md`. Read the Sprint 1 decisions, the PR 3-07 note, the PR 3-08 note, and PR 3-09

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/dev` should be `d4d332c`. `origin/main` should be `0f3a375` and should contain `0b3db03` and `c0576bd`. `git log --oneline` should contain `d4d332c`, `1a0b3d7`, `f2663ca`, `0c2980c`, `5706dfc`, `8e2732e`, `7d3cc98`, `87f36d5`, `44029d9`, `63800fa`, `84b81b1`, `a7cc3e3`, `6df4460`, `dc0a074`, `c954c31`, and `9a71fcb`. Local `dev` should contain `d4d332c`. One later docs commit that only refreshes `memory-bank/next-session-prompt.md` is expected. `dev` and `main` are not the same hash. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-09 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/mcp-spelling`. Create that branch from local `dev`. Do not start PR 3-10. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. v1 Week 3 also has a PR 3-09, and that one is already done. Do not redo it. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-08.

PR 3-09 · Spelling practice MCP route

Build both routes. I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

`POST /api/mcp/spelling`

- Check the signed-in parent before reading the body.
- Then apply a new rate limit of 30 per parent per hour. Use its own prefix, `rl:spelling`. Do not share the chat bucket or the reading-quiz bucket.
- Then read the body: `{ sessionId: string, grade: GradeBand, topic: string, count: number }`.
- `grade` is the tutoring grade `'K' | '1' | '2' | '3'` from `src/constants/gradeBands.ts`. Do not use the RAG grade `'K' | '1' | 'K-1'`.
- `count` must be 3, 4, or 5.
- Confirm the session belongs to this parent before calling Claude. A missing session is 404. Do not call Claude for it.
- Claude Haiku (`claude-haiku-4-5-20251001`) writes that many grade-appropriate spelling words.
- The browser reply is `{ words: SpellingWord[] }`.
- `SpellingWord` is `{ clue: string, letterCount: number, hint: string }`.
- The real words stay in Firestore at `quiz_sessions/{sessionId}/activeSpelling/current`.
- Firestore paths alternate folder, file, folder, file. The plan's path ends on the `activeSpelling` folder, so the note itself is the file named `current`. Same pattern as the quiz note.
- Also save `parentUID` and `expiresAt` (2 hours), matching the quiz note.
- A new list for the same session replaces the old note.
- Client rules already deny all reads and writes on `quiz_sessions`. Do not open that collection to the browser.
- The clue, the hint, and `letterCount` must not reveal the spelling. `letterCount` is the number of letters in the word. If Claude puts the word in the clue or the hint, reject that quiz and do not send it.

`POST /api/mcp/spelling/verify`

- Check the signed-in parent before reading the body.
- Then apply a new rate limit of 60 per parent per hour. Use its own prefix, `rl:spelling-verify`.
- Then read `{ sessionId: string, wordIndex: number, attempt: string }`.
- Read the words from `quiz_sessions/{sessionId}/activeSpelling/current`.
- If the note is missing, expired, or belongs to a different parent, return 404 in plain English. Do not say which of those three it was.
- Compare the attempt to the stored word after trimming and ignoring capital letters.
- Reply `{ correct: boolean, feedback: string }`.
- Praise when it is right. A hint when it is wrong.
- Never send the correct spelling in the reply, including inside the feedback.
- The roadmap does not say to delete this note. Leave it in place so a wrong try can be tried again.
- Do not mark a word solved in a way that changes the reading-quiz note. Spelling has its own note.

Copy the shape of these files. Do not invent a second style:

- `src/app/api/mcp/reading-quiz/route.ts`
- `src/app/api/mcp/reading-quiz/verify/route.ts`
- `src/lib/upstash/ratelimit.ts`

Every route returns `ApiResult`. Auth errors stay 401. A broken body is 400. A Redis error fail-opens, and the empty catch must not print the Redis address or token.

Do not change the existing limits. Chat is 30. Summary is 10. Evaluate is 60. Approve is 20. Reject is 20. Reading quiz is 30. Reading-quiz verify is 60.

Add `SpellingWord`, `SpellingRequest`, and `SpellingResponse` to `src/types/api.ts`, and export them from `src/types/index.ts`. The response type must not include the spelled word.

Before writing the route, read the Next.js route handler doc in `node_modules/next/dist/docs/`. This app is Next.js 16. Export `POST` from `route.ts`. Use `Response.json`.

Test the routes. A post with no token and a broken body must return 401, which proves the body was not read yet. Then one real list for a session this parent owns. Confirm the HTTP body has clues, letter counts, and hints, and does not contain the stored words. Then one wrong attempt and one right attempt with different capital letters. Confirm the right reply does not contain the spelling. Do not print the stored words, the Redis URL, or the Redis token. Do not fill a rate-limit bucket. Do not lower a cap.

Use an existing session id. Do not end any session. The dev server on port 3000 may already be running. If the new route returns an HTML 404, restart `npm run dev` and try again. Do not leave a `console.log` in the route. This PR has no child-screen change, so do not click around the dashboard.

Commit only the files for this PR. The commit message is:

`feat(mcp): add spelling practice mcp route — words stored server-side only`

Then update `memory-bank/activeContext.md`, `memory-bank/progress.md`, `memory-bank/systemPatterns.md`, and `memory-bank/techContext.md`. Check off PR 3-09 in `ROADMAP-v2-phase2.md`. Refresh `memory-bank/next-session-prompt.md` so the next session starts at PR 3-10. Commit those notes separately. Merge the feature branch into local `dev`. Do not push. Do not merge to `main`.

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
