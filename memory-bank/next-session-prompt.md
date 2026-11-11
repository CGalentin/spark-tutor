# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 11 Nov 2026. PR 3-11 is done. Nothing was deployed. Nothing was pushed.

- `origin/dev` is still `d4d332c`
- `origin/main` is still `0f3a375`
- `dev` and `main` are not the same hash, because `main` has merge commits
- Local `dev` contains `8ec1c33` (`feat(child-ui): add activity buttons for quiz and spelling above chat input`)
- The notes commit on top of that checks off PR 3-11 and points this prompt at PR 3-12. That commit is local only
- Live site https://spark-tutor-app.vercel.app still shows the eight character cards. The quiz and spelling routes are not on production.

Activity buttons sit above the chat input. Math shows Practice Problem + Spelling. Reading shows Reading Quiz + Spelling. Science is not a subject yet. Clicks send `practice problem`, `give me a quiz`, or `practice spelling` through the same chat send path. Buttons hide while the mascot replies. Do not redo that.

The browser check started short Math and Reading visits and did not end them. Do not end the 26 Sep Blip session either. The Math path stayed on Counting to 20, suggestion Shapes, `parentApproved` false.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

If local `dev` is ahead of `origin/dev`, that is expected. Do not stop. Do not push unless I ask in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md`. Read the Sprint 1 decisions, the PR 3-10 note, the PR 3-11 note, and PR 3-12

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/dev` should still be `d4d332c`. `origin/main` should still be `0f3a375` and should contain `0b3db03` and `c0576bd`. `git log --oneline` should contain `8ec1c33`, `575ce48`, `baa775b`, `c10a43c`, `d4d332c`, `1a0b3d7`, `f2663ca`, `0c2980c`, `5706dfc`, `8e2732e`, `7d3cc98`, `87f36d5`, `44029d9`, `63800fa`, `84b81b1`, `a7cc3e3`, `6df4460`, `dc0a074`, `c954c31`, and `9a71fcb`. Local `dev` should contain `8ec1c33`. `dev` and `main` are not the same hash. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-12 only, from `ROADMAP-v2-phase2.md`. Work on local `dev`. Do not start a new feature branch unless the roadmap says to. Do not start Sprint 3. Do not deploy unless I say to deploy in that same message.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. v1 Week 3 also has a PR 3-09, and that one is already done. Do not redo it. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-11.

PR 3-12 · Sprint 2 Test + Deploy

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Follow the checklist in `ROADMAP-v2-phase2.md` for PR 3-12. Test reading quiz via button, spelling via button, math via chat phrase, and the chat phrase triggers without buttons. Confirm answers and spellings never appear in network responses. Run `npx tsc --noEmit` and `npm run build`. Deploy and merge to `main` only if I explicitly say to deploy and merge in that same message. If I do not say deploy, stop after the local test and the notes commit.

Do not click "Yes, start this next" or "Keep practicing current topic". Do not end the 26 Sep Blip session. Do not end older unended sessions unless the roadmap requires ending only the new test sessions you start.

Before writing a component, read the Next.js docs in `node_modules/next/dist/docs/` only if you are unsure about a file convention. This app is Next.js 16.

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

Three PR 2-26 boxes stay open on purpose. They are the "no active session" line, the approve-topic line, and the reject-flow line. The Phase 1 "Zero ESLint warnings" box stays open. The PR 3-04 phone celebrate box stays open. Do not check the Sprint 2 overview box until the sprint test is done.

Live site: https://spark-tutor-app.vercel.app
