import "server-only";

import { GoogleGenAI } from "@google/genai";
import { getGeminiEnv } from "@/lib/env";

let client = null;
export const GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiClient() {
  if (!client) client = new GoogleGenAI({ apiKey: getGeminiEnv().GEMINI_API_KEY });
  return client;
}
