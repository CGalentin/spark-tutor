# Next session prompt — paste this into a new Cursor chat

Stop. Do not start this prompt's work in the same chat that wrote it.

## Where the last session stopped

Date: 11 Nov 2026. PR 3-15 is done and on local `dev`. Grades 2–3 Math + Reading are in Firestore. Science is not ingested.

- Local `dev` includes ingest commit `411f213`. Confirm with `git merge-base --is-ancestor 411f213 HEAD`
- Corpus **3807** total: math 264 (G2 25, G3 37), reading 3543 (G2 1485, G3 1724)
- Science PDFs are local under `rag-sources/science/` (gitignored): `k-1/` 6 files, `grade-2/` 5, `grade-3/` 4
- `origin/main` still has Sprint 2 merge `cba97ab`. Live site unchanged for this curriculum work
- Math path unchanged: Counting to 20, suggestion Shapes, `parentApproved` false
- 26 Sep Blip session still open — do not end it
- Gemini billing is linked (Tier 1). Use that for embeddings
- Ingest script does **not** support `--subject science` yet. `Subject` is still `'math' | 'reading'`. Extend only as needed to tag chunks `subject: 'science'`. No Science UI button (PR 3-18). No session-flow Science work (PR 3-17) beyond the minimum type change if required for ingest

`AGENTS.md` and `spark_tutor_build_bible_2.docx` stay dirty on purpose unless I say otherwise in that chat.

Copy everything below the line.

---

I'm building Spark Tutor v2 Phase 2. Read these files before you touch anything. Do not edit, commit, or create a branch until they are read:

- Every file in `memory-bank/`, including `README.md`, `next-session-prompt.md`, `activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, and `projectbrief.md`
- Follow the close-out process in `memory-bank/README.md` after the PR (update memory bank + roadmap, then refresh this prompt)
- `.cursorrules` in the parent `TutorApp` folder (`C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\.cursorrules`)
- `CLAUDE.md`
- `ROADMAP-v2_1.md` (Phase 1; already shipped — do not check off Phase 2 work there)
- `ROADMAP-v2-phase2.md` — Sprint 3 intro, PR 3-15 complete note, then **PR 3-16 only**
- `rag-sources/README.md` science sections (folder layout and file names)

If those files disagree with this message, follow this message.

Confirm git before editing. Shell is PowerShell. Use `;` between commands. Do not use `&&`. `git commit -m "message"` is fine.

`origin/main` should contain merge `cba97ab` and should still contain `0b3db03` and `c0576bd`. Local `dev` must contain `411f213` (`git merge-base --is-ancestor 411f213 HEAD`). `dev` and `main` are not the same hash because `main` has merge commits. If those commits are missing, stop and tell me. Do not force-push. Do not merge to `main` unless I explicitly say to merge in that same message. Do not push unless I explicitly say to push in that same message. Do not run `vercel --prod` unless I explicitly say to deploy in that same message.

This session is **PR 3-16 only** from `ROADMAP-v2-phase2.md`. Branch: `feature/ingest-science` from local `dev`. Do not start PR 3-17. Do not add a Science subject button. Do not deploy.

v1 Week 2 PRs 2-01 through 2-10, and v1 Week 3 PRs 3-01 through 3-06, are already done. Phase 2 work uses the numbers in `ROADMAP-v2-phase2.md`. Do not mix them up. Do not redo PRs 2-28 or Phase 2 PRs 3-01 through 3-15.

PR 3-16 · Ingest Science Chunks

I am newer to coding. Before you edit a file, tell me in plain language what you are about to change and why. After the edits, list each file, what changed, and why.

Follow the checklist in `ROADMAP-v2-phase2.md` for PR 3-16:

- Run ingestion on Science sources:
  ```
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade K
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 1
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 2
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 3
  ```
- The script does not support science yet. Extend it for this PR only as needed to ingest and tag chunks. Folders: `rag-sources/science/k-1/`, `grade-2/`, `grade-3/`. K and 1 share `k-1/`; still tag chunks with `gradeBand` `K` or `1` correctly
- Verify Firestore chunks have `subject: 'science'`
- Note final total chunk count (math+reading baseline before this PR is **3807**)
- Spot-check 5 science chunks across different grades
- Dedup check: re-running must not create duplicates
- Commit: `feat(rag): ingest science curriculum chunks for grades k-3`

After the feature commit, follow `memory-bank/README.md` before you stop:

- Update `activeContext.md` and `progress.md`
- Check off PR 3-16 in `ROADMAP-v2-phase2.md` (not `ROADMAP-v2_1.md`)
- If architecture changed (`Subject`, RAG helpers, ingest), update `systemPatterns.md` and `techContext.md` in the docs commit
- If product wording is stale, update `productContext.md` / `projectbrief.md`
- Refresh `next-session-prompt.md` for PR 3-17, then make a separate docs commit

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

PR 3-15 note: Grades 2–3 Math + Reading ingested. Corpus **3807**. Commit `411f213` on local `dev`. Gemini billing linked. Science sources in `rag-sources/README.md`. Science subject button is a later PR.

Live site: https://spark-tutor-app.vercel.app
