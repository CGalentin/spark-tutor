# System Patterns — Spark Tutor

## Architecture Overview
```
Browser (Child or Parent)
        │
        ▼
  Next.js App Router (Vercel)
        │
   ┌────┴─────────────────┐
   │  Client Components   │  ← React UI, Zustand state, Firebase listeners
   │  Server Components   │  ← Data fetching, layout
   └────┬─────────────────┘
        │
   ┌────▼──────────────────────────────────────┐
   │           API Routes (/app/api)            │
   │  /api/chat      → Claude (streaming)       │
   │  /api/evaluate  → Gemini Flash (mastery)   │
   │  /api/summary   → Claude (agentic)         │
   │  /api/rag       → Gemini embed + Firebase  │
   │  /api/mcp/math-problem → Claude MCP tool   │
   │  /api/session/start|end → Firestore        │
   │  /api/learning-path/approve|reject       │
   │       → parent confirms next topic       │
   └────┬──────────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────────┐
   │  External Services                         │
   │  Claude (Anthropic) — chat + summary       │
   │  Gemini (Google)    — embeddings + Flash evaluator (parent-only)      │
   │  Firebase Auth      — parent auth          │
   │  Firestore          — sessions + summaries │
   │  Firestore (curriculum_chunks) — RAG store  │
   └───────────────────────────────────────────┘
```

## Key Architectural Patterns

### 1. Composable System Prompt (7 Layers)
Every Claude chat call builds the system prompt from independent layers (learning path, RAG, and MCP are optional):
```
Layer 1: BASE_TUTOR_RULES    — never changes; enforces safety + Socratic method
Layer 2: CHARACTER_VOICE     — loaded from constants/characters.ts by selected character id
Layer 3: SUBJECT_CONTEXT     — which subject (math vs reading) this session covers
Layer 4: GRADE_BAND          — GRADE_BAND_PROMPT[K|1|2|3]; defaults to K if omitted
Layer 5: LEARNING_PATH       — current topic + mastered topics + difficulty hint (omitted if no path)
Layer 6: RAG_CONTEXT         — top 3 curriculum chunks via in-memory cosine similarity on Firestore
                               (omitted if RAG retrieval fails — graceful fallback)
Layer 7: MCP_CONTEXT         — practice problem + hint when the child asks for a math problem
```
This lets us swap or update any layer without touching the others.
Implemented in: `src/lib/claude/buildSystemPrompt.ts`

`/api/chat` fetches `getLearningPath(parentUID, subject)` on every request and maps it to `LearningPathContext`. `getDifficultyHint` (`src/lib/claude/adaptDifficulty.ts`) reads the last two scores on `currentTopic`: both under 50 → `easier`, both over 85 → `harder`, otherwise `normal`. Fewer than two scores on that topic stays `normal`. Easier and harder append a teaching line to Layer 5. Normal adds no extra line — Layer 4 is already the standard grade-band prompt. A missing path or Firestore error skips Layer 5 so chat still works.

### 2. RAG Pipeline
```
Offline (ingestion scripts — run once, not in the app):
  scripts/rag/chunkDocument.ts   → PDF → overlapping 200-400 word chunks + metadata
  scripts/rag/ingestDocuments.ts → chunk → embedText() → saveChunk() to Firestore
                                   (dedup via chunkExists(); safe to re-run)

Online (per child message in /api/chat):
  child message → embedText() → queryByEmbedding(subject, top 3) → inject into Layer 6
```
Corpus: 202 math chunks + 334 reading chunks = 536 total in `curriculum_chunks` Firestore collection.
Cosine similarity is computed in-memory (all subject-filtered chunks fetched, ranked, top-3 returned).
Why not Firebase Vector Search extension? Corpus < 1 000 chunks; no index config needed; upgrade later if needed.

