// Firebase Firestore vector search helpers — server-side only.
// Stores curriculum chunks with their Gemini embeddings and retrieves the
// top-N most similar chunks using cosine similarity computed in-memory.
//
// Why in-memory cosine similarity instead of Firebase Vector Search extension?
//   Our corpus is small (<1 000 chunks). Fetching all subject-filtered chunks
//   and ranking them server-side is fast (<100 ms) and requires zero Firestore
//   index configuration. Upgrade to Firestore findNearest() if corpus grows.

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import type { CurriculumChunk, RankedChunk } from '@/types';

// ─── Admin SDK singleton ──────────────────────────────────────────────────────

/** Returns the Admin Firestore instance, initializing the app if needed. */
function getAdminFirestore() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  return getFirestore();
}

const COLLECTION = 'curriculum_chunks';

// ─── Cosine similarity ────────────────────────────────────────────────────────

/**
 * Computes the cosine similarity between two equal-length vectors.
 * Returns a value in [-1, 1] — for normalized Gemini embeddings this is [0, 1].
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dot / denominator;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Saves a curriculum chunk (text + embedding + metadata) to Firestore.
 * Returns the auto-generated document ID.
 * Call this from the ingestion script — never from a user-facing API route.
 */
export async function saveChunk(
  chunk: Omit<CurriculumChunk, 'id'>,
): Promise<string> {
  const db = getAdminFirestore();
  const ref = await db.collection(COLLECTION).add(chunk);
  return ref.id;
}

/**
 * Checks whether a chunk with the same source + chunkIndex already exists.
 * Used by the ingestion script to skip chunks that were already embedded.
 */
export async function chunkExists(source: string, chunkIndex: number): Promise<boolean> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where('source', '==', source)
    .where('chunkIndex', '==', chunkIndex)
    .limit(1)
    .get();

  return !snapshot.empty;
}

/**
 * Queries Firestore for the top-N curriculum chunks most similar to queryEmbedding.
 *
 * Strategy:
 *   1. Fetch all chunks for the given subject from Firestore (pre-filter).
 *   2. Rank by cosine similarity against queryEmbedding (in-memory).
 *   3. Return the top `limit` ranked chunks.
 *
 * @param queryEmbedding - 768-dimension vector from Gemini embedContent
 * @param subject        - 'math' | 'reading' — used to pre-filter chunks
 * @param limit          - number of top results to return (default 3)
 */
export async function queryByEmbedding(
  queryEmbedding: number[],
  subject: 'math' | 'reading',
  limit = 3,
): Promise<RankedChunk[]> {
  const db = getAdminFirestore();

  const snapshot = await db
    .collection(COLLECTION)
    .where('subject', '==', subject)
    .get();

  if (snapshot.empty) return [];

  // Rank all subject-filtered chunks by cosine similarity
  const ranked: RankedChunk[] = snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CurriculumChunk, 'id'>;
    return {
      ...data,
      id: doc.id,
      similarityScore: cosineSimilarity(queryEmbedding, data.embedding),
    };
  });

  // Sort descending by similarity score and return the top results
  ranked.sort((a, b) => b.similarityScore - a.similarityScore);
  return ranked.slice(0, limit);
}

/**
 * Returns the total number of chunks stored for a given subject.
 * Used for debugging and QA during ingestion.
 */
export async function countChunks(subject: 'math' | 'reading'): Promise<number> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where('subject', '==', subject)
    .count()
    .get();

  return snapshot.data().count;
}
