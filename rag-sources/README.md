# RAG Source Documents — Spark Tutor

This folder holds K–1 curriculum documents used to build the RAG (Retrieval-Augmented Generation) index for Spark Tutor. All documents are **local-only** and excluded from git (see `/.gitignore`). Only this README is committed.

---

## How to Re-Download

If you clone the repo and need to rebuild the local source files, run the PowerShell commands in the "Download Commands" section at the bottom of this file.

---

## Math Sources (`/math/`)

All EngageNY math documents are published by the New York State Education Department and archived on the Internet Archive. License: **CC BY-NC-SA 3.0**. See [NYSED EngageNY archive notice](https://www.nysed.gov/standards-instruction/standards-resources-and-supports).

| File | Description | Source | License |
|---|---|---|---|
| `common-core-math-standards-k12.pdf` | Common Core State Standards for Mathematics — full K–12 document (Kindergarten pp. 9–12, Grade 1 pp. 13–16) | [corestandards.org](https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf) | Public domain |
| `engageny-math-kindergarten-m1-topic-a-overview.pdf` | EngageNY Kindergarten Math Module 1 — Topic A: Attributes of Two Related Objects (counting, comparison) | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-kindergarten-m1-topic-b-overview.pdf` | EngageNY Kindergarten Math Module 1 — Topic B: Classify to Make Categories and Count | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-kindergarten-m1-topic-d-overview.pdf` | EngageNY Kindergarten Math Module 1 — Topic D: The Concept of Zero and Working with Numbers 0–5 | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-kindergarten-m1-topic-e-overview.pdf` | EngageNY Kindergarten Math Module 1 — Topic E: Working with Numbers 6–8 in Different Configurations | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-kindergarten-m1-topic-f-overview.pdf` | EngageNY Kindergarten Math Module 1 — Topic F: Working with Numbers 9–10 in Different Configurations | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-grade1-m1-topic-a-lesson1.pdf` | EngageNY Grade 1 Math Module 1 — Topic A, Lesson 1: Counting and cardinality foundations | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-grade1-m1-topic-b-lesson4.pdf` | EngageNY Grade 1 Math Module 1 — Topic B, Lesson 4: Addition and subtraction strategies | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |
| `engageny-math-grade1-m2-topic-a-lesson1.pdf` | EngageNY Grade 1 Math Module 2 — Topic A, Lesson 1: Introduction to addition within 20 | [archive.org / engageny-mathematics](https://archive.org/details/engageny-mathematics) | CC BY-NC-SA 3.0 |

**Total math documents:** 9

> **Note on CK-12:** The ROADMAP originally specified CK-12 as the math source. CK-12 FlexBook PDFs require a registered account to download (no direct URL available). EngageNY is used instead — it is CC-licensed, OER, and directly aligned to the same Common Core K–1 standards.

---

## Reading / ELA Sources (`/reading/`)

All CKLA (Core Knowledge Language Arts) documents are published by the New York State Education Department via EngageNY and archived on the Internet Archive. License: **CC BY-NC-SA 3.0**.

| File | Description | Source | License |
|---|---|---|---|
| `common-core-ela-standards-k12.pdf` | Common Core State Standards for ELA & Literacy — full K–12 document (K–1 standards throughout) | [corestandards.org](https://www.corestandards.org/wp-content/uploads/2023/09/ADA-Compliant-ELA-Standards.pdf) | Public domain |
| `ckla-kg-d1-nursery-rhymes-instructional-companion.pdf` | CKLA Kindergarten — Domain 1: Nursery Rhymes & Fables — Instructional Companion (read-aloud guide, listening comprehension) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-kg-d2-five-senses-instructional-companion.pdf` | CKLA Kindergarten — Domain 2: The Five Senses — Instructional Companion (vocabulary, comprehension, oral language) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-kg-skills-unit1-teacher-guide.pdf` | CKLA Kindergarten — Skills Strand Unit 1 Teacher Guide (phonemic awareness, letter knowledge, decoding) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-listening-learning-scope-sequence.pdf` | CKLA Grade 1 — Listening & Learning Strand Scope and Sequence (full-year overview of domains and standards) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-ccss-unit-alignment.pdf` | CKLA Grade 1 — CCSS Unit-by-Unit Alignment guide (maps every unit to ELA Common Core standards) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-d1-fables-stories-instructional-companion.pdf` | CKLA Grade 1 — Domain 1: Fables & Stories — Instructional Companion (story elements, vocabulary, text structure) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-d2-human-body-instructional-companion.pdf` | CKLA Grade 1 — Domain 2: The Human Body — Instructional Companion (informational text, science vocabulary) | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |

**Total reading/ELA documents:** 8

---

## License Summary

| License | Documents | Terms |
|---|---|---|
| Public domain | 2 (Common Core Math + ELA standards) | No restrictions — free to use, reproduce, distribute |
| CC BY-NC-SA 3.0 | 15 (all EngageNY / CKLA materials) | Free to use and adapt with attribution; non-commercial; share alike |

All documents are Open Educational Resources (OER). None are proprietary. No copyright restrictions affect our use for this educational application.

---

## Download Commands (PowerShell — Windows)

Run from the `spark-tutor/` project root to re-download all source files:

```powershell
# ── Math: Common Core Standards ────────────────────────────────────────────────
Invoke-WebRequest -Uri "https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf" `
  -OutFile "rag-sources\math\common-core-math-standards-k12.pdf" -UseBasicParsing

# ── Math: EngageNY Kindergarten Module 1 topic overviews ───────────────────────
$kgm1 = "https://archive.org/download/engageny-mathematics/Kindergarten%20Module%201.zip/Module%201/Math%20GK-M1%20Lessons"
Invoke-WebRequest -Uri "$kgm1/Math-GK-M1-Topic-A-Lessons-1-3/math-gk-m1-topic-a-overview-accessible.pdf" `
  -OutFile "rag-sources\math\engageny-math-kindergarten-m1-topic-a-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$kgm1/Math-GK-M1-Topic-B-Lessons-4-6/math-gk-m1-topic-b-overview-accessible.pdf" `
  -OutFile "rag-sources\math\engageny-math-kindergarten-m1-topic-b-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$kgm1/Math-GK-M1-Topic-D-Lessons-12-16/math-gk-m1-topic-d-overview-accessible.pdf" `
  -OutFile "rag-sources\math\engageny-math-kindergarten-m1-topic-d-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$kgm1/Math-GK-M1-Topic-E-Lessons-17-22/math-gk-m1-topic-e-overview-accessible.pdf" `
  -OutFile "rag-sources\math\engageny-math-kindergarten-m1-topic-e-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$kgm1/Math-GK-M1-Topic-F-Lessons-23-28/math-gk-m1-topic-f-overview-accessible.pdf" `
  -OutFile "rag-sources\math\engageny-math-kindergarten-m1-topic-f-overview.pdf" -UseBasicParsing

# ── Math: EngageNY Grade 1 lesson PDFs ─────────────────────────────────────────
$g1m1 = "https://archive.org/download/engageny-mathematics/Grade%201%20Module%201.zip/Module%201/Math%20G1-M1%20Lessons"
Invoke-WebRequest -Uri "$g1m1/Math-G1-M1-Topic-A-Lessons-1-3/math-g1-m1-topic-a-lesson-1.pdf" `
  -OutFile "rag-sources\math\engageny-math-grade1-m1-topic-a-lesson1.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g1m1/Math-G1-M1-Topic-B-Lessons-4-8/math-g1-m1-topic-b-lesson-4.pdf" `
  -OutFile "rag-sources\math\engageny-math-grade1-m1-topic-b-lesson4.pdf" -UseBasicParsing
$g1m2 = "https://archive.org/download/engageny-mathematics/Grade%201%20Module%202.zip/Module%202/Math%20G1-M2%20Lessons"
Invoke-WebRequest -Uri "$g1m2/Math-G1-M2-Topic-A-Lessons-1-11/math-g1-m2-topic-a-lesson-1.pdf" `
  -OutFile "rag-sources\math\engageny-math-grade1-m2-topic-a-lesson1.pdf" -UseBasicParsing

# ── Reading: Common Core ELA Standards ─────────────────────────────────────────
Invoke-WebRequest -Uri "https://www.corestandards.org/wp-content/uploads/2023/09/ADA-Compliant-ELA-Standards.pdf" `
  -OutFile "rag-sources\reading\common-core-ela-standards-k12.pdf" -UseBasicParsing

# ── Reading: CKLA Kindergarten ─────────────────────────────────────────────────
$kgll = "https://archive.org/download/engageny-ela-archive/ELA/Kindergarten/Listening%20%26%20Learning.zip/Listening%20%26%20Learning"
Invoke-WebRequest -Uri "$kgll/D1%20-%20Nursery%20Rhymes%20and%20Fables/CKLA-GK-D1-IC.pdf" `
  -OutFile "rag-sources\reading\ckla-kg-d1-nursery-rhymes-instructional-companion.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$kgll/D2-The%20Five%20Senses/CKLA-GK-D2-IC.pdf" `
  -OutFile "rag-sources\reading\ckla-kg-d2-five-senses-instructional-companion.pdf" -UseBasicParsing
$kgsk = "https://archive.org/download/engageny-ela-archive/ELA/Kindergarten/Skills.zip/Skills"
Invoke-WebRequest -Uri "$kgsk/Unit%201/CKLA-GK-U1-TG.pdf" `
  -OutFile "rag-sources\reading\ckla-kg-skills-unit1-teacher-guide.pdf" -UseBasicParsing

# ── Reading: CKLA Grade 1 ───────────────────────────────────────────────────────
$g1ll = "https://archive.org/download/engageny-ela-archive/ELA/Grade%201/GradeOneListeningLearning.zip/Listening%20%26%20Learning"
Invoke-WebRequest -Uri "$g1ll/CKLA-G1-LL-Scope-and-Sequence.pdf" `
  -OutFile "rag-sources\reading\ckla-g1-listening-learning-scope-sequence.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g1ll/CKLA-CCSS-G1-Unit-By-Unit-Alignment.pdf" `
  -OutFile "rag-sources\reading\ckla-g1-ccss-unit-alignment.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g1ll/D1%20-%20Fables%20and%20Stories/CKLA-G1-D1-IC.pdf" `
  -OutFile "rag-sources\reading\ckla-g1-d1-fables-stories-instructional-companion.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g1ll/D2%20-%20The%20Human%20Body/CKLA-G1-D2-IC.pdf" `
  -OutFile "rag-sources\reading\ckla-g1-d2-human-body-instructional-companion.pdf" -UseBasicParsing
```
