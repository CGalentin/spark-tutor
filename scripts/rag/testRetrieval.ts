// RAG retrieval quality test for Spark Tutor.
// Runs 10 sample K-1 questions through the full embed → query pipeline
// and logs which curriculum chunks were retrieved for each question.
//
// Pass quality if at least 8 of 10 retrievals return relevant content.
//
// Usage (from project root):
//   npx ts-node --project tsconfig.scripts.json scripts/rag/testRetrieval.ts

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import { embedText } from '../../src/lib/gemini/embed';
import { queryByEmbedding } from '../../src/lib/firebase/vectorSearch';
import type { Subject } from '../../src/types/session';

// ─── Sample questions ─────────────────────────────────────────────────────────

interface TestQuestion {
  query: string;
  subject: Subject;
  /** Keywords that should appear in at least one retrieved chunk for a pass. */
  expectedKeywords: string[];
}

const TEST_QUESTIONS: TestQuestion[] = [
  // Math questions
  {
    query: 'How do kindergarteners learn to count objects?',
    subject: 'math',
    expectedKeywords: ['count', 'number', 'objects'],
  },
  {
    query: 'What is addition within 5 for kindergarten?',
    subject: 'math',
    expectedKeywords: ['addition', 'sum', 'number'],
  },
  {
    query: 'How do first graders compare numbers up to 10?',
    subject: 'math',
    expectedKeywords: ['compare', 'greater', 'less'],
  },
  {
    query: 'What are strategies for learning addition facts?',
    subject: 'math',
    expectedKeywords: ['addition', 'strategy', 'sum'],
  },
  {
    query: 'What is place value for grade 1 students?',
    subject: 'math',
    expectedKeywords: ['place value', 'tens', 'ones'],
  },
  // Reading questions
  {
    query: 'How do kindergarteners learn phonics and letter sounds?',
    subject: 'reading',
    expectedKeywords: ['phonics', 'letter', 'sound'],
  },
  {
    query: 'What are sight words for kindergarten reading?',
    subject: 'reading',
    expectedKeywords: ['word', 'read', 'sight'],
  },
  {
    query: 'How do first graders learn to read fables and stories?',
    subject: 'reading',
    expectedKeywords: ['story', 'fable', 'read'],
  },
  {
    query: 'What does the Common Core say about kindergarten ELA standards?',
    subject: 'reading',
    expectedKeywords: ['standard', 'kindergarten', 'read'],
  },
  {
    query: 'How do students learn about rhyming words in early literacy?',
    subject: 'reading',
    expectedKeywords: ['rhym', 'word', 'sound'],
  },
];

// ─── Test runner ──────────────────────────────────────────────────────────────

/** Checks if any chunk text contains at least one of the expected keywords (case-insensitive). */
function chunksAreRelevant(chunkTexts: string[], expectedKeywords: string[]): boolean {
  const combined = chunkTexts.join(' ').toLowerCase();
  return expectedKeywords.some((kw) => combined.includes(kw.toLowerCase()));
}

async function main(): Promise<void> {
  console.log('\n🔍 Spark Tutor — RAG Retrieval Quality Test');
  console.log(`   ${TEST_QUESTIONS.length} sample K-1 questions`);
  console.log('─'.repeat(70));

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const test = TEST_QUESTIONS[i]!;
    console.log(`\n[${i + 1}/${TEST_QUESTIONS.length}] ${test.subject.toUpperCase()}: "${test.query}"`);

    // Brief pause between questions to avoid Gemini rate limits
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, 200));

    const queryEmbedding = await embedText(test.query);
    const chunks = await queryByEmbedding(queryEmbedding, test.subject, 3);

    if (chunks.length === 0) {
      console.log('  ❌ FAIL — no chunks returned');
      failed++;
      continue;
    }

    const chunkTexts = chunks.map((c) => c.text);
    const relevant = chunksAreRelevant(chunkTexts, test.expectedKeywords);

    if (relevant) {
      console.log(`  ✅ PASS — ${chunks.length} chunks returned`);
      chunks.forEach((c, idx) => {
        console.log(`     [${idx + 1}] score: ${c.similarityScore.toFixed(4)} | topic: "${c.topic}" | source: ${c.source}`);
      });
      passed++;
    } else {
      console.log(`  ❌ FAIL — chunks returned but none contain expected keywords: [${test.expectedKeywords.join(', ')}]`);
      chunks.forEach((c, idx) => {
        console.log(`     [${idx + 1}] score: ${c.similarityScore.toFixed(4)} | topic: "${c.topic}"`);
        console.log(`          snippet: "${c.text.slice(0, 120)}..."`);
      });
      failed++;
    }
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`📊 Results: ${passed}/${TEST_QUESTIONS.length} passed`);

  if (passed >= 8) {
    console.log('✅ Quality check PASSED (≥ 8/10 relevant retrievals)');
  } else {
    console.log('❌ Quality check FAILED (< 8/10 relevant retrievals)');
    console.log('   Consider: adjusting chunk size, adding more source docs, or tuning keywords.');
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('Retrieval test failed:', err);
  process.exit(1);
});
