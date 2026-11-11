# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 11 Nov 2026. PR 3-15 is done and merged to local `dev`. Grades 2–3 Math + Reading are ingested. Science is not.

- Local `dev` is at `5f510d7` and includes PR 3-15 commits `411f213` (ingest) + `5f510d7` (docs). Fast-forward merge from `feature/ingest-grades-2-3`
- Firestore corpus is **3807** total (math 264, reading 3543). Breakdown: math|2 25, math|3 37, reading|2 1485, reading|3 1724
- Science PDFs remain under `rag-sources/science/` (gitignored, not ingested): `k-1/` (6), `grade-2/` (5), `grade-3/` (4)
- `origin/main` still has merge `cba97ab` (Sprint 2). Not pushed. Not deployed
- Math path is still Counting to 20, suggestion Shapes, `parentApproved` false
- The 26 Sep Blip session is still open. Do not end it
- Gemini billing is linked (Tier 1). Free-tier daily embed limit was hit mid 3-15; paid quota finished it. Prefer the paid project key for science ingest
- The ingest script does **not** support `--subject science` yet. `Subject` in `src/types/session.ts` is still `'math' | 'reading'`. `countChunks` / `queryByEmbedding` only accept math|reading. Extending those for ingest is part of PR 3-16 — do **not** add a Science subject button (that is PR 3-18) and do **not** start PR 3-17 session-flow work unless the type change is the minimum needed to tag chunks `subject: 'science'`

`AGENTS.md` and `spark_tutor_build_bible_2.docx` are still dirty on purpose. Leave them uncommitted unless I say so in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `projectbrief.md`, and `README.md`
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped)
- `ROADMAP-v2-phase2.md`. Read the Sprint 3 intro, the PR 3-15 complete note, then PR 3-16 only
- `rag-sources/README.md` science sections (folder layout and file names)

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/main` should contain merge `cba97ab` and should still contain `0b3db03` and `c0576bd`. Local `dev` should contain the PR 3-15 ingest commit `411f213` (and docs `5f510d7`). `dev` and `main` are not the same hash, because `main` has merge commits. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main` unless I explicitly say to merge in that same message. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is PR 3-16 only, from `ROADMAP-v2-phase2.md`. Branch: `feature/ingest-science`. Create that branch from local `dev`. Do not start PR 3-17. Do not add a Science subject button. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-15.

PR 3-16 · Ingest Science Chunks

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Follow the checklist in `ROADMAP-v2-phase2.md` for PR 3-16:

- Run ingestion on Science sources with the `ts-node` commands listed in the roadmap:
  ```
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade K
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 1
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 2
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 3
  ```
- The script does not support science yet. Extend it for this PR only as needed to ingest and tag chunks. Local folders are `rag-sources/science/k-1/`, `grade-2/`, `grade-3/` — K and 1 share the `k-1` folder; tag chunks with the matching `gradeBand` (`K` vs `1`) even when they come from the same folder
- Verify science chunks in Firestore with `subject: 'science'` metadata
- Note final total chunk count after science ingestion (math+reading baseline before this PR is **3807**)
- Spot-check 5 science chunks across different grades
- Deduplication check: re-running must not create duplicates
- Commit: `feat(rag): ingest science curriculum chunks for grades k-3`

Do not add a Science subject button. Do not change Math, Reading, or Science topic names in `TOPIC_MAP`. Do not wire Science into child chat/session UI (PR 3-17 / 3-18). Do not click "Yes, start this next" or "Keep practicing current topic". Do not end the 26 Sep Blip session. Do not end older unended sessions. Do not reset the Math path.

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

PR 3-15 note: Grades 2–3 Math + Reading ingested. Corpus **3807**. Commits on local `dev`: `411f213` + docs `5f510d7`. Gemini billing is linked. Science sources listed in `rag-sources/README.md`. Leave the Science subject button for a later PR.

Live site: https://spark-tutor-app.vercel.app
