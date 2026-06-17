// Document ingestion pipeline for Spark Tutor RAG.
// Reads PDFs from rag-sources/, chunks them, embeds each chunk with Gemini,
// and saves chunks + embeddings to Firestore curriculum_chunks collection.
//
// Usage (from project root):
//   npx ts-node --project tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject math
//   npx ts-node --project tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject reading
//   npx ts-node --project tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject all

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

const MATH_SOURCES: SourceDoc[] = [
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

const READING_SOURCES: SourceDoc[] = [
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

// ─── Ingestion helpers ────────────────────────────────────────────────────────

/** Pauses execution for the given number of milliseconds — used to respect Gemini rate limits. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    const exists = await chunkExists(chunk.source, chunk.chunkIndex);
    if (exists) {
      skipped++;
      continue;
    }

    // Embed the chunk text with Gemini
    const embedding = await embedText(chunk.text);

    // Save chunk + embedding to Firestore
    await saveChunk({ ...chunk, embedding });
    processed++;

    // Brief pause to stay within Gemini free-tier rate limits (60 RPM)
    await sleep(50);
  }

  console.log(`     ✅ ${processed} saved, ${skipped} already existed`);
  return { processed, skipped };
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

/** Parses a named CLI argument: --name value → value */
function getArg(name: string, fallback = ''): string {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? (process.argv[idx + 1] ?? fallback) : fallback;
}

async function main(): Promise<void> {
  const subject = getArg('subject', 'all') as Subject | 'all';

  if (!['math', 'reading', 'all'].includes(subject)) {
    console.error('Usage: ts-node ingestDocuments.ts --subject <math|reading|all>');
    process.exit(1);
  }

  const ragSourcesDir = path.resolve(__dirname, '../../rag-sources');
  const mathDir = path.join(ragSourcesDir, 'math');
  const readingDir = path.join(ragSourcesDir, 'reading');

  const sourcesToIngest: Array<{ dir: string; doc: SourceDoc }> = [];

  if (subject === 'math' || subject === 'all') {
    MATH_SOURCES.forEach((doc) => sourcesToIngest.push({ dir: mathDir, doc }));
  }
  if (subject === 'reading' || subject === 'all') {
    READING_SOURCES.forEach((doc) => sourcesToIngest.push({ dir: readingDir, doc }));
  }

  console.log(`\n🚀 Spark Tutor RAG Ingestion`);
  console.log(`   Subject filter: ${subject}`);
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
