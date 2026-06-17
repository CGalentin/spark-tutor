// Gemini SDK singleton — initializes GoogleGenerativeAI once and reuses it across the app.
// All Gemini calls go through this module so the API key is never exposed to the client.

import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

/** Returns the shared GoogleGenerativeAI instance, initializing it on first call. */
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