### 3. Dual-LLM Pattern
- **Claude** → all conversation generation (chat + session summaries)
- **Gemini embeddings** (`gemini-embedding-001`) → RAG only (never generates user-facing text)
- **Gemini Flash** (`gemini-3.5-flash`) → parent-only mastery evaluator (`evaluateMastery`)
This separation is intentional: Claude has stronger safety controls and character voice consistency; Gemini is cost-efficient for embeddings and silent scoring. Flash results are never shown to the child.

Evaluator prompt (`src/lib/gemini/buildEvaluatorPrompt.ts`) is a dedicated composer, like Claude's `buildSystemPrompt`. It injects the mastery rubric (0–40 / 41–70 / 71–89 / 90–100), the TOPIC_MAP sequence for `suggestedNext`, and a JSON-only contract. `mastered` is always derived from `MASTERED_SCORE` (90) in code, even if Gemini's JSON disagrees. Unreadable JSON returns a fallback (score 0, mastered false) so a bad model reply never auto-advances.

When `mastered` is true, `/api/evaluate` overwrites Gemini's `suggestedNext` with `suggestNextTopic()` (`src/lib/gemini/suggestNextTopic.ts`). That helper does not call Gemini: it walks TOPIC_MAP in order, skips topics already in `completedTopics` or with a mastery score >= 90, and if the current grade is fully mastered, returns the first topic of the next grade (K→1→2→3). Grade 3 with nothing left stays on the last listed topic so the return type can stay a plain string.

### 4. MCP Tool Pattern
The math problem generator is a Next.js API route that Claude can "call" during a session:
- Input: `{ grade, topic, difficulty }`
- Output to Claude: `{ problem, hint }` — the `answer` field is NEVER sent to client
- Claude receives the problem and hint, then guides the child Socratically toward the answer

Topic boundary detection (`src/lib/mcp/topicBoundary.ts`) is a separate client-safe helper in the same folder:
- `detectTopicBoundary(messageCount, messages)` is true every `TOPIC_BLOCK_SIZE` (6) child messages, or when the last child message includes "I'm done" / "next topic" / "something else"
- Count `0` is not a boundary (even though 0 % 6 === 0)
- `useSessionStore.topicMessageCount` tracks the current block; chat resets it after firing `/api/evaluate`

### 5. Firestore Data Structure
```
users/{parentUID}/
  sessions/{sessionID}/
    subject: 'math' | 'reading'
    characterType: string
    characterName: string        ← fictional name chosen by child
    startedAt: Timestamp
    endedAt: Timestamp
    messageCount: number
    starsEarned: number
    summary/
      topicsCovered: string[]
      areasForPractice: string[]
      encouragementNote: string
      generatedAt: Timestamp

  learningPath/{subject}/        ← helpers in src/lib/firebase/learningPath.ts (Admin) + subscribeToLearningPath (client)
    currentGrade: GradeBand      ← tutoring 'K'|'1'|'2'|'3' (not RAG 'K-1')
    currentTopic: string
    topicsCompleted: string[]
    masteryHistory: TopicMastery[]
    suggestedNextTopic: string | null
    parentApproved: boolean
    parentApprovedAt: Timestamp | null
    lastEvaluatedAt: Timestamp | null
```
All child session and learning-path data lives under the parent UID — no child accounts exist.

**Two different `GradeBand` types (do not mix them):**
- Tutoring: `src/constants/gradeBands.ts` — `'K' | '1' | '2' | '3'`
- RAG chunks: `src/types/rag.ts` — `'K' | '1' | 'K-1'` (curriculum metadata)

`@/types` currently re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

