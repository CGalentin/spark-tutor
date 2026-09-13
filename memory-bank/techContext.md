# Tech Context — Spark Tutor

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.2.9 | App Router, API routes, SSR/SSG |
| Language | TypeScript | Latest (strict mode) | Type safety across entire codebase |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| UI Components | Shadcn UI | 4.11.0 | Parent dashboard + auth screens only |
| State Management | Zustand | Latest | Global state (auth, session, character) |
| Auth + DB | Firebase Auth + Firestore | Latest | Parent accounts, session storage |
| Vector Search | Firestore (in-memory cosine sim) | — | RAG chunk storage + retrieval (no extension needed at current corpus size) |
| Chat LLM | Claude (Anthropic) | API | Mascot voice, Socratic Q&A, session summaries |
| Embedding LLM | Gemini (Google AI Studio) | API | Embeddings only — never generates user-facing text |
| Deployment | Vercel | — | Hosting, edge functions, environment variables |

## Installed Dependencies
```
firebase                ← client SDK (browser)
firebase-admin          ← Admin SDK (server-side only)
@anthropic-ai/sdk       ← Claude API client
@google/generative-ai   ← Gemini embedding client (^0.24.1)
zustand                 ← state management
clsx                    ← conditional classnames
tailwind-merge          ← merge Tailwind classes without conflicts
shadcn/ui (4.11.0)      ← component library (Card, Badge, Button, Input installed)
@upstash/ratelimit      ← sliding window rate limiter for AI endpoints
@upstash/redis          ← Upstash Redis REST client (used by ratelimit)

# devDependencies (scripts only — not bundled into the app)
pdf-parse@1.1.1         ← PDF text extraction (pinned — v2 changed the API)
ts-node                 ← run TypeScript scripts outside the Next.js bundler
dotenv                  ← load .env.local in scripts
husky@^9.1.7            ← pre-commit hook runner; "prepare": "husky" in scripts
lint-staged@^16.4.0     ← runs formatters/linters only on staged files
```

## Environment Variables
All stored in `.env.local` (gitignored, never committed). All 11 keys are filled.
See `.env.example` for key names (committed, safe — no values).

```
# Firebase Client (NEXT_PUBLIC_ = safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY        ✅ filled
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN    ✅ filled
NEXT_PUBLIC_FIREBASE_PROJECT_ID     ✅ filled (spark-tutor-96f9c)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ✅ filled
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ✅ filled
NEXT_PUBLIC_FIREBASE_APP_ID         ✅ filled

# Firebase Admin (server-side only)
FIREBASE_ADMIN_PROJECT_ID           ✅ filled
FIREBASE_ADMIN_CLIENT_EMAIL         ✅ filled
FIREBASE_ADMIN_PRIVATE_KEY          ✅ filled

# AI APIs (server-side only)
ANTHROPIC_API_KEY                   ✅ filled
GEMINI_API_KEY                      ✅ filled

# Upstash Redis (server-side only — rate limiting)
UPSTASH_REDIS_REST_URL              ✅ filled (Vercel: Production + Preview; local: .env.local)
UPSTASH_REDIS_REST_TOKEN            ✅ filled (Vercel: Production + Preview; local: .env.local)
```

## Firebase Project
- Project ID: `spark-tutor-96f9c`
- Auth: Email/Password enabled (Google also enabled but unused)
- Firestore: Standard edition, production mode security rules

## TypeScript Conventions
- Strict mode enabled in `tsconfig.json` — never disable
- No `any` types — ever
- `interface` for object shapes, `type` for unions and primitives
- All shared types in `src/types/` — import from `@/types`
- All API routes use `ApiResult<T>` return type

