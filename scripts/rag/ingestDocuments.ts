// Document ingestion pipeline for Spark Tutor RAG.
// Reads PDFs from rag-sources/, chunks them, embeds each chunk with Gemini,
// and saves chunks + embeddings to Firestore curriculum_chunks collection.
//
// Usage (from project root):
//   npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject math
//   npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject reading
//   npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject math --grade 2
//   npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject reading --grade 3
//   npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject all

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local before importing any modules that read env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import { chunkDocument } from './chunkDocument';
import { embedText } from '../../src/lib/gemini/embed';
import { saveChunk, chunkExists, countChunks } from '../../src/lib/firebase/vectorSearch';
import type { GradeBand } from '../../src/types/rag';
import type { Subject } from '../../src/types/session';

// ─── Source manifest ──────────────────────────────────────────────────────────

/** Describes a single source PDF and how to tag its chunks. */
interface SourceDoc {
  fileName: string;
  subject: Subject;
  gradeBand: GradeBand;
  topic: string;
}

/** Grades the CLI --grade flag may select (K-1 flat folders use no --grade). */
type IngestGrade = '2' | '3';

const MATH_SOURCES_K1: SourceDoc[] = [
  {
    fileName: 'common-core-math-standards-k12.pdf',
    subject: 'math',
    gradeBand: 'K-1',
    topic: 'K-1 math standards overview',
  },
  {
    fileName: 'engageny-math-kindergarten-m1-topic-a-overview.pdf',
    subject: 'math',
    gradeBand: 'K',
    topic: 'Kindergarten counting and cardinality',
  },
  {
    fileName: 'engageny-math-kindergarten-m1-topic-b-overview.pdf',
    subject: 'math',
    gradeBand: 'K',
    topic: 'Kindergarten counting to 10',
  },
  {
    fileName: 'engageny-math-kindergarten-m1-topic-d-overview.pdf',
    subject: 'math',
    gradeBand: 'K',
    topic: 'Kindergarten comparison of numbers to 5',
  },
  {
    fileName: 'engageny-math-kindergarten-m1-topic-e-overview.pdf',
    subject: 'math',
    gradeBand: 'K',
    topic: 'Kindergarten addition and subtraction within 5',
  },
  {
    fileName: 'engageny-math-kindergarten-m1-topic-f-overview.pdf',
    subject: 'math',
    gradeBand: 'K',
    topic: 'Kindergarten numbers 6 to 10',
  },
  {
    fileName: 'engageny-math-grade1-m1-topic-a-lesson1.pdf',
    subject: 'math',
    gradeBand: '1',
    topic: 'Grade 1 sums and differences to 10',
  },
  {
    fileName: 'engageny-math-grade1-m1-topic-b-lesson4.pdf',
    subject: 'math',
    gradeBand: '1',
    topic: 'Grade 1 addition facts strategies',
  },
  {
    fileName: 'engageny-math-grade1-m2-topic-a-lesson1.pdf',
    subject: 'math',
    gradeBand: '1',
    topic: 'Grade 1 introduction to place value',
  },
];

const MATH_SOURCES_GRADE_2: SourceDoc[] = [
  {
    fileName: 'engageny-math-grade2-m1-topic-a-overview.pdf',
    subject: 'math',
    gradeBand: '2',
    topic: 'Grade 2 sums and differences foundations',
  },
  {
    fileName: 'engageny-math-grade2-m1-topic-b-overview.pdf',
    subject: 'math',
    gradeBand: '2',
    topic: 'Grade 2 addition and subtraction to 100',
  },
  {
    fileName: 'engageny-math-grade2-m3-topic-a-overview.pdf',
    subject: 'math',
    gradeBand: '2',
    topic: 'Grade 2 place value foundations',
  },
  {
    fileName: 'engageny-math-grade2-m3-topic-c-overview.pdf',
    subject: 'math',
    gradeBand: '2',
    topic: 'Grade 2 place value and comparing numbers',
  },
  {
    fileName: 'engageny-math-grade2-m8-module-overview.pdf',
    subject: 'math',
    gradeBand: '2',
    topic: 'Grade 2 time shapes and fractions overview',
  },
  {
    fileName: 'engageny-math-grade2-m8-topic-d-overview.pdf',
    subject: 'math',
    gradeBand: '2',
    topic: 'Grade 2 fractions as equal parts of shapes',
  },
];

