# Active Context — Spark Tutor

## Current Status
**Week 2 — RAG Layer — 3/10 PRs done (PR 2-01, 2-02, 2-03 ✅)**

---

## Completed PRs (this session — Jun 16)

- [x] PR 2-01 · Collect Source Documents (`feature/rag-source-docs`)
  - 9 math PDFs downloaded to `rag-sources/math/` (EngageNY K + G1 modules, Common Core Math)
  - 8 reading/ELA PDFs downloaded to `rag-sources/reading/` (CKLA KG + G1 ICs, Common Core ELA)
  - `/rag-sources/README.md` committed — 17 sources, licenses confirmed (CC BY-NC-SA 3.0 + public domain)
  - `.gitignore` updated to exclude PDFs/zips from git

- [x] PR 2-02 · Firebase Vector Search Setup (`feature/vector-search-setup`)
  - `src/types/rag.ts` — `CurriculumChunk`, `RankedChunk`, `GradeBand` types; exported from `src/types/index.ts`
  - `src/lib/firebase/vectorSearch.ts` — `saveChunk()`, `chunkExists()`, `queryByEmbedding()` (in-memory cosine similarity), `countChunks()`
  - Decision: using in-memory cosine similarity instead of Firebase Vector Search extension (corpus < 1 000 chunks, no index setup needed)

- [x] PR 2-03 · Document Chunking Utility (`feature/doc-chunking`)
  - `pdf-parse@1.1.1` + `ts-node` installed as devDependencies
  - `tsconfig.scripts.json` created for CommonJS ts-node scripts
  - `scripts/rag/chunkDocument.ts` — full pipeline: `extractTextFromPdf()` → `splitIntoChunks()` → `chunkDocument()`
  - Chunks: 200–400 words, 50-word overlap, tagged with `{ subject, gradeBand, topic, source, chunkIndex, createdAt }`
  - Tested: Common Core Math → 156 chunks (avg 308 words) ✅; CKLA KG D1 → 4 chunks (avg 274 words) ✅
  - `require.main === module` guard so chunker can be imported by ingestion script (PR 2-05)

---

## Up Next — PR 2-04 through PR 2-10

1. **PR 2-04** · Gemini Embedding Setup (`feature/gemini-embeddings`) — ← START HERE
   - Create `src/lib/gemini/client.ts` — Google Generative AI SDK singleton
   - Create `src/lib/gemini/embed.ts` — `embedText(text: string): Promise<number[]>`
   - Test: embed one chunk, log vector length (should be 768)
   - Commit: `feat(rag): add gemini embedding client and embed function`

2. **PR 2-05** · Document Ingestion Script (`feature/ingestion-script`)
   - `scripts/rag/ingestDocuments.ts` — reads all PDFs from `rag-sources/`, chunks, embeds, saves to Firestore
   - `--subject math` flag to run on math sources first
   - Deduplication via `chunkExists()` — never re-embeds

3. **PR 2-06** · Ingest Reading Sources (`feature/ingest-reading`)
   - Run ingestion script on reading sources
   - Verify `subject: 'reading'` in Firestore console

4. **PR 2-07** · RAG Retrieval API Route (`feature/rag-retrieval`)
   - `src/app/api/rag/route.ts` — POST `{ query, subject }` → embed → `queryByEmbedding()` → return top 3 chunks

5. **PR 2-08** · Wire RAG Into Chat (`feature/rag-in-chat`)
   - Update `src/app/api/chat/route.ts` — call `/api/rag`, inject chunks into Layer 3 of system prompt

6. **PR 2-09** · RAG Quality Check (`feature/rag-quality`)
   - `scripts/rag/testRetrieval.ts` — 10 sample K-1 questions, verify retrievals are relevant

7. **PR 2-10** · Week 2 Integration Test & Deploy (`dev`)
   - TypeScript clean, deploy to Vercel, merge dev → main

---

## Active Branch
`dev` — create `feature/gemini-embeddings` from `dev` at start of next session

## Known Issues / Decisions
- CKLA Instructional Companion PDFs are mostly image-based → low chunk counts (4–8 chunks per IC)
  → Supplemental and scope/sequence PDFs yield more text; the Teacher Guide PDFs are text-rich (2MB+)
- pdf-parse@1.1.1 pinned — v2 changed to class-based API entirely
- In-memory cosine similarity chosen over Firebase Vector Search extension — fast enough for MVP corpus size
- PowerShell on Windows 10 — no bash heredoc, use `-m "message"` for git commits
- Git rule: always merge feature branch to dev BEFORE creating next feature branch

## Recent Decisions & Notes
- EngageNY (archive.org) used for math instead of CK-12 (CK-12 PDFs require account login, no direct download URL)
- All scripts use `tsconfig.scripts.json` with CommonJS module resolution (not Next.js bundler)
- `@/` path alias configured in `tsconfig.scripts.json` paths (points to `./src/*`)