## Key File Locations
```
# Firebase
src/lib/firebase/config.ts        ← Firebase singleton init, exports auth + db
src/lib/firebase/admin.ts         ← Firebase Admin SDK init; exports adminAuth, adminDb, verifyAuthToken()
src/lib/firebase/auth.ts          ← signIn, signUp, signOut, onAuthChange
src/lib/firebase/firestore.ts     ← getSession, getSessions, subscribeToSessions(), subscribeToLearningPath() (client SDK)
src/lib/firebase/learningPath.ts  ← get/create/update/saveMastery (Admin SDK — API routes only)
src/lib/firebase/vectorSearch.ts  ← saveChunk(), chunkExists(), queryByEmbedding(), countChunks()

# Gemini (embeddings + Flash evaluator)
src/lib/gemini/client.ts          ← getGeminiClient() embeddings SDK; getGeminiFlashClient() Flash model singleton
src/lib/gemini/embed.ts           ← embedText(text) → number[] (3072 dims)
src/lib/gemini/buildEvaluatorPrompt.ts ← evaluator rubric + curriculum next-topic + JSON-only contract
src/lib/gemini/evaluate.ts        ← evaluateMastery(messages, topic, grade) → EvaluationResult (parent-only; parse fallback)

# Claude
src/lib/claude/client.ts          ← Anthropic SDK singleton
src/lib/claude/buildSystemPrompt.ts ← 6-layer system prompt composer (child chat)
src/lib/claude/buildSummaryPrompt.ts ← formats session transcript for agentic summary

# API Routes
src/app/api/chat/route.ts              ← SSE streaming chat; MCP routing before RAG; increments messageCount
src/app/api/rag/route.ts               ← Gemini embed + cosine search; returns top-3 chunks
src/app/api/mcp/math-problem/route.ts  ← MCP tool: Claude generates problem+hint; answer never returned
src/app/api/evaluate/route.ts          ← Gemini Flash mastery score; saves evaluations[] + learning path (not wired to chat yet)
src/app/api/session/start/route.ts     ← creates Firestore session doc; reads or creates learning path; returns sessionId + currentTopic + currentGrade + suggestedNextTopic
src/app/api/session/star/route.ts      ← increments starsEarned in Firestore
src/app/api/session/end/route.ts       ← writes endedAt; fire-and-forgets /api/summary
src/app/api/summary/route.ts           ← sends transcript to Claude; saves summary.* to session doc

# Types
src/types/index.ts                ← central re-export for all shared types
src/types/session.ts              ← Subject, Message, Session, SessionSummary
src/types/rag.ts                  ← CurriculumChunk, RankedChunk, GradeBand ('K'|'1'|'K-1' — RAG chunk metadata)
src/types/learningPath.ts         ← TopicMastery, LearningPath, EvaluationResult, MASTERED_SCORE (90)
src/types/api.ts                  ← ApiResult<T>, ChatRequest (optional grade), SessionStartRequest/Response
                                     (session start returns currentTopic, currentGrade, suggestedNextTopic),
                                     SessionEndRequest/Response, SummaryRequest/Response,
                                     EvaluateRequest/EvaluateResponse, etc.

# Constants + State
src/constants/index.ts            ← barrel: grade bands, prompts, topic map
src/constants/characters.ts       ← all 6 Spark Squad character configs
src/constants/prompts.ts          ← BASE_TUTOR_RULES, SUMMARY_SYSTEM_PROMPT
src/constants/gradeBands.ts       ← tutoring GradeBand 'K'|'1'|'2'|'3' + GRADE_BAND_CONFIGS
src/constants/gradeBandPrompts.ts ← GRADE_BAND_PROMPT strings (Layer 4)
src/constants/topicMap.ts         ← TOPIC_MAP + getTopics() (math/reading K–3; science placeholder)
src/constants/subjects.ts         ← SUBJECTS, MAX_SESSION_STARS (legacy GRADE_BANDS still K|1 for RAG-era constants)
src/store/useChildStore.ts        ← character selection state
src/store/useSessionStore.ts      ← active session state (sessionId, subject, currentTopic, currentGrade, stars, messageCount, topicMessageCount)
src/store/useAuthStore.ts         ← auth state mirror (parentUID, isAuthenticated)

# Hooks
src/hooks/useAuth.ts              ← reads from useAuthStore
src/hooks/useStars.ts             ← awardStar() — updates store + syncs to Firestore
src/hooks/useSessionHistory.ts    ← onSnapshot subscription to parent's session list

# Child UI components
src/components/child/StarBurst.tsx               ← CSS keyframe pop animation overlay
src/components/child/SessionProgressBar.tsx      ← gradient progress bar + star count badge
src/components/child/EndSessionButton.tsx        ← "All Done!" CTA
src/components/child/WellDoneScreen.tsx          ← post-session celebration screen
src/components/child/AnimatedAvatar.tsx          ← SVG avatar wrapper with idle/thinking/celebrating states
src/components/child/avatars/                    ← 6 SVG avatar components + index.ts with getAvatarComponent()
src/components/ui/                               ← Shadcn components (do not edit)

# MCP
src/lib/mcp/mathProblem.ts          ← generateMathProblem() + detectsProblemRequest() (server-side, no HTTP)
src/lib/mcp/topicBoundary.ts        ← detectTopicBoundary() + TOPIC_BLOCK_SIZE=6 (client-safe; not wired into chat yet)

# Parent UI components
src/components/parent/DashboardHeader.tsx  ← welcome message + Start Session CTA
src/components/parent/SessionSummaryCard.tsx ← Shadcn Card; date, subject, stars, topics, encouragement

# Scripts (ts-node, not bundled)
tsconfig.scripts.json             ← CommonJS tsconfig for ts-node scripts
scripts/rag/chunkDocument.ts      ← PDF → overlapping text chunks
scripts/rag/ingestDocuments.ts    ← full ingestion pipeline (chunk → embed → Firestore)
scripts/rag/testEmbed.ts          ← smoke test for Gemini embedding
scripts/rag/testRetrieval.ts      ← RAG quality test (10 questions, pass ≥ 8/10)
scripts/gemini/testEvaluate.ts    ← smoke test for evaluateMastery (Gemini Flash JSON)
```