const MATH_SOURCES_GRADE_3: SourceDoc[] = [
  {
    fileName: 'engageny-math-grade3-m1-topic-a-overview.pdf',
    subject: 'math',
    gradeBand: '3',
    topic: 'Grade 3 multiplication and division foundations',
  },
  {
    fileName: 'engageny-math-grade3-m1-topic-c-overview.pdf',
    subject: 'math',
    gradeBand: '3',
    topic: 'Grade 3 multiplication and division problem solving',
  },
  {
    fileName: 'engageny-math-grade3-m4-module-overview.pdf',
    subject: 'math',
    gradeBand: '3',
    topic: 'Grade 3 multiplication and area overview',
  },
  {
    fileName: 'engageny-math-grade3-m4-topic-a-lesson-1.pdf',
    subject: 'math',
    gradeBand: '3',
    topic: 'Grade 3 area concepts',
  },
  {
    fileName: 'engageny-math-grade3-m5-module-overview.pdf',
    subject: 'math',
    gradeBand: '3',
    topic: 'Grade 3 fractions on the number line overview',
  },
  {
    fileName: 'engageny-math-grade3-m5-topic-a-overview.pdf',
    subject: 'math',
    gradeBand: '3',
    topic: 'Grade 3 partition a whole into equal parts',
  },
];

const READING_SOURCES_K1: SourceDoc[] = [
  {
    fileName: 'common-core-ela-standards-k12.pdf',
    subject: 'reading',
    gradeBand: 'K-1',
    topic: 'K-1 ELA standards overview',
  },
  {
    fileName: 'ckla-kg-skills-unit1-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: 'K',
    topic: 'Kindergarten phonics and early reading skills',
  },
  {
    fileName: 'ckla-kg-d1-nursery-rhymes-instructional-companion.pdf',
    subject: 'reading',
    gradeBand: 'K',
    topic: 'Kindergarten nursery rhymes and language arts',
  },
  {
    fileName: 'ckla-kg-d2-five-senses-instructional-companion.pdf',
    subject: 'reading',
    gradeBand: 'K',
    topic: 'Kindergarten five senses science and reading',
  },
  {
    fileName: 'ckla-g1-listening-learning-scope-sequence.pdf',
    subject: 'reading',
    gradeBand: '1',
    topic: 'Grade 1 listening and learning curriculum sequence',
  },
  {
    fileName: 'ckla-g1-ccss-unit-alignment.pdf',
    subject: 'reading',
    gradeBand: '1',
    topic: 'Grade 1 CCSS unit alignment',
  },
  {
    fileName: 'ckla-g1-d1-fables-stories-instructional-companion.pdf',
    subject: 'reading',
    gradeBand: '1',
    topic: 'Grade 1 fables and stories',
  },
  {
    fileName: 'ckla-g1-d2-human-body-instructional-companion.pdf',
    subject: 'reading',
    gradeBand: '1',
    topic: 'Grade 1 human body science and reading',
  },
];

const READING_SOURCES_GRADE_2: SourceDoc[] = [
  {
    fileName: 'ckla-grade2-unit2-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '2',
    topic: 'Grade 2 decoding review and narrative writing',
  },
  {
    fileName: 'ckla-grade2-unit3-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '2',
    topic: 'Grade 2 informational text comprehension',
  },
  {
    fileName: 'ckla-grade2-unit4-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '2',
    topic: 'Grade 2 reading skills continuation',
  },
  {
    fileName: 'ckla-grade2-unit5-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '2',
    topic: 'Grade 2 reading skills unit 5',
  },
  {
    fileName: 'ckla-grade2-unit6-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '2',
    topic: 'Grade 2 reading skills unit 6',
  },
];

