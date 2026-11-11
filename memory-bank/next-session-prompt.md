# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 11 Nov 2026. PR 3-11 is done. PR 3-12 local sprint test passed. Deploy was not run. Nothing was merged to `main`.

- `origin/dev` is `5e021b6`
- `origin/main` is still `0f3a375`
- `dev` and `main` are not the same hash
- Local sprint checks: Reading Quiz button + wrong/right verify, Spelling button + wrong/right verify, Math button and phrases, phrase-only triggers — all 200, no answer/spelling leaks
- `tsc` and `npm run build` exited 0
- Math path still Counting to 20 / Shapes / `parentApproved` false
- Test sessions from the sprint check were ended. The 26 Sep Blip session was not

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md`. Read the Sprint 1 decisions, the PR 3-11 note, the PR 3-12 note, and PR 3-13

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/dev` should be `5e021b6` or later docs commits on top of it. `origin/main` should still be `0f3a375` and should contain `0b3db03` and `c0576bd`. Local `dev` should match `origin/dev` after pull notes. `dev` and `main` are not the same hash. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main` unless I explicitly say to merge in that same message. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

If I ask to finish Sprint 2: that is the rest of PR 3-12 only — deploy with `vercel --prod`, merge `dev` → `main`, commit `chore: sprint 2 complete — reading quiz and spelling mcp tools live`, check the Sprint 2 overview box, refresh the memory bank, and point the next session at PR 3-13. Do not start Sprint 3 code in that same deploy chat unless I also ask for PR 3-13.

If I ask to start Sprint 3 without deploying: stop and tell me the quiz/spelling tools are not on production yet, then wait for a clear choice.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-11. Do not redo the local Sprint 2 test unless something broke.

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Decisions already made. Do not undo them:

- Stella's voice prompt stays. Sample phrases are examples. "keep floating along" was enough.
- Do not run a six-message lesson to force a star. The chat celebrate check stays open.
- The name question still uses the character emoji, as in "What will you name your 🐻?". Leave that sentence.

Character facts already in the code:

- Bram: id `bram`, type `bear`, card `bg-amber-500` / `text-amber-800`, emoji 🐻, SVG in `BramAvatar.tsx`, `viewBox="0 0 120 120"`
- Stella: id `stella`, type `starfish`, card `bg-rose-400` / `text-rose-600`, emoji ⭐, SVG in `StellaAvatar.tsx`, same 120 viewBox
- The live avatars use 120, not the roadmap's 150. Keep it that way.
- `elevenlabsVoiceId` is `''` on all 8 characters

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path. Do not click "Yes, start this next" or "Keep practicing current topic". Do not close older unended sessions. Do not end the 26 Sep 2026 Blip session.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo 2-25 to close that box.

Three PR 2-26 boxes stay open on purpose. The Phase 1 "Zero ESLint warnings" box stays open. The PR 3-04 phone celebrate box stays open. Do not check the Sprint 2 overview box until deploy is done.

Live site: https://spark-tutor-app.vercel.app
