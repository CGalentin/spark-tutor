// Gemini embedding utility — converts text to a 3072-dimension vector using gemini-embedding-001.
// Used exclusively for RAG: chunk ingestion and query embedding. Never generates user-facing text.
//
// Model note: text-embedding-004 is retired. gemini-embedding-001 is the current stable model
// and produces 3072-dimensional vectors (up from 768 in the old model).

import { getGeminiClient } from './client';

const EMBEDDING_MODEL = 'gemini-embedding-001';

/**
 * Embeds a text string into a 3072-dimension vector using Gemini gemini-embedding-001.
 * Returns the embedding as a plain number array for storage and cosine similarity comparison.
 */
export async function embedText(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('embedText requires a non-empty text string');
  }

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: EMBEDDING_MODEL });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
