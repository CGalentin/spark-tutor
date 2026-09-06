// Smoke test for Gemini Flash evaluateMastery.
// Run with: npx ts-node --project tsconfig.scripts.json scripts/gemini/testEvaluate.ts

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import { evaluateMastery } from '../../src/lib/gemini/evaluate';
import { MASTERED_SCORE } from '../../src/types/learningPath';
import type { Message } from '../../src/types/session';

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'mascot',
    content: 'Can you count these three apples with me? 1, 2, and then...?',
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'child',
    content: '3!',
    timestamp: new Date(),
  },
  {
    id: '3',
    role: 'mascot',
    content: 'Yes! 1, 2, 3. How many apples is that altogether?',
    timestamp: new Date(),
  },
  {
    id: '4',
    role: 'child',
    content: 'Three apples.',
    timestamp: new Date(),
  },
];

async function main(): Promise<void> {
  console.log('Calling evaluateMastery with a sample counting conversation...');
  const result = await evaluateMastery(sampleMessages, 'Counting to 10', 'K');

  console.log(JSON.stringify(result, null, 2));

  if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
    throw new Error(`Invalid score: ${String(result.score)}`);
  }
  if (result.mastered !== result.score >= MASTERED_SCORE) {
    throw new Error(`mastered did not match score >= ${MASTERED_SCORE}`);
  }
  if (result.reasoning.trim().length === 0) {
    throw new Error('reasoning was empty');
  }

  console.log('✅ evaluateMastery returned a valid EvaluationResult');
}

main().catch((err: unknown) => {
  console.error('evaluateMastery test failed:', err);
  process.exit(1);
});