## Claude API Settings
- Model: `claude-haiku-4-5-20251001` (current fast/cheap Haiku — updated Jun 15 after 3-5-haiku EOL)
- Child chat: `max_tokens: 300`, `temperature: 0.7`
- Session summary: `max_tokens: 600`
- Always stream responses for child chat via SSE
- System prompt layers (see systemPatterns.md):
    1. BASE_TUTOR_RULES
    2. CHARACTER_VOICE
    3. SUBJECT_CONTEXT
    4. GRADE_BAND (GRADE_BAND_PROMPT; defaults to K if request omits `grade`)
    5. RAG_CONTEXT (optional)
    6. MCP_CONTEXT (optional)
- ChatRequest.grade is optional `'K'|'1'|'2'|'3'` — child UI does not send it yet
- `[STAR EARNED]` in Claude response = award a star to the child

## Gemini API Settings
- Embedding model: `gemini-embedding-001` — 3072-dimension vectors (`text-embedding-004` is retired)
- Flash model: `gemini-3.5-flash` — mastery evaluator (`gemini-2.0-flash` shut down 1 Jun 2026)
- Embeddings used for: curriculum ingestion + child-query retrieval
- Flash used for: `evaluateMastery` JSON scores (parent dashboard only — never child-facing)
- Evaluator prompt: `buildEvaluatorPrompt({ topic, grade, messages })` with MASTERED_SCORE rubric
- Parse failure: fallback EvaluationResult (score 0, mastered false, confidence low)
- Never send Flash reasoning to the child chat UI

## Component Rules
- Child UI: custom components ONLY — NO Shadcn. Min 18px text, 48px touch targets, rounded-3xl, bright colors
- Parent UI: Shadcn components — clean, minimal, neutral palette
- Max 200 lines per component, max 500 lines per file

## Naming Conventions
- Components: `PascalCase` — `CharacterCard.tsx`
- Hooks: `camelCase` with `use` prefix — `useSessionStore.ts`
- Utilities: `camelCase` — `buildSystemPrompt.ts`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_SESSION_STARS`
- API routes: `kebab-case` folders — `math-problem/`

## Tailwind Class Ordering
`layout → spacing → sizing → color → typography → effects`

## Development Environment
- OS: Windows 10
- Shell: PowerShell — NO bash heredoc syntax, always use simple `-m "message"` for git commits
- Node: managed via npm
- IDE: Cursor
- Dev server: `cd spark-tutor && npm run dev` → http://localhost:3000
