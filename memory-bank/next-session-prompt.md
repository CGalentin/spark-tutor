# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 11 Nov 2026. PR 3-13 is done. Source PDFs are local. Nothing more was started.

- Local `dev` has the PR 3-13 docs commit (README + gitignore + roadmap/memory-bank notes)
- 39 new CC-licensed PDFs sit under `rag-sources/` grade folders (gitignored)
- Not ingested. `TOPIC_MAP` still has science placeholders. No Science subject button
- `origin/main` still has merge `cba97ab` (Sprint 2). Live site unchanged for curriculum
- Math path is still Counting to 20, suggestion Shapes, `parentApproved` false
- The 26 Sep Blip session is still open. Do not end it

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md`. Read the Sprint 3 intro, the PR 3-13 complete note, then PR 3-14 only

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/main` should contain merge `cba97ab` and should still contain `0b3db03` and `c0576bd`. Local `dev` should contain the PR 3-13 source-docs commit. `dev` and `main` are not the same hash, because `main` has merge commits. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main` unless I explicitly say to merge in that same message. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-14 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/science-topic-map`. Create that branch from local `dev`. Do not start PR 3-15. Do not ingest. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-13.

PR 3-14 · Update Science Topic Map

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Follow the checklist in `ROADMAP-v2-phase2.md` for PR 3-14:

- Update `/src/constants/topicMap.ts` — replace the six science placeholder strings with the real topic names per grade listed in the roadmap
- Verify topic format matches Math and Reading entries exactly
- Run `npx tsc --noEmit` — zero errors
- Commit: `feat(constants): replace science placeholders with real k-3 topic names`

Do not ingest PDFs. Do not add a Science subject button. Do not change Math or Reading topics. Do not click "Yes, start this next" or "Keep practicing current topic". Do not end the 26 Sep Blip session. Do not end older unended sessions. Do not reset the Math path.

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

Leave the Shapes suggestion in place. Math stays on Counting to 20. `suggestedNextTopic` is Shapes. `parentApproved` is false. `topicsCompleted` is still only Counting to 10. History in saved order: Counting to 10 score 100 at `2026-09-26T17:55:51.558Z`, Counting to 20 score 40 and score 30 both at `2026-09-26T17:56:08.773Z`, then Counting to 20 score 92 at `2026-10-10T23:03:46.508Z`. The last two scores are 30 and 92, so the next Math chat uses the normal hint. Do not reset the path.

One PR 2-25 checkbox is still open: "Verify all new endpoints return 429 with plain-English message on limit hit." Do not redo 2-25 to close that box.

Three PR 2-26 boxes stay open on purpose. The Phase 1 "Zero ESLint warnings" box stays open. The PR 3-04 phone celebrate box stays open.

PR 3-13 source note: 39 local PDFs under `rag-sources/` (EngageNY / CKLA / CKSci). Listed in `rag-sources/README.md`. Leave those folders alone this session.

Live site: https://spark-tutor-app.vercel.app
