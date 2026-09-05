// Gemini SDK singletons — one client for embeddings, a second for Flash (evaluator).
// All Gemini calls go through this module so the API key is never exposed to the client.
//
// Model note: ROADMAP-v2 listed gemini-2.0-flash. Google shut that model down on
// 1 Jun 2026. gemini-3.5-flash is the current Flash replacement (fast, cheap, JSON).

import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

/** Current Gemini Flash model — parent-only evaluator, never child-facing chat. */
export const GEMINI_FLASH_MODEL = 'gemini-3.5-flash';

let geminiClient: GoogleGenerativeAI | null = null;
let geminiFlashSdk: GoogleGenerativeAI | null = null;
let geminiFlashModel: GenerativeModel | null = null;

/** Returns the shared GoogleGenerativeAI instance used for embeddings. */
export function getGeminiClient(): GoogleGenerativeAI {
  if (geminiClient) {
    return geminiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  geminiClient = new GoogleGenerativeAI(apiKey);
  return geminiClient;
}

/**
 * Returns the Gemini Flash model used to score topic mastery.
 * Separate singleton from getGeminiClient() so embeddings and evaluation never share state.
 */
export function getGeminiFlashClient(): GenerativeModel {
  if (geminiFlashModel) {
    return geminiFlashModel;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  geminiFlashSdk = new GoogleGenerativeAI(apiKey);
  geminiFlashModel = geminiFlashSdk.getGenerativeModel({ model: GEMINI_FLASH_MODEL });
  return geminiFlashModel;
}
