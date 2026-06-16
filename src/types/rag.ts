// Types for the RAG (Retrieval-Augmented Generation) layer.
// Curriculum chunks are stored in Firestore and retrieved by embedding similarity.

import type { Subject } from './session';

/** Grade band indicates which grade level a curriculum chunk targets. */
export type GradeBand = 'K' | '1' | 'K-1';

/**
 * A single curriculum chunk stored in Firestore.
 * Lives at: curriculum_chunks/{chunkId}
 * Embedding is stored as a plain number[] — cosine similarity is computed server-side.
 */
export interface CurriculumChunk {
  id: string;
  /** The raw text content of this chunk (200–400 words). */
  text: string;
  /** Gemini text-embedding-004 vector — 768 dimensions. */
  embedding: number[];
  /** Subject area: math or reading. Used as a pre-filter before similarity ranking. */
  subject: Subject;
  /** Grade level this content targets. */
  gradeBand: GradeBand;
  /** Descriptive topic label (e.g. "counting to 10", "phonics — short vowels"). */
  topic: string;
  /** Source document filename the chunk came from. */
  source: string;
  /** Zero-based index of this chunk within its source document. */
  chunkIndex: number;
  /** ISO timestamp of when this chunk was embedded and saved. */
  createdAt: string;
}

/**
 * A chunk returned by the vector search query — includes a similarity score.
 * Score is in [0, 1] where 1 = identical, 0 = orthogonal.
 */
export interface RankedChunk extends CurriculumChunk {
  similarityScore: number;
}