const READING_SOURCES_GRADE_3: SourceDoc[] = [
  {
    fileName: 'ckla-grade3-unit1-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 classic tales text evidence and story structure',
  },
  {
    fileName: 'ckla-grade3-unit3-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 human body informational text',
  },
  {
    fileName: 'ckla-grade3-unit4-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 ancient Rome inference and text evidence',
  },
  {
    fileName: 'ckla-grade3-unit7-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 astronomy summary and research writing',
  },
  {
    fileName: 'ckla-grade3-unit8-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 Native Americans literary and informational skills',
  },
  {
    fileName: 'ckla-grade3-unit9-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 European exploration',
  },
  {
    fileName: 'ckla-grade3-unit10-teacher-guide.pdf',
    subject: 'reading',
    gradeBand: '3',
    topic: 'Grade 3 colonial America',
  },
];

// ─── Ingestion helpers ────────────────────────────────────────────────────────

/** Pauses execution for the given number of milliseconds — used to respect Gemini rate limits. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** True for transient network/quota blips that are worth retrying mid-ingest. */
function isRetryableError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes('UNAVAILABLE') ||
    message.includes('ETIMEDOUT') ||
    message.includes('ENETUNREACH') ||
    message.includes('ECONNRESET') ||
    message.includes('Too Many Requests') ||
    message.includes('429')
  );
}

/**
 * Retries an async call a few times with backoff for flaky network errors.
 * Lets long PDF runs survive a brief Firestore or Gemini blip.
 */
async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 5): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isRetryableError(err) || attempt === attempts) {
        throw err;
      }

      const waitMs = attempt * 2000;
      console.warn(`     ⏳ ${label} failed (attempt ${attempt}/${attempts}), retrying in ${waitMs}ms`);
      await sleep(waitMs);
    }
  }

  throw lastError;
}

/**
 * Ingests a single source document: chunks it, embeds each chunk, and saves to Firestore.
 * Skips chunks that already exist in Firestore to support re-runs without duplicate data.
 *
 * @param sourceDir - absolute path to the folder containing the PDF
 * @param doc       - metadata describing the document
 * @returns counts of chunks processed and skipped
 */
async function ingestDocument(
  sourceDir: string,
  doc: SourceDoc,
): Promise<{ processed: number; skipped: number }> {
  const filePath = path.join(sourceDir, doc.fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  File not found, skipping: ${doc.fileName}`);
    return { processed: 0, skipped: 0 };
  }

  console.log(`\n  📄 ${doc.fileName}`);
  console.log(`     topic: "${doc.topic}" | grade: ${doc.gradeBand}`);

  const chunks = await chunkDocument({
    filePath,
    subject: doc.subject,
    gradeBand: doc.gradeBand,
    topic: doc.topic,
  });

  console.log(`     ${chunks.length} chunks to process`);

  let processed = 0;
  let skipped = 0;

  for (const chunk of chunks) {
    // Deduplication: skip if this exact chunk already exists in Firestore
    const exists = await withRetry(`chunkExists #${chunk.chunkIndex}`, () =>
      chunkExists(chunk.source, chunk.chunkIndex),
    );
    if (exists) {
      skipped++;
      continue;
    }

    // Embed the chunk text with Gemini
    const embedding = await withRetry(`embed #${chunk.chunkIndex}`, () => embedText(chunk.text));

    // Save chunk + embedding to Firestore
    await withRetry(`saveChunk #${chunk.chunkIndex}`, () => saveChunk({ ...chunk, embedding }));
    processed++;

    // Brief pause to stay within Gemini free-tier rate limits (60 RPM)
    await sleep(50);
  }

  console.log(`     ✅ ${processed} saved, ${skipped} already existed`);
  return { processed, skipped };
}

