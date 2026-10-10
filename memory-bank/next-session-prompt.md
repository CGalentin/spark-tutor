# Next session prompt — paste this into a new Cursor chat

PRs 2-01 through 2-21 are merged and pushed to `origin/dev`. PR 2-22 is committed on `feature/topic-suggestion-card` and is not merged and not pushed (10 Oct 2026). Do not redo 2-01 through 2-22. Do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked (that is PR 2-27, and it still needs an explicit yes).

On "continue": merge `feature/topic-suggestion-card` into local `dev` first (fast-forward), then start PR 2-23 only. Stop after 2-23 and wait again. Do not push unless asked.

Copy everything below the line.

---

I'm building Spark Tutor v2. Read the memory bank first: all files in memory-bank/ (including next-session-prompt.md), plus .cursorrules (in the parent TutorApp folder), CLAUDE.md, and ROADMAP-v2_1.md. Do not touch any code until those are read.

PRs 2-01 through 2-21 are complete and pushed to `origin/dev`. PR 2-22 is committed on `feature/topic-suggestion-card` and is not on `dev` yet. Do not redo them. If local `dev` and `origin/dev` do not match before the merge, stop and tell me. Do not force-push.

This is Sprint 4, the last sprint of v2 Phase 1. The parent should be able to see live mastery and approve the next topic from the dashboard, with no Postman. Do one PR at a time. After the user says "continue": merge 2-22 into local `dev`, then start PR 2-23 only. After 2-23: stop, summarize, and wait before merging or starting 2-24.

Sprint 4 map (do not skip ahead)

- 2-20 MasteryIndicator ring (`feature/mastery-indicator`) — done and pushed
- 2-21 LiveSessionPanel + useLiveSession (`feature/live-session-panel`) — done and pushed
- 2-22 TopicSuggestionCard + useLearningPath (`feature/topic-suggestion-card`) — committed, not merged, not pushed
- 2-23 LearningPathHistory timeline (`feature/learning-path-history`) — start here after the 2-22 merge
- 2-24 Session summary includes mastery (`feature/session-summary-v2`)
- 2-25 Rate limits: evaluate 60/hour, approve 20/hour, reject 20/hour (`feature/rate-limiting-v2`)
- 2-26 Final end-to-end test on `dev` (`test: final v2 phase 1 end-to-end test pass`)
- 2-27 Production deploy on `main` — only when I explicitly say to deploy. `vercel --prod`, then merge `dev` → `main`. Do not do this early.
- 2-28 README + CLAUDE.md (`feature/readme-v2`)

PR 2-22 is already built (do not redo)

`useLearningPath(subject)` in `src/hooks/useLearningPath.ts` listens with `subscribeToLearningPath`. It returns `{ learningPath, approveTopic, rejectTopic, isLoading, error }`. Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`. It does not import `src/lib/firebase/learningPath.ts`.

`TopicSuggestionCard` is above `LiveSessionPanel` for math and for reading. It shows only when `suggestedNextTopic` is set and `parentApproved` is false. It shows the current topic as the one just finished, the suggested next topic, and the evaluator's note. That note lives on the session evaluation that matches the current topic and the suggestion. The learning path document does not store `reasoning`. If no note matches, the card says the evaluator did not leave one. "Yes, start this next" approves. "Keep practicing current topic" rejects. The card hides immediately. If the save fails, it comes back with the error.

Browser check on 10 Oct 2026: a temporary Math suggestion of Shapes was written, then "Keep practicing current topic" was clicked. Reject returned 200 and cleared the suggestion. `parentApproved` was set back to true. "Yes, start this next" was not clicked. A short Math session named Buddy was started and ended so the chat input could be checked. No chat message was sent. The learning path was not reset.

PR 2-23 · Learning Path History

Branch: `feature/learning-path-history` off local `dev` after 2-22 is merged.

Create `/src/components/parent/LearningPathHistory.tsx`:

- Timeline of mastered topics with scores and dates
- Groups by subject (Math | Reading)
- Shows the current topic in progress with its live score
- Collapses to the last 5 entries by default, expandable to the full history
- Shadcn `Card`, `Badge`, and `Collapsible`. Do not edit files in `src/components/ui/`

Add it to the parent dashboard below session history.

- `npx tsc --noEmit`
- Commit: `feat(parent-ui): add learning path history timeline to parent dashboard`
- Check the parent dashboard in the browser: click the real control. Child chat must keep working.

What is already built (do not redo)

`MasteryIndicator` takes `topic` and `score`. Red 0–49 Building, yellow 50–89 Almost there, green 90–100 Mastered! using `MASTERED_SCORE` (90). The ring does not subscribe to Firestore. `LiveSessionPanel` mounts it.

`useLiveSession` reuses `subscribeToSessions` and keeps the newest session with no `endedAt`. `mastery` is the last `evaluations[]` score, or 0 before the first score. The live card is above session history. Empty copy is "No active session".

This parent still has older sessions that were never ended. The live card therefore shows Counting to 20, grade K, 4 messages, score 0, until a newer open session exists. Do not close those old sessions unless asked.

Tutoring grade is `@/constants` (`src/constants/gradeBands.ts`): `'K' | '1' | '2' | '3'`. RAG chunk grade is `@/types` (`src/types/rag.ts`): `'K' | '1' | 'K-1'`. Never mix them. `@/types` re-exports the RAG `GradeBand`. Import the tutoring one from `@/constants`.

`MASTERED_SCORE` is 90. `mastered` is true only when score >= 90. Evaluator rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered. Unreadable evaluator JSON falls back to score 0 / mastered false.

Topic map: `TOPIC_MAP` + `getTopics()` in `src/constants/topicMap.ts`. Math and reading, K–3. Science is a Phase 2 placeholder.

Firestore learning path: `users/{parentUID}/learningPath/{subject}`. Admin CRUD is `src/lib/firebase/learningPath.ts` — never import that file from a Client Component. Live reads: `subscribeToLearningPath` in `src/lib/firebase/firestore.ts`. Session live reads: `subscribeToSessions`.

Learning path fields: `currentGrade`, `currentTopic`, `topicsCompleted`, `masteryHistory` (each entry has topic, subject, grade, score, mastered, evaluatedAt), `suggestedNextTopic`, `parentApproved`, `parentApprovedAt`, `lastEvaluatedAt`. There is no reasoning field on the path. Reasoning is on session `evaluations[]`.

The test parent's math path (`users/7XQyNOHkgAPaNa9e4Fks9xTT4JP2/learningPath/math`) is on **Counting to 20**, grade K, with Counting to 10 in `topicsCompleted`. `suggestedNextTopic` is null and `parentApproved` is true. The latest mastery scores on Counting to 20 are 40 and 30 (an older Counting to 10 score of 100 is still in history), so the next Math chat uses the **easier** hint until two higher scores are saved. Do not reset that path unless I ask.

Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic`.

Production is still the v1 app at https://spark-tutor-app.vercel.app. Do not run `vercel --prod` unless I ask.

I am newer to coding. Explain what each piece does as you build it, in plain language.

Shell is PowerShell. Use `;` between commands. Do not use `&&`. For git commits, `git commit -m "message"` is fine.

Do not push unless I ask. Do not force-push.

Leave uncommitted `AGENTS.md`, `CLAUDE.md`, and `spark_tutor_build_bible_2.docx` alone. Do not commit them.

Parent UI changes must be checked in the browser before you call the PR done. Child chat must keep working.

After the PR: update `activeContext.md`, `progress.md`, check off `ROADMAP-v2_1.md`, and refresh `next-session-prompt.md`. Then stop and wait.
