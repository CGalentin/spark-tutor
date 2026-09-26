# Next session prompt — paste this into a new Cursor chat

PR 2-19 is committed on local `dev` (26 Sep 2026). Sprint 3 is complete. Not pushed. `origin/dev` is still at PR 2-15 — do not force-push.

If the user says "continue": start PR 2-20 from local `dev` on `feature/mastery-indicator`. Do not push unless asked. Do not `vercel --prod` unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-19 are complete on local `dev`. `origin/dev` is still at PR 2-15. Do not redo them. Do not force-push.

Sprint 3 live check (26 Sep 2026): math session on Counting to 10, 6 chats, evaluate score 100, suggested Counting to 20. Approve switched the path and completed Counting to 10. A new session taught Counting to 20. Two scores of 40 and 30 were written on Counting to 20, so the next math chat uses the easier hint until two higher scores land.

Start PR 2-20 from local `dev` on branch `feature/mastery-indicator`. Follow ROADMAP-v2_1.md exactly. After 2-20: stop, summarize, wait for me to say "continue" before merging or starting 2-21.

PR 2-20 · Mastery Indicator Component

Branch: feature/mastery-indicator (off local `dev`).

- Create /src/components/parent/MasteryIndicator.tsx:
  - Circular progress ring (SVG) showing current topic mastery score 0-100
  - Color coded: red (0-49), yellow (50-89), green (90-100)
  - Shows topic name, score, and confidence label ('Building', 'Almost there', 'Mastered!')
  - Animates smoothly when score updates via onSnapshot
  - Uses Shadcn Badge for the confidence label
- Verify accessible: includes aria-label with the score for screen readers
- npx tsc --noEmit
- Commit: feat(parent-ui): add mastery indicator component with animated progress ring

Tutoring grade is @/constants (src/constants/gradeBands.ts) — 'K' | '1' | '2' | '3'. Do not use RAG GradeBand from @/types. MASTERED_SCORE is 90.

What's already built

Teacher prompt is 7 layers. Chat sends grade and currentTopic. Difficulty: last two scores on the current topic, both < 50 → easier, both > 85 → harder, otherwise normal.

POST /api/learning-path/approve and /reject exist. The parent dashboard does not call them yet (PR 2-22).

Session start teaches currentTopic while a suggestion is waiting, and returns a learningPath summary.

Workflow

I am newer to coding — explain what each piece does as you build.
After each PR: stop, summarize, wait for me to say "continue" before merging or starting the next PR.
Merge each feature/ branch to local `dev` before creating the next one.
Shell is PowerShell — use ; not &&; no bash heredocs.
Do not push unless I ask.
origin/dev may be behind local `dev`; do not force-push.
Leave uncommitted AGENTS.md, CLAUDE.md, and spark_tutor_build_bible_2.docx alone.
Do not vercel --prod unless I ask. Do not merge to main.

When implementing parent UI, verify it in the browser before you finish.

Memory bank (required)

After every PR: activeContext.md, progress.md, check off ROADMAP-v2_1.md.
After architecture changes: also systemPatterns.md and techContext.md.
After product-scope changes: also projectbrief.md and productContext.md.

After 2-20, wait for my review.
