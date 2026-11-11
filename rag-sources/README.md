# RAG Source Documents — Spark Tutor

This folder holds curriculum documents used to build the RAG (Retrieval-Augmented Generation) index for Spark Tutor. All PDF/DOCX/ZIP files are **local-only** and excluded from git (see `/.gitignore`). Only this README is committed.

Folder layout:

```
rag-sources/
  math/                  ← K–1 sources (flat)
  math/grade-2/          ← Grade 2 Math
  math/grade-3/          ← Grade 3 Math
  reading/               ← K–1 sources (flat)
  reading/grade-2/       ← Grade 2 Reading/ELA
  reading/grade-3/       ← Grade 3 Reading/ELA
  science/k-1/           ← Science Kindergarten + Grade 1
  science/grade-2/       ← Grade 2 Science
  science/grade-3/       ← Grade 3 Science
```

---

## How to Re-Download

If you clone the repo and need to rebuild the local source files, run the PowerShell commands in the "Download Commands" section at the bottom of this file.

---

## Math Sources (`/math/`) — K–1

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

**Total K–1 math documents:** 9

> **Note on CK-12:** The ROADMAP originally specified CK-12 as the math source. CK-12 FlexBook PDFs require a registered account to download (no direct URL available). EngageNY is used instead — it is CC-licensed, OER, and directly aligned to the same Common Core standards. Sprint 3 also lists EngageNY as an accepted source.

---

## Math Sources (`/math/grade-2/`) — Grade 2

Addition/subtraction to 100, place value, intro fractions. License: **CC BY-NC-SA 3.0** (EngageNY).

