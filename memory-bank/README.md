# Memory Bank — Spark Tutor

This folder stores persistent project context for AI-assisted development.
Read all files at the start of every new session to restore full project context.

---

## File Purposes

### projectbrief.md
- Foundation document that shapes all other files
- Created at project start if it doesn't exist
- Defines core requirements and goals
- Source of truth for project scope

### productContext.md
- Why this project exists
- Problems it solves
- How it should work
- User experience goals

### activeContext.md
- Current work focus
- Recent changes
- Next steps
- Active decisions and considerations

### systemPatterns.md
- System architecture
- Key technical decisions
- Design patterns in use
- Component relationships

### techContext.md
- Technologies used
- Development setup
- Technical constraints
- Dependencies

### progress.md
- What works
- What's left to build
- Current status
- Known issues

---

## How to Use

**At the start of a new session:** Say "read the memory bank" — the AI will read all 6 files and restore full context before doing any work.

**After completing a PR:** Update `activeContext.md` (current focus, next steps) and `progress.md` (mark PR done, update what works/what's left).

**After a major architectural decision:** Update `systemPatterns.md` and/or `techContext.md` to reflect the change.
