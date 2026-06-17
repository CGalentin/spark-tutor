// Document chunking utility for Spark Tutor RAG pipeline.
// Reads a PDF file, extracts text, and splits it into overlapping 200-400 word
// chunks with subject + grade-level metadata.
//
// Usage (from project root):
//   npx ts-node --project tsconfig.scripts.json scripts/rag/chunkDocument.ts \
//     --file rag-sources/math/common-core-math-standards-k12.pdf \
//     --subject math \
//     --grade K-1 \
//     --topic "K-1 math standards overview"

import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
import type { CurriculumChunk, GradeBand } from '../../src/types/rag';
import type { Subject } from '../../src/types/session';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Target chunk size in words. */
const TARGET_WORDS = 300;

/** Minimum chunk size in words — chunks smaller than this are merged with the next. */
const MIN_WORDS = 100;

/** Number of words to overlap between adjacent chunks for context continuity. */
const OVERLAP_WORDS = 50;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Input needed to chunk a single document. */
export interface ChunkDocumentInput {
  filePath: string;
  subject: Subject;
  gradeBand: GradeBand;
  topic: string;
}

/** A chunk ready to be embedded — everything except the embedding vector. */
export type ChunkInput = Omit<CurriculumChunk, 'id' | 'embedding'>;

// ─── PDF text extraction ──────────────────────────────────────────────────────

/**
 * Reads a PDF file and returns its raw text content.
 * Strips common PDF artifacts (ligatures, null bytes, excessive whitespace).
 */
export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const result = await pdfParse(buffer);

  // Normalize whitespace and clean up common PDF text artifacts
  return result.text
    .replace(/\x00/g, '')          // remove null bytes
    .replace(/ﬁ/g, 'fi')          // fix fi ligature
    .replace(/ﬂ/g, 'fl')          // fix fl ligature
    .replace(/\r\n/g, '\n')        // normalize line endings
    .replace(/\n{3,}/g, '\n\n')    // collapse excessive blank lines
    .trim();
}

// ─── Text chunking ────────────────────────────────────────────────────────────

/**
 * Counts the number of words in a string.
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Splits text into overlapping chunks of approximately TARGET_WORDS words.
 *
 * Strategy:
 *   1. Split text into sentences (on period/question/exclamation + whitespace).
 *   2. Greedily accumulate sentences until we hit TARGET_WORDS.
 *   3. When a chunk is full, record it and back up by OVERLAP_WORDS for context.
 *   4. Merge any trailing chunk smaller than MIN_WORDS into the previous one.
 */
export function splitIntoChunks(text: string): string[] {
  // Split into sentences, preserving the delimiter
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];

  const chunks: string[] = [];
  let currentWords: string[] = [];
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).filter(Boolean);
    const sentenceWordCount = sentenceWords.length;

    currentWords.push(...sentenceWords);
    currentWordCount += sentenceWordCount;

    if (currentWordCount >= TARGET_WORDS) {
      chunks.push(currentWords.join(' '));

      // Back up by OVERLAP_WORDS for the next chunk's context
      const overlapWords = currentWords.slice(-OVERLAP_WORDS);
      currentWords = overlapWords;
      currentWordCount = overlapWords.length;
    }
  }

  // Add the final chunk if it has enough content
  if (currentWordCount >= MIN_WORDS) {
    chunks.push(currentWords.join(' '));
  } else if (chunks.length > 0 && currentWordCount > 0) {
    // Merge tiny trailing chunk into the last one
    const lastChunk = chunks[chunks.length - 1]!;
    chunks[chunks.length - 1] = lastChunk + ' ' + currentWords.join(' ');
  }

  return chunks.filter((c) => countWords(c) >= MIN_WORDS);
}

// ─── Main exported function ───────────────────────────────────────────────────

/**
 * Reads a PDF, extracts text, and splits it into metadata-tagged chunks.
 * Returns an array of ChunkInput objects ready to be embedded.
 */
export async function chunkDocument(input: ChunkDocumentInput): Promise<ChunkInput[]> {
  const { filePath, subject, gradeBand, topic } = input;
  const source = path.basename(filePath);

  const rawText = await extractTextFromPdf(filePath);
  const chunks = splitIntoChunks(rawText);
  const now = new Date().toISOString();

  return chunks.map((text, chunkIndex) => ({
    text,
    subject,
    gradeBand,
    topic,
    source,
    chunkIndex,
    createdAt: now,
    // embedding is added by the ingestion script (PR 2-05)
  }));
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

/** Parses a named CLI argument: --name value → value, or returns the fallback. */
function getArg(name: string, fallback = ''): string {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? (process.argv[idx + 1] ?? fallback) : fallback;
}

async function main() {
  const filePath = getArg('file');
  const subject = getArg('subject') as Subject;
  const gradeBand = getArg('grade', 'K-1') as GradeBand;
  const topic = getArg('topic', path.basename(filePath, '.pdf'));

  if (!filePath || !subject) {
    console.error('Usage: ts-node chunkDocument.ts --file <path> --subject <math|reading> [--grade K|1|K-1] [--topic <label>]');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`\nChunking: ${filePath}`);
  console.log(`Subject: ${subject} | Grade: ${gradeBand} | Topic: ${topic}\n`);

  const chunks = await chunkDocument({ filePath, subject, gradeBand, topic });

  const wordCounts = chunks.map((c) => countWords(c.text));
  const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
  const minWords = Math.min(...wordCounts);
  const maxWords = Math.max(...wordCounts);

  console.log(`✅ Produced ${chunks.length} chunks`);
  console.log(`   Words per chunk — avg: ${avgWords}, min: ${minWords}, max: ${maxWords}`);
  console.log(`\nSample chunk [0]:`);
  console.log('─'.repeat(60));
  console.log(chunks[0]?.text.slice(0, 400) + (chunks[0] && chunks[0].text.length > 400 ? '...' : ''));
  console.log('─'.repeat(60));
}

// Run main() only when executed directly (not when imported by ingestDocuments.ts)
if (require.main === module) {
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}
