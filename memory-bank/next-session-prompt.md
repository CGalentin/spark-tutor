# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 24 Oct 2026. PR 2-28 docs are committed on branch `docs/v2-readme-update` as `6df4460` (`docs: update readme and claude.md for v2 phase 1 architecture`). That commit contains only `README.md` and `CLAUDE.md`. It is not merged into `dev` or `main`. It is not pushed.

Local `dev` should still match `origin/dev` at `54c23f0`. `git log --oneline` on `dev` should contain `c0576bd` (`chore: v2 phase 1 production deploy — AI intelligence layer live`), plus `dc0a074`, `c954c31`, and `9a71fcb`. `origin/main` should contain `c0576bd`. `dev` and `main` are not the same hash, because `main` has merge commits. If `dev` is behind or diverged, if `main` does not contain `c0576bd`, or if those commits are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat. `CLAUDE.md` is already committed. Do not throw it away.

The memory-bank refresh and the PR 2-28 checkboxes may still be uncommitted. If they are, show me that diff and wait. Do not start PR 3-01 on top of an uncommitted memory-bank update.

## Where this session begins

Phase 2 PR 3-01 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/new-characters-design`.

This is not v1 Week 3 PR 3-01. v1 Week 2 PRs 2-01 through 2-10 and v1 Week 3 PR 3-01 are already done. Do not mix them up. Do not redo PRs 2-01 through 2-28. Do not redo the 6-message Math chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read the memory bank first: every file in memory-bank/ (including next-session-prompt.md), plus .cursorrules in the parent TutorApp folder, CLAUDE.md, ROADMAP-v2_1.md, and ROADMAP-v2-phase2.md. Do not touch any file until those are read.

Confirm git before editing. Local `dev` should match `origin/dev`. The PR 2-28 docs commit `6df4460` is on `docs/v2-readme-update`, not necessarily on `dev`. `origin/main` should contain `c0576bd`. If `dev` is behind, diverged, or `c0576bd`, `dc0a074`, `c954c31`, and `9a71fcb` are missing, stop and tell me. Do not force-push. Do not merge to `main`. Do not deploy unless I explicitly say to deploy in that same message.

This session is PR 3-01 only. After it is committed and the memory bank is updated, stop and wait. Do not start PR 3-02.

PR 3-01 · Design the Two New Characters

Branch: `feature/new-characters-design`.

Work through the PR 3-01 checklist in `ROADMAP-v2-phase2.md`. Before writing code, decide the two characters with me. One boyish, one girlish. Suggestions in the roadmap: raccoon, bear cub, or kangaroo; jellyfish, hedgehog, or starfish. For each one, define `id`, `defaultName`, `type`, `vibe`, colors, emoji, `voicePrompt`, and leave `elevenlabsVoiceId` as `''`. Add them to `src/constants/characters.ts` and export from `src/constants/index.ts`. Run `npx tsc --noEmit`. Commit message when I approve it: `feat(constants): add two new spark squad character definitions`.

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why.

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path. Do not click "Yes, start this next" or "Keep practicing current topic". Do not close older unended sessions. Do not end the 26 Sep 2026 Blip session. It has 7 messages, Counting to 10, score 100, suggested next Counting to 20, and it still says the summary is generating.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo 2-25 to close that box. Do not lower a cap. Do not fill a rate-limit bucket. Do not print the Redis URL or token.

Three PR 2-26 boxes stay open on purpose. The Phase 1 "Zero ESLint warnings" box stays open. The PR 2-28 boxes for committing `AGENTS.md` and `spark_tutor_build_bible_2.docx`, and for merging `dev` into `main`, stay open.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

Leave `AGENTS.md` and `spark_tutor_build_bible_2.docx` uncommitted.
