import "server-only";

import { GEMINI_MODEL, getGeminiClient } from "@/services/gemini/client";
import { handleGeminiError } from "@/services/gemini/error-handler";
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
      lastError = handleGeminiError(error);
      
      if (!lastError.isTransient) {
        throw new Error(lastError.message);
      }
      
      if (lastError.retryDelay && attempt < MAX_ATTEMPTS) {
        await new Promise((res) => setTimeout(res, lastError.retryDelay * 1000));
      }
    }
  }

  throw new Error(lastError?.message || "Unable to generate a valid roadmap.");
}
