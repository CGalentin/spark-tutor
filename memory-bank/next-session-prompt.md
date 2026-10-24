# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. Phase 2 PR 3-03 is committed on `feature/avatar-girlish-new` as `63800fa` (`feat(child-ui): add svg avatar for stella`). Bram and Stella both have SVG avatars.

Local `dev` should include that commit after the feature branch is merged. It has not been pushed. `origin/dev` is still `54c23f0` until a normal push. `origin/main` should contain `c0576bd`. Do not force-push. Do not merge to `main`. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` stay uncommitted unless I say so in that chat.

## Where this session begins

Phase 2 PR 3-04 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/new-character-animations`.

The idle, thinking, and celebrate classes already live in `src/app/globals.css`. `AnimatedAvatar` and the chat page apply them to whatever character is selected. Confirm Bram and Stella receive those classes. Do not copy the keyframes into the avatar files. Do not start PR 3-05 in the same session unless the animation check is done and I say to keep going.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read the memory bank first: every file in memory-bank/ (including next-session-prompt.md), plus .cursorrules in the parent TutorApp folder, CLAUDE.md, ROADMAP-v2_1.md, and ROADMAP-v2-phase2.md. Do not touch any file until those are read.

Confirm git before editing. PR 3-03 commit `63800fa` should be on local `dev` after the merge. `origin/dev` may still be `54c23f0`. `origin/main` should contain `c0576bd`. Do not force-push. Do not merge to `main`. Do not deploy unless I explicitly say to deploy in that same message.

This session is PR 3-04 only. After it is committed and the memory bank is updated, stop and wait.

PR 3-04 · Animations for Bram and Stella

Branch: `feature/new-character-animations`.

Work through the PR 3-04 checklist in `ROADMAP-v2-phase2.md`. The three animations are already `avatar-idle`, `avatar-thinking`, and `avatar-celebrate` in `globals.css`. Both new avatars accept `animationClass`. Chat already sets thinking from `isChatLoading` and celebrate from a star. I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why.

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path. Do not click "Yes, start this next" or "Keep practicing current topic". Do not close older unended sessions. Do not end the 26 Sep 2026 Blip session.

Do not redo PR 2-25 to close the live 429 box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Leave `AGENTS.md` and `spark_tutor_build_bible_2.docx` uncommitted.
