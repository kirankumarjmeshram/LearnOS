import "server-only";

import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { Lesson } from "@/models/lesson";
import { GEMINI_MODEL, getGeminiClient } from "@/services/gemini/client";
import { handleGeminiError } from "@/services/gemini/error-handler";

// ─── Response schema ─────────────────────────────────────────────────────────

const contentSchema = z.object({
  overview: z.string().min(1),
  objectives: z.array(z.string()).default([]),
  keyConcepts: z
    .array(z.object({ term: z.string().min(1), definition: z.string().min(1) }))
    .default([]),
  codeExamples: z
    .array(
      z.object({
        title: z.string().min(1),
        language: z.string().default(""),
        code: z.string().min(1),
      }),
    )
    .default([]),
  bestPractices: z.array(z.string()).default([]),
  commonMistakes: z.array(z.string()).default([]),
  officialDocs: z
    .array(z.object({ title: z.string().min(1), url: z.string().min(1) }))
    .default([]),
  summary: z.string().min(1),
});

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildPrompt(lesson, roadmapGoal) {
  const topics = lesson.topics?.join(", ") || lesson.title;
  return `You are the LearnOS Learning Engine. Generate comprehensive, practical learning content for this lesson.

Lesson title: ${lesson.title}
Topics covered: ${topics}
Description: ${lesson.description}
Learner goal: ${roadmapGoal}
Practice task: ${lesson.practice}

Return ONLY a valid JSON object with this exact structure — no markdown, no extra text:
{
  "overview": "2-3 paragraphs explaining what this lesson covers and why it matters for the learner's goal",
  "objectives": ["specific learning objective 1", "objective 2", "objective 3"],
  "keyConcepts": [
    { "term": "concept name", "definition": "clear, concise explanation in 1-2 sentences" }
  ],
  "codeExamples": [
    { "title": "descriptive example title", "language": "javascript", "code": "// Working, runnable code\nconsole.log('example');" }
  ],
  "bestPractices": ["actionable best practice 1", "best practice 2"],
  "commonMistakes": ["common mistake to avoid 1", "mistake 2"],
  "officialDocs": [
    { "title": "Real documentation name", "url": "https://real-url-that-exists.com/docs" }
  ],
  "summary": "1-2 paragraph summary of the most important takeaways from this lesson"
}

Requirements:
- All content must be directly relevant to: ${topics}
- officialDocs must contain REAL, EXISTING URLs specific to these topics (not generic homepages)
- Code examples must be syntactically correct and immediately practical
- Include 3-5 key concepts
- Include 2-4 code examples
- Include 3-5 official documentation links with real, specific URLs
- Best practices and common mistakes should be actionable and specific`;
}

// ─── Generation with retry ────────────────────────────────────────────────────

const MAX_ATTEMPTS = 2;

async function generateContent(lesson, roadmapGoal) {
  const prompt = buildPrompt(lesson, roadmapGoal);
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await getGeminiClient().models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.4 },
      });

      const text = response.text;
      if (!text?.trim()) throw new Error("Gemini returned an empty content response.");

      const parsed = JSON.parse(text);
      const result = contentSchema.safeParse(parsed);
      if (!result.success) {
        throw new Error(`Content schema validation failed: ${result.error.message}`);
      }
      return result.data;
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

  throw new Error(lastError?.message || "Content generation failed after all attempts.");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns cached AI content if it already exists on the lesson, otherwise
 * calls Gemini to generate it, persists it, and returns the result.
 * Returns null if generation fails — callers must handle gracefully.
 */
export async function getOrGenerateLessonContent(lesson, roadmapGoal) {
  if (lesson.aiContent) return lesson.aiContent;

  await connectToDatabase();
  try {
    const content = await generateContent(lesson, roadmapGoal);
    await Lesson.findByIdAndUpdate(lesson._id, { $set: { aiContent: content } });
    return content;
  } catch (error) {
    console.warn("[LessonContent] AI generation failed:", error.message);
    return null;
  }
}
