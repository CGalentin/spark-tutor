# Active Context — Spark Tutor

## Current Status
**Week 1 — Foundation & Chat UI** (in progress)

## Completed PRs
- [x] PR 1-01 · Project Scaffold — Next.js 16 + TypeScript + Tailwind + ESLint scaffolded, `.cursorrules` and `ROADMAP.md` copied in, pushed to GitHub
- [x] PR 1-02 · Folder Structure — All `/src` subdirectories created with `.gitkeep` files, memory bank initialized
- [x] PR 1-03 · Install Dependencies — Firebase, firebase-admin, @anthropic-ai/sdk, @google/generative-ai, zustand, clsx, tailwind-merge, Shadcn UI (card, badge, button, input) installed. Zero TypeScript errors.
- [x] PR 1-04 · Environment Variables — `.env.local` created (gitignored), `.env.example` committed with all required keys and comments. `.gitignore` updated to allow `.env.example` through.
- [x] PR 1-05 · Firebase Client Setup — `config.ts` (singleton init), `auth.ts` (signIn, signUp, signOut, onAuthChange), `firestore.ts` (getSession, getSessions, saveSummary). Zero TypeScript errors.
- [x] PR 1-06 · Shared Types — `character.ts`, `session.ts`, `api.ts`, `index.ts`. Zero TypeScript errors.
- [x] PR 1-07 · Character Constants — All 6 Spark Squad characters defined (Blip, Finn, Zorro, Luna, Pip, Nova) with voicePrompts, colors, emoji. `subjects.ts` with grade bands and MAX_SESSION_STARS. `prompts.ts` with BASE_TUTOR_RULES and SUMMARY_SYSTEM_PROMPT.

## Currently Working On
- PR 1-08 · Zustand Stores

## Up Next (this week)
- PR 1-04 · Environment Variables
- PR 1-05 · Firebase Client Setup
- PR 1-06 · Shared Types
- PR 1-07 · Character Constants
- PR 1-08 · Zustand Stores
- PR 1-09 · Auth Layout & Login Page
- PR 1-10 · Auth Provider & Route Protection
- PR 1-11 · Character Selection Screen
- PR 1-12 · Claude API Route
- PR 1-13 · Chat UI — Message Bubbles
- PR 1-14 · Chat UI — Input & Session
- PR 1-15 · Week 1 Integration Test & Deploy

## Active Branch
`feature/character-constants` (last completed) — next branch: `feature/zustand-stores`

## Recent Decisions & Notes
- Using Next.js 16.2.9 (latest, installed by create-next-app)
- Turbopack is enabled by default in Next.js 16 dev mode (acceptable)
- GitHub repo: https://github.com/CGalentin/spark-tutor (public)
- MIT License added at repo creation
- Shell is PowerShell on Windows 10 — heredoc syntax does NOT work, use simple `-m "message"` for git commits
- Shadcn 4.11.0 initialized with Tailwind v4 support — created `src/lib/utils.ts` (cn() utility) and `components.json`
- Feature branches must be merged into `dev` before creating the next feature branch to keep all branches in sync

## Known Issues / Blockers
- None currently
