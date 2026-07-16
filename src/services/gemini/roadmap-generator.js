import "server-only";

import { GEMINI_MODEL, getGeminiClient } from "@/services/gemini/client";
import { parseRoadmapJson } from "@/services/gemini/json-parser";
import { buildRoadmapPrompt } from "@/services/gemini/prompt-builder";

const MAX_ATTEMPTS = 3;

export async function generateRoadmap(onboarding) {
  const prompt = buildRoadmapPrompt(onboarding);
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await getGeminiClient().models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.3 },
      });
      return parseRoadmapJson(response.text);
    } catch (error) {
      lastError = error;
    }
  }

  const detail = lastError instanceof Error ? lastError.message : "Unknown Gemini error";
  throw new Error(`Unable to generate a valid roadmap after ${MAX_ATTEMPTS} attempts: ${detail}`);
}
