import "server-only";

import { GoogleGenAI } from "@google/genai";
import { getServerEnv } from "@/lib/env";

let client;
export function getGeminiClient() {
  if (!client) client = new GoogleGenAI({ apiKey: getServerEnv().GEMINI_API_KEY });
  return client;
}