/** Returns the absolute folder and source list for a subject + optional grade filter. */
function resolveSources(
  ragSourcesDir: string,
  subject: 'math' | 'reading',
  grade: IngestGrade | '',
): Array<{ dir: string; doc: SourceDoc }> {
  if (grade === '2') {
    const dir = path.join(ragSourcesDir, subject, 'grade-2');
    const docs = subject === 'math' ? MATH_SOURCES_GRADE_2 : READING_SOURCES_GRADE_2;
    return docs.map((doc) => ({ dir, doc }));
  }

  if (grade === '3') {
    const dir = path.join(ragSourcesDir, subject, 'grade-3');
    const docs = subject === 'math' ? MATH_SOURCES_GRADE_3 : READING_SOURCES_GRADE_3;
    return docs.map((doc) => ({ dir, doc }));
  }

  // No --grade: keep the original K–1 flat-folder behavior
  const dir = path.join(ragSourcesDir, subject);
  const docs = subject === 'math' ? MATH_SOURCES_K1 : READING_SOURCES_K1;
  return docs.map((doc) => ({ dir, doc }));
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

/** Parses a named CLI argument: --name value → value */
function getArg(name: string, fallback = ''): string {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? (process.argv[idx + 1] ?? fallback) : fallback;
}

async function main(): Promise<void> {
  const subject = getArg('subject', 'all') as Subject | 'all';
  const gradeArg = getArg('grade', '');

  if (!['math', 'reading', 'all'].includes(subject)) {
    console.error(
      'Usage: ts-node ingestDocuments.ts --subject <math|reading|all> [--grade 2|3]',
    );
    process.exit(1);
  }

  if (gradeArg !== '' && gradeArg !== '2' && gradeArg !== '3') {
    console.error('Invalid --grade. Use 2 or 3 (omit --grade for the K–1 folders).');
    process.exit(1);
  }

  if (subject === 'all' && gradeArg !== '') {
    console.error('Omit --grade when using --subject all (K–1 only). Run grade 2-3 per subject.');
    process.exit(1);
  }

  const grade = gradeArg as IngestGrade | '';
  const ragSourcesDir = path.resolve(__dirname, '../../rag-sources');
  const sourcesToIngest: Array<{ dir: string; doc: SourceDoc }> = [];

  if (subject === 'math' || subject === 'all') {
    sourcesToIngest.push(...resolveSources(ragSourcesDir, 'math', grade));
  }
  if (subject === 'reading' || subject === 'all') {
    sourcesToIngest.push(...resolveSources(ragSourcesDir, 'reading', grade));
  }

  console.log(`\n🚀 Spark Tutor RAG Ingestion`);
  console.log(`   Subject filter: ${subject}`);
  console.log(`   Grade filter:   ${grade || 'K-1 (flat folders)'}`);
  console.log(`   Documents to process: ${sourcesToIngest.length}`);
  console.log('─'.repeat(60));

  let totalProcessed = 0;
  let totalSkipped = 0;

  for (const { dir, doc } of sourcesToIngest) {
    const { processed, skipped } = await ingestDocument(dir, doc);
    totalProcessed += processed;
    totalSkipped += skipped;
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅ Ingestion complete`);
  console.log(`   Chunks saved:   ${totalProcessed}`);
  console.log(`   Chunks skipped: ${totalSkipped} (already in Firestore)`);

  // Show final counts per subject in Firestore
  if (subject === 'math' || subject === 'all') {
    const mathCount = await countChunks('math');
    console.log(`   Math chunks in Firestore:    ${mathCount}`);
  }
  if (subject === 'reading' || subject === 'all') {
    const readingCount = await countChunks('reading');
    console.log(`   Reading chunks in Firestore: ${readingCount}`);
  }
}

main().catch((err: unknown) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
