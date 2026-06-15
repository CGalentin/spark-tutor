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
| Vector Search | Firebase Vector Search | Extension | RAG curriculum chunk storage + retrieval |
| Chat LLM | Claude (Anthropic) | API | Mascot voice, Socratic Q&A, session summaries |
| Embedding LLM | Gemini (Google AI Studio) | API | Embeddings only — never generates user-facing text |
| Deployment | Vercel | — | Hosting, edge functions, environment variables |

## Installed Dependencies
```
firebase                ← client SDK (browser)
firebase-admin          ← Admin SDK (server-side only)
@anthropic-ai/sdk       ← Claude API client
@google/generative-ai   ← Gemini embedding client
zustand                 ← state management
clsx                    ← conditional classnames
tailwind-merge          ← merge Tailwind classes without conflicts
shadcn/ui (4.11.0)      ← component library (Card, Badge, Button, Input installed)
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
src/lib/firebase/config.ts      ← Firebase singleton init, exports auth + db
src/lib/firebase/auth.ts        ← signIn, signUp, signOut, onAuthChange
src/lib/firebase/firestore.ts   ← getSession, getSessions, saveSummary
src/lib/utils.ts                ← cn() utility (from Shadcn)
src/types/index.ts              ← central re-export for all shared types
src/constants/characters.ts     ← all 6 Spark Squad character configs
src/constants/prompts.ts        ← BASE_TUTOR_RULES, SUMMARY_SYSTEM_PROMPT
src/constants/subjects.ts       ← Subject, GradeBand, MAX_SESSION_STARS
src/store/useChildStore.ts      ← character selection state
src/store/useSessionStore.ts    ← active session state
src/store/useAuthStore.ts       ← auth state mirror
src/components/ui/              ← Shadcn components (do not edit)
```

## Claude API Settings
- Child chat: `max_tokens: 300`, `temperature: 0.7`
- Session summary: `max_tokens: 600`
- Always stream responses for child chat
- System prompt = BASE_TUTOR_RULES + CHARACTER_VOICE + RAG_CONTEXT (3 layers)
- `[STAR EARNED]` in Claude response = award a star to the child

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
