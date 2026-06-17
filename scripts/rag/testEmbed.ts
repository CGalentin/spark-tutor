// Quick smoke test for the Gemini embedding client.
// Run with: npx ts-node --project tsconfig.scripts.json scripts/rag/testEmbed.ts
// Expected output: vector length 768

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local before importing the embed module
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import { embedText } from '../../src/lib/gemini/embed';

async function main(): Promise<void> {
  const sampleText =
    'In kindergarten math, students learn to count objects up to 20 and understand the concept of addition.';

  console.log('Embedding sample K-1 curriculum text...');
  const vector = await embedText(sampleText);

  console.log(`Vector length: ${vector.length}`);
  console.log(`First 5 values: [${vector.slice(0, 5).map((v) => v.toFixed(6)).join(', ')}]`);

  if (vector.length === 3072) {
    console.log('✅ Embedding successful — vector length is 3072 as expected (gemini-embedding-001)');
  } else {
    console.error(`❌ Unexpected vector length: ${vector.length} (expected 3072)`);
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('Embedding test failed:', err);
  process.exit(1);
});