| File | Description | Source | License |
|---|---|---|---|
| `engageny-math-grade2-m1-topic-a-overview.pdf` | Grade 2 Module 1 Topic A — sums and differences foundations | [archive.org Grade 2 Module 1](https://archive.org/download/engageny-mathematics/Grade%202%20Module%201.zip/) | CC BY-NC-SA 3.0 |
| `engageny-math-grade2-m1-topic-b-overview.pdf` | Grade 2 Module 1 Topic B — addition and subtraction to 100 | same | CC BY-NC-SA 3.0 |
| `engageny-math-grade2-m3-topic-a-overview.pdf` | Grade 2 Module 3 Topic A — place value foundations | [archive.org Grade 2 Module 3](https://archive.org/download/engageny-mathematics/Grade%202%20Module%203.zip/) | CC BY-NC-SA 3.0 |
| `engageny-math-grade2-m3-topic-c-overview.pdf` | Grade 2 Module 3 Topic C — place value / comparing numbers | same | CC BY-NC-SA 3.0 |
| `engageny-math-grade2-m8-module-overview.pdf` | Grade 2 Module 8 overview — time, shapes, fractions as equal parts | [archive.org Grade 2 Module 8](https://archive.org/download/engageny-mathematics/Grade%202%20Module%208.zip/) | CC BY-NC-SA 3.0 |
| `engageny-math-grade2-m8-topic-d-overview.pdf` | Grade 2 Module 8 Topic D — fractions as equal parts of shapes | same | CC BY-NC-SA 3.0 |

**Total Grade 2 math documents:** 6

---

## Math Sources (`/math/grade-3/`) — Grade 3

Multiplication, division, fractions, area and perimeter. License: **CC BY-NC-SA 3.0** (EngageNY).

| File | Description | Source | License |
|---|---|---|---|
| `engageny-math-grade3-m1-topic-a-overview.pdf` | Grade 3 Module 1 Topic A — multiplication and division foundations | [archive.org Grade 3 Module 1](https://archive.org/download/engageny-mathematics/Grade%203%20Module%201.zip/) | CC BY-NC-SA 3.0 |
| `engageny-math-grade3-m1-topic-c-overview.pdf` | Grade 3 Module 1 Topic C — multiplication and division problem solving | same | CC BY-NC-SA 3.0 |
| `engageny-math-grade3-m4-module-overview.pdf` | Grade 3 Module 4 overview — multiplication and area | [archive.org Grade 3 Module 4](https://archive.org/download/engageny-mathematics/Grade%203%20Module%204.zip/) | CC BY-NC-SA 3.0 |
| `engageny-math-grade3-m4-topic-a-lesson-1.pdf` | Grade 3 Module 4 Topic A Lesson 1 — area concepts | same | CC BY-NC-SA 3.0 |
| `engageny-math-grade3-m5-module-overview.pdf` | Grade 3 Module 5 overview — fractions on the number line | [archive.org Grade 3 Module 5](https://archive.org/download/engageny-mathematics/Grade%203%20Module%205.zip/) | CC BY-NC-SA 3.0 |
| `engageny-math-grade3-m5-topic-a-overview.pdf` | Grade 3 Module 5 Topic A — partition a whole into equal parts | same | CC BY-NC-SA 3.0 |

**Total Grade 3 math documents:** 6

---

## Reading / ELA Sources (`/reading/`) — K–1

All CKLA (Core Knowledge Language Arts) documents are published by the New York State Education Department via EngageNY and archived on the Internet Archive. License: **CC BY-NC-SA 3.0**.

| File | Description | Source | License |
|---|---|---|---|
| `common-core-ela-standards-k12.pdf` | Common Core State Standards for ELA & Literacy — full K–12 document (K–1 standards throughout) | [corestandards.org](https://www.corestandards.org/wp-content/uploads/2023/09/ADA-Compliant-ELA-Standards.pdf) | Public domain |
| `ckla-kg-d1-nursery-rhymes-instructional-companion.pdf` | CKLA Kindergarten — Domain 1: Nursery Rhymes & Fables — Instructional Companion | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-kg-d2-five-senses-instructional-companion.pdf` | CKLA Kindergarten — Domain 2: The Five Senses — Instructional Companion | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-kg-skills-unit1-teacher-guide.pdf` | CKLA Kindergarten — Skills Strand Unit 1 Teacher Guide | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-listening-learning-scope-sequence.pdf` | CKLA Grade 1 — Listening & Learning Strand Scope and Sequence | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-ccss-unit-alignment.pdf` | CKLA Grade 1 — CCSS Unit-by-Unit Alignment guide | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-d1-fables-stories-instructional-companion.pdf` | CKLA Grade 1 — Domain 1: Fables & Stories — Instructional Companion | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |
| `ckla-g1-d2-human-body-instructional-companion.pdf` | CKLA Grade 1 — Domain 2: The Human Body — Instructional Companion | [archive.org / engageny-ela-archive](https://archive.org/details/engageny-ela-archive) | CC BY-NC-SA 3.0 |

**Total K–1 reading/ELA documents:** 8

---

## Reading / ELA Sources (`/reading/grade-2/`) — Grade 2

Comprehension, context clues, compare/contrast, nonfiction. License: **CC BY-NC-SA 3.0** (Core Knowledge CKLA free downloads).

| File | Description | Source | License |
|---|---|---|---|
| `ckla-grade2-unit2-teacher-guide.pdf` | Grade 2 Skills Unit 2 Teacher Guide — decoding review, narrative/opinion writing | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U2_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade2-unit3-teacher-guide.pdf` | Grade 2 Skills Unit 3 Teacher Guide — informational text comprehension | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U3_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade2-unit4-teacher-guide.pdf` | Grade 2 Skills Unit 4 Teacher Guide — reading skills continuation | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U4_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade2-unit5-teacher-guide.pdf` | Grade 2 Skills Unit 5 Teacher Guide | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U5_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade2-unit6-teacher-guide.pdf` | Grade 2 Skills Unit 6 Teacher Guide | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U6_TG_web.pdf) | CC BY-NC-SA 3.0 |

**Total Grade 2 reading documents:** 5

---

## Reading / ELA Sources (`/reading/grade-3/`) — Grade 3

Inference, text evidence, literary devices, summary. License: **CC BY-NC-SA 3.0** (Core Knowledge CKLA free downloads).

| File | Description | Source | License |
|---|---|---|---|
| `ckla-grade3-unit1-teacher-guide.pdf` | Grade 3 Unit 1 — Classic Tales (text evidence, story structure) | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U1_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade3-unit3-teacher-guide.pdf` | Grade 3 Unit 3 — Human Body / informational text | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U3_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade3-unit4-teacher-guide.pdf` | Grade 3 Unit 4 — Ancient Rome (inference, text evidence) | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U4_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade3-unit7-teacher-guide.pdf` | Grade 3 Unit 7 — Astronomy (summary / research writing) | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U7_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade3-unit8-teacher-guide.pdf` | Grade 3 Unit 8 — Native Americans (literary / informational skills) | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U8_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade3-unit9-teacher-guide.pdf` | Grade 3 Unit 9 — European Exploration | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U9_TG_web.pdf) | CC BY-NC-SA 3.0 |
| `ckla-grade3-unit10-teacher-guide.pdf` | Grade 3 Unit 10 — Colonial America | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U10_TG_web.pdf) | CC BY-NC-SA 3.0 |

**Total Grade 3 reading documents:** 7

---

## Science Sources (`/science/k-1/`) — Kindergarten + Grade 1

Living things, weather, human body, animals, plants, earth and sky. License: **CC BY-NC-SA 4.0** (Core Knowledge Science / CKSci free Teacher Guides).

| File | Description | Source | License |
|---|---|---|---|
| `cksci-k-pushes-and-pulls.pdf` | Kindergarten Unit 1 — Pushes and Pulls | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/06/CKSci_GKU1_Pushes-and-Pulls_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-k-needs-of-plants-and-animals.pdf` | Kindergarten Unit 2 — Needs of Plants and Animals | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_GKU2_TG_Web.pdf) | CC BY-NC-SA 4.0 |
| `cksci-k-weather-patterns.pdf` | Kindergarten Unit 4 — Weather Patterns | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_GKU4_Weather-Patterns_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade1-sun-moon-and-stars.pdf` | Grade 1 Unit 1 — Sun, Moon, and Stars | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_G1U1_Sun-Moon-and-Stars_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade1-plant-and-animal-survival.pdf` | Grade 1 Unit 2 — Plant and Animal Survival | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/06/CKSci_G1U2_Plant-and-Animal-Survival_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade1-human-body-systems.pdf` | Grade 1 Unit 5 — Human Body Systems | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/12/CKSci_G1U5_Human-Body-Systems_TG.pdf) | CC BY-NC-SA 4.0 |

**Total K–1 science documents:** 6

---

## Science Sources (`/science/grade-2/`) — Grade 2

Same topics at increasing depth (matter, habitats, land/water, body systems, energy). License: **CC BY-NC-SA 4.0** (CKSci).

| File | Description | Source | License |
|---|---|---|---|
| `cksci-grade2-properties-of-matter.pdf` | Grade 2 Unit 1 — Properties of Matter | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/06/CKSci_G2U1_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade2-organisms-and-habitats.pdf` | Grade 2 Unit 2 — Organisms and Their Habitats | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_G2U2_Organisms-and-Their-Habitats_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade2-exploring-land-and-water.pdf` | Grade 2 Unit 3 — Exploring Land and Water | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_G2U3_Exploring-Land-and-Water_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade2-electricity-and-magnetism.pdf` | Grade 2 Unit 4 — Electricity and Magnetism | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/12/CKSci_G2U4_Electricity-and-Magnetism_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade2-human-cells-and-digestion.pdf` | Grade 2 Unit 5 — Human Cells and Digestion | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2020/12/CKSci_G2U5_Human-Cells-and-Digestion_TG.pdf) | CC BY-NC-SA 4.0 |

**Total Grade 2 science documents:** 5

---

## Science Sources (`/science/grade-3/`) — Grade 3

Forces, life cycles, habitats, weather/climate. License: **CC BY-NC-SA 4.0** (CKSci).

| File | Description | Source | License |
|---|---|---|---|
| `cksci-grade3-investigating-forces.pdf` | Grade 3 Unit 1 — Investigating Forces | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U1_Investigating-Forces_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade3-life-cycles-traits.pdf` | Grade 3 Unit 2 — Life Cycles, Traits, and Variations | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U2_LifeCycles_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade3-habitats-and-change.pdf` | Grade 3 Unit 3 — Habitats and Change | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U3_Habitats_TG.pdf) | CC BY-NC-SA 4.0 |
| `cksci-grade3-weather-and-climate-reader.pdf` | Grade 3 Unit 4 — Weather and Climate Student Reader (TG PDF not published at a stable direct URL; reader is CC-licensed) | [coreknowledge.org](https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U4WeatherClimate_SR.pdf) | CC BY-NC-SA 4.0 |

**Total Grade 3 science documents:** 4

---

## License Summary

| License | Documents | Terms |
|---|---|---|
| Public domain | 2 (Common Core Math + ELA standards) | No restrictions — free to use, reproduce, distribute |
| CC BY-NC-SA 3.0 | K–1 EngageNY/CKLA + Grade 2–3 Math EngageNY + Grade 2–3 Reading CKLA | Free to use and adapt with attribution; non-commercial; share alike |
| CC BY-NC-SA 4.0 | All CKSci science Teacher Guides / reader | Free to use and adapt with attribution; non-commercial; share alike |

All documents are Open Educational Resources (OER). None are proprietary. No copyright restrictions affect our use for this educational application. Every file below was confirmed CC-licensed or public domain before download.

**New Phase 2 totals (local only, not ingested yet):**

| Folder | Count |
|---|---|
| `math/grade-2` | 6 |
| `math/grade-3` | 6 |
| `reading/grade-2` | 5 |
| `reading/grade-3` | 7 |
| `science/k-1` | 6 |
| `science/grade-2` | 5 |
| `science/grade-3` | 4 |
| **New sources total** | **39** |

Do **not** ingest these into Firestore until PR 3-15 / later Sprint 3 PRs. Do **not** change `TOPIC_MAP` or add a Science subject button in this PR.

---

## Download Commands (PowerShell — Windows)

Run from the `spark-tutor/` project root to re-download all source files:

```powershell
# ── Folders (safe to re-run) ───────────────────────────────────────────────────
New-Item -ItemType Directory -Force -Path @(
  'rag-sources\math\grade-2',
  'rag-sources\math\grade-3',
  'rag-sources\reading\grade-2',
  'rag-sources\reading\grade-3',
  'rag-sources\science\k-1',
  'rag-sources\science\grade-2',
  'rag-sources\science\grade-3'
) | Out-Null

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

# ── Math: EngageNY Grade 2 ─────────────────────────────────────────────────────
$g2m1 = "https://archive.org/download/engageny-mathematics/Grade%202%20Module%201.zip/Module%201/Math%20G2-M1%20Lessons"
Invoke-WebRequest -Uri "$g2m1/Math-G2-M1-Topic-A-Lessons-1-2/math-g2-m1-topic-a-overview.pdf" `
  -OutFile "rag-sources\math\grade-2\engageny-math-grade2-m1-topic-a-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g2m1/Math-G2-M1-Topic-B-Lessons-3-8/math-g2-m1-topic-b-overview.pdf" `
  -OutFile "rag-sources\math\grade-2\engageny-math-grade2-m1-topic-b-overview.pdf" -UseBasicParsing
$g2m3 = "https://archive.org/download/engageny-mathematics/Grade%202%20Module%203.zip/Module%203/Math%20G2-M3%20Lessons"
Invoke-WebRequest -Uri "$g2m3/Math-G2-M3-Topic-A-Lesson-1/math-g2-m3-topic-a-overview.pdf" `
  -OutFile "rag-sources\math\grade-2\engageny-math-grade2-m3-topic-a-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g2m3/Math-G2-M3-Topic-C-Lessons-4-7/math-g2-m3-topic-c-overview.pdf" `
  -OutFile "rag-sources\math\grade-2\engageny-math-grade2-m3-topic-c-overview.pdf" -UseBasicParsing
$g2m8 = "https://archive.org/download/engageny-mathematics/Grade%202%20Module%208.zip/Module%208"
Invoke-WebRequest -Uri "$g2m8/Math%20G2-M8%20Lessons/math-g2-m8-topic-d-lessons-13-16/math-g2-m8-topic-d-overview.pdf" `
  -OutFile "rag-sources\math\grade-2\engageny-math-grade2-m8-topic-d-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g2m8/Math%20G2-M8%20Module%20Overview/math-g2-m8-module-overview.pdf" `
  -OutFile "rag-sources\math\grade-2\engageny-math-grade2-m8-module-overview.pdf" -UseBasicParsing

# ── Math: EngageNY Grade 3 ─────────────────────────────────────────────────────
$g3m1 = "https://archive.org/download/engageny-mathematics/Grade%203%20Module%201.zip/Module%201/Math%20G3-M1%20Lessons"
Invoke-WebRequest -Uri "$g3m1/Math-G3-M1-Topic-A-Lessons-1-3/math-g3-m1-topic-a-overview.pdf" `
  -OutFile "rag-sources\math\grade-3\engageny-math-grade3-m1-topic-a-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g3m1/Math-G3-M1-Topic-C-Lessons-7-10/math-g3-m1-topic-c-overview.pdf" `
  -OutFile "rag-sources\math\grade-3\engageny-math-grade3-m1-topic-c-overview.pdf" -UseBasicParsing
$g3m4 = "https://archive.org/download/engageny-mathematics/Grade%203%20Module%204.zip/Module%204"
Invoke-WebRequest -Uri "$g3m4/Math%20G3-M4%20Lessons/math-g3-m4-topic-a-lessons-1-4/math-g3-m4-topic-a-lesson-1.pdf" `
  -OutFile "rag-sources\math\grade-3\engageny-math-grade3-m4-topic-a-lesson-1.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g3m4/Math%20G3-M4%20Module%20Overview/math-g3-m4-module-overview.pdf" `
  -OutFile "rag-sources\math\grade-3\engageny-math-grade3-m4-module-overview.pdf" -UseBasicParsing
$g3m5 = "https://archive.org/download/engageny-mathematics/Grade%203%20Module%205.zip/Module%205"
Invoke-WebRequest -Uri "$g3m5/Math%20G3-M5%20Lessons/math-g3-m5-topic-a-lessons-1-4/math-g3-m5-topic-a-overview.pdf" `
  -OutFile "rag-sources\math\grade-3\engageny-math-grade3-m5-topic-a-overview.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "$g3m5/Math%20G3-M5%20Module%20Overview/math-g3-m5-module-overview.pdf" `
  -OutFile "rag-sources\math\grade-3\engageny-math-grade3-m5-module-overview.pdf" -UseBasicParsing

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

# ── Reading: CKLA Grade 2 (Core Knowledge free downloads) ──────────────────────
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U2_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-2\ckla-grade2-unit2-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U3_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-2\ckla-grade2-unit3-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U4_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-2\ckla-grade2-unit4-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U5_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-2\ckla-grade2-unit5-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G2_U6_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-2\ckla-grade2-unit6-teacher-guide.pdf" -UseBasicParsing

# ── Reading: CKLA Grade 3 (Core Knowledge free downloads) ──────────────────────
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U1_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit1-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U3_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit3-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U4_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit4-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U7_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit7-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U8_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit8-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U9_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit9-teacher-guide.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G3_U10_TG_web.pdf" `
  -OutFile "rag-sources\reading\grade-3\ckla-grade3-unit10-teacher-guide.pdf" -UseBasicParsing

# ── Science: CKSci K–1 ─────────────────────────────────────────────────────────
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/06/CKSci_GKU1_Pushes-and-Pulls_TG.pdf" `
  -OutFile "rag-sources\science\k-1\cksci-k-pushes-and-pulls.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_GKU2_TG_Web.pdf" `
  -OutFile "rag-sources\science\k-1\cksci-k-needs-of-plants-and-animals.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_GKU4_Weather-Patterns_TG.pdf" `
  -OutFile "rag-sources\science\k-1\cksci-k-weather-patterns.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_G1U1_Sun-Moon-and-Stars_TG.pdf" `
  -OutFile "rag-sources\science\k-1\cksci-grade1-sun-moon-and-stars.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/06/CKSci_G1U2_Plant-and-Animal-Survival_TG.pdf" `
  -OutFile "rag-sources\science\k-1\cksci-grade1-plant-and-animal-survival.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/12/CKSci_G1U5_Human-Body-Systems_TG.pdf" `
  -OutFile "rag-sources\science\k-1\cksci-grade1-human-body-systems.pdf" -UseBasicParsing

# ── Science: CKSci Grade 2 ─────────────────────────────────────────────────────
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/06/CKSci_G2U1_TG.pdf" `
  -OutFile "rag-sources\science\grade-2\cksci-grade2-properties-of-matter.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_G2U2_Organisms-and-Their-Habitats_TG.pdf" `
  -OutFile "rag-sources\science\grade-2\cksci-grade2-organisms-and-habitats.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/07/CKSci_G2U3_Exploring-Land-and-Water_TG.pdf" `
  -OutFile "rag-sources\science\grade-2\cksci-grade2-exploring-land-and-water.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/12/CKSci_G2U4_Electricity-and-Magnetism_TG.pdf" `
  -OutFile "rag-sources\science\grade-2\cksci-grade2-electricity-and-magnetism.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2020/12/CKSci_G2U5_Human-Cells-and-Digestion_TG.pdf" `
  -OutFile "rag-sources\science\grade-2\cksci-grade2-human-cells-and-digestion.pdf" -UseBasicParsing

# ── Science: CKSci Grade 3 ─────────────────────────────────────────────────────
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U1_Investigating-Forces_TG.pdf" `
  -OutFile "rag-sources\science\grade-3\cksci-grade3-investigating-forces.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U2_LifeCycles_TG.pdf" `
  -OutFile "rag-sources\science\grade-3\cksci-grade3-life-cycles-traits.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U3_Habitats_TG.pdf" `
  -OutFile "rag-sources\science\grade-3\cksci-grade3-habitats-and-change.pdf" -UseBasicParsing
Invoke-WebRequest -Uri "https://www.coreknowledge.org/wp-content/uploads/2019/09/CKSci_G3_U4WeatherClimate_SR.pdf" `
  -OutFile "rag-sources\science\grade-3\cksci-grade3-weather-and-climate-reader.pdf" -UseBasicParsing
```