### 6. API Response Shape
Every API route returns this consistent shape:
```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### 7. Client vs Server Components Rule
- Default to Server Components
- Only add `'use client'` when needed: `useState`, `useEffect`, event handlers, Zustand, Firebase listeners
- Keep client components as small (leaf node) as possible

### 8. Firestore Access Pattern
- Components NEVER write to Firestore directly
- Client-side reads go through service functions in `/src/lib/firebase/` (using client SDK)
- Server-side reads/writes go through `adminDb` in `/src/lib/firebase/admin.ts` (Admin SDK, API routes only)
- Learning path CRUD for API routes: `src/lib/firebase/learningPath.ts` (Admin SDK — do not import from Client Components)
- Learning path live dashboard: `subscribeToLearningPath()` in `firestore.ts` (client SDK `onSnapshot`)
- Real-time data (parent dashboard) uses `subscribeToSessions()` → `onSnapshot` with cleanup in `useEffect`

### 9. Error Handling Pattern
- Every async function wrapped in `try/catch`
- Child-facing: mascot says warm message, retry button shown
- Parent-facing: plain English with retry action
- API routes always return a response — never leave a request hanging

### 10. Session Lifecycle
```
Child picks subject → handleSubjectSelect → POST /api/session/start
  → creates Firestore doc users/{uid}/sessions/{id}
  → getLearningPath(parentUID, subject)
    if missing: createLearningPath with first TOPIC_MAP topic at grade K
  → returns sessionId, currentTopic, currentGrade, suggestedNextTopic
  → stored in useSessionStore

Each chat message:
  → POST /api/chat (with sessionId)
  → getLearningPath → Layer 5 LEARNING_PATH (skip if missing)
  → Claude responds (stays on currentTopic; difficulty from the last two scores on that topic)
  → FieldValue.increment(1) on messageCount in Firestore
  → at topic boundary: fire-and-forget POST /api/evaluate
    → evaluateMastery → session.evaluations[] + learningPath masteryHistory
    → if mastered: suggestNextTopic() (TOPIC_MAP + mastery history; next grade if current grade is done)
      → learningPath.suggestedNextTopic + parentApproved false

Parent confirms (dashboard calls these in Sprint 4; no child UI):
  → POST /api/learning-path/approve { subject, approvedTopic }
    → currentTopic = approvedTopic, parentApproved true, parentApprovedAt now
    → suggestedNextTopic null
    → previous topic appended to topicsCompleted (skipped if already listed, or if it is the same topic)
    → currentGrade is not changed
  → POST /api/learning-path/reject { subject }
    → suggestedNextTopic null only; currentTopic stays

Each star earned:
  → useStars.awardStar() → local store + POST /api/session/star
  → FieldValue.increment(1) on starsEarned in Firestore

Child taps "All Done!":
  → handleEndSession → POST /api/session/end
  → writes endedAt, final starsEarned, messageCount
  → fire-and-forget: POST /api/summary (with messages array)
    → Claude analyzes transcript → JSON summary
    → saves to session.summary (nested field, not subcollection)
  → shows WellDoneScreen

Parent opens dashboard:
  → useSessionHistory → subscribeToSessions → onSnapshot
  → live list of sessions (updates when summary arrives)
```

### 11. Parent Topic Approval
The evaluator never changes `currentTopic`. It only writes `suggestedNextTopic` and sets `parentApproved` to false. The parent decides:

- **Approve** (`POST /api/learning-path/approve`): body `{ subject, approvedTopic }`. Sets `currentTopic` to that topic, `parentApproved` true, `parentApprovedAt` to now, `suggestedNextTopic` null, and appends the topic being left onto `topicsCompleted[]`.
- **Reject** (`POST /api/learning-path/reject`): body `{ subject }`. Sets `suggestedNextTopic` to null. Does not change `currentTopic`, `currentGrade`, `parentApproved`, or `topicsCompleted`.

Both routes verify the Firebase ID token and use the Admin learning-path helpers. Responses use `ApiResult`: `{ approved: true, newTopic }` or `{ rejected: true }`. A missing learning path returns 404. `currentGrade` stays as stored even when the approved topic belongs to the next grade.

## Route Structure
```
/                          → redirect to /character-select or /login
/(auth)/login              → parent login
/(auth)/signup             → parent signup
/(child)/character-select  → pick + name a Spark Squad character
/(child)/chat              → main tutoring session
/(parent)/dashboard        → parent session history
/privacy                   → privacy policy (COPPA)
```
