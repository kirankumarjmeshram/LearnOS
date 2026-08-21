import "server-only";

import { GEMINI_MODEL, getGeminiClient } from "@/services/gemini/client";
import { buildRagContext, toSources } from "@/services/rag/generation/context-builder";
import { buildRagPrompt, canUseLessonTutorFallback } from "@/services/rag/generation/rag-prompt";
import { RagError } from "@/services/rag/rag-types";

export async function generateGroundedAnswer({ question, chunks, lessonContext, lessonReference }) {
  const canUseTutorFallback = canUseLessonTutorFallback({ lessonContext, lessonReference });
  if (!chunks.length && !canUseTutorFallback) {
    return { answer: "I couldn't find relevant information in your processed learning resources for that question.", sources: [] };
  }
  if (!chunks.length) console.info("[RAG] No indexed context; using the lesson tutor fallback.");
  try {
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildRagPrompt({ question, context: buildRagContext(chunks), lessonContext, lessonReference }),
      config: { temperature: 0.2 },
    });
    if (!response.text?.trim()) throw new Error("Gemini returned an empty response.");
    return { answer: response.text, sources: toSources(chunks) };
  } catch (error) {
    throw new RagError("The AI tutor could not answer from your learning resources right now.", { code: "GENERATION_FAILED", status: 502, cause: error });
  }
}
