# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. The Sprint 1 character test is recorded on local `dev`. The notes commit message is `docs: record the sprint 1 character test and leave the deploy unstarted`. It sits on top of `87f36d5`. Local `dev` is ahead of `origin/dev` (`54c23f0`) and has not been pushed. `origin/main` should contain `c0576bd`. `dev` and `main` are not the same hash, because `main` has merge commits.

Nothing was deployed. The chat celebrate bounce was not seen, because neither new character earned a star. Idle float and thinking tilt were watched at 375px with the CPU slowed to 4x.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md` (this is the plan). Read the Pre-Work notes and Sprint 1, especially what is still open on PRs 3-04 and 3-06

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Local `dev` should be one commit ahead of `87f36d5`. That commit message is `docs: record the sprint 1 character test and leave the deploy unstarted`. `git log --oneline` should also contain `87f36d5`, `44029d9`, `63800fa`, `84b81b1`, `a7cc3e3`, `6df4460`, `c0576bd`, `dc0a074`, `c954c31`, and `9a71fcb`. `origin/dev` should still be `54c23f0`. `origin/main` should contain `c0576bd`. `dev` and `main` are not the same hash. If `dev` is behind, diverged, or those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

Do not start Sprint 2. Do not start PR 3-07. The open work is only what I ask for in that message:

- If I approve the code overview, push local `dev`. The code changes since `54c23f0` are the README and CLAUDE.md update, Bram and Stella in the character list, and their two SVG files. The select grid did not need a code change.
- If I say deploy, that is the rest of PR 3-06: `vercel --prod`, then merge `dev` into `main`. Not a force-push.
- If I ask to watch the star bounce, start one short Math visit, stay under six child messages so the evaluator does not add a score, and stop when a star is earned or when I say stop.

Commit after the work I asked for. Show me the changes and any suggestions before you push.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28, 3-01, 3-02, 3-03, 3-04, or 3-05.

One PR 3-04 box is still open on purpose: "Test animations on mobile (375px, DevTools throttled CPU)." Idle and thinking were watched. Close it only if you actually see celebrate on Bram or Stella at phone size in chat. The classes already exist in `src/app/globals.css`. Do not copy those keyframes into the avatar files.

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Character facts already in the code:

- Bram: id `bram`, type `bear`, card `bg-amber-500` / `text-amber-800`, emoji 🐻, SVG in `BramAvatar.tsx`, `viewBox="0 0 120 120"`
- Stella: id `stella`, type `starfish`, card `bg-rose-400` / `text-rose-600`, emoji ⭐, SVG in `StellaAvatar.tsx`, same 120 viewBox
- The live avatars use 120, not the roadmap's 150. Keep it that way.
- `elevenlabsVoiceId` is `''` on all 8 characters

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path. Do not click "Yes, start this next" or "Keep practicing current topic". Do not close older unended sessions. Do not end the 26 Sep 2026 Blip session. It has 7 messages, Counting to 10, score 100, suggested next Counting to 20, and it still says the summary is generating.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo 2-25 to close that box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Three PR 2-26 boxes stay open on purpose. The Phase 1 "Zero ESLint warnings" box stays open. Do not merge `dev` into `main` unless I explicitly say to deploy in that same message.

Live site, unchanged until I say deploy: https://spark-tutor-app.vercel.app
