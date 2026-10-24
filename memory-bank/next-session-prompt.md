# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. Phase 2 PR 3-01 is committed on `feature/new-characters-design` as `a7cc3e3` (`feat(constants): add two new spark squad character definitions`). Bram the bear cub and Stella the starfish are in the character list. They have no SVG yet.

Local `dev` was fast-forwarded through the docs commits `6df4460` and `23173ce`. It was not pushed. `origin/dev` is still `54c23f0` until a normal push. `origin/main` should contain `c0576bd`. `dev` and `main` are not the same hash. If those commits are missing, or `main` does not contain `c0576bd`, stop and tell me. Do not force-push. Do not merge to `main`. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` stay uncommitted unless I say so in that chat.

## Where this session begins

Phase 2 PR 3-02 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/avatar-boyish-new`.

This draws the SVG for Bram the bear cub. It is not v1 Week 3. Do not start PR 3-03 (Stella's avatar) in the same session.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read the memory bank first: every file in memory-bank/ (including next-session-prompt.md), plus .cursorrules in the parent TutorApp folder, CLAUDE.md, ROADMAP-v2_1.md, and ROADMAP-v2-phase2.md. Do not touch any file until those are read.

Confirm git before editing. PR 3-01 commit `a7cc3e3` should be on `feature/new-characters-design`. Local `dev` includes the docs commits and may not yet include `a7cc3e3` if that feature branch was not merged. `origin/dev` may still be `54c23f0`. `origin/main` should contain `c0576bd`. Do not force-push. Do not merge to `main`. Do not deploy unless I explicitly say to deploy in that same message.

This session is PR 3-02 only. After it is committed and the memory bank is updated, stop and wait.

PR 3-02 · SVG Avatar — Bram the bear cub

Branch: `feature/avatar-boyish-new`.

Work through the PR 3-02 checklist in `ROADMAP-v2-phase2.md`. Create `src/components/child/avatars/BramAvatar.tsx`. Match the existing six avatars: simple geometric shapes, `viewBox="0 0 150 150"`, use Bram's `bg-amber-500` and `text-amber-800` colors, recognizable at 48px and 96px. Export it and add `bram` to `getAvatarComponent`. I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. Verify the avatar on the character select screen and in chat.

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path. Do not click "Yes, start this next" or "Keep practicing current topic". Do not close older unended sessions. Do not end the 26 Sep 2026 Blip session.

Do not redo PR 2-25 to close the live 429 box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Leave `AGENTS.md` and `spark_tutor_build_bible_2.docx` uncommitted.
