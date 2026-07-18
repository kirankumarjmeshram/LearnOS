import "server-only";

import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { Lesson } from "@/models/lesson";
import { Roadmap } from "@/models/roadmap";
import { GEMINI_MODEL, getGeminiClient } from "@/services/gemini/client";
import { handleGeminiError } from "@/services/gemini/error-handler";

// ─── Response schema ─────────────────────────────────────────────────────────

// Use .catch([]) on arrays to provide graceful degradation. 
// If an individual array is completely malformed, the entire lesson won't fail.
const contentSchema = z.object({
  overview: z.string().min(1),
  objectives: z.array(z.string()).catch([]).default([]),
  keyConcepts: z
    .array(z.object({ term: z.string().min(1), definition: z.string().min(1) }))
    .catch([])
    .default([]),
  realWorldExample: z
    .object({
      title: z.string(),
      scenario: z.string(),
      example: z.string(),
      importance: z.string()
    })
    .catch(null)
    .nullable()
    .optional(),
  visualCallouts: z
    .array(z.object({
      type: z.enum(['info', 'warning', 'tip']),
      content: z.string()
    }))
    .catch([])
    .default([]),
  mermaidDiagrams: z
    .array(z.object({
      title: z.string(),
      code: z.string()
    }))
    .catch([])
    .default([]),
  comparisonTables: z
    .array(z.object({
      title: z.string(),
      markdown: z.string()
    }))
    .catch([])
    .default([]),
  codeExamples: z
    .array(
      z.object({
        title: z.string().min(1),
        language: z.string().default(""),
        code: z.string().min(1),
      }),
    )
    .catch([])
    .default([]),
  handsOnLabs: z
    .array(z.object({
      title: z.string(),
      steps: z.array(z.string())
    }))
    .catch([])
    .default([]),
  knowledgeChecks: z
    .array(z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer: z.string(),
      explanation: z.string()
    }))
    .catch([])
    .default([]),
  interviewQuestions: z
    .array(z.object({
      question: z.string(),
      answer: z.string()
    }))
    .catch([])
    .default([]),
  bestPractices: z.array(z.string()).catch([]).default([]),
  commonMistakes: z.array(z.string()).catch([]).default([]),
  officialDocs: z
    .array(z.object({ title: z.string().min(1), url: z.string().min(1) }))
    .catch([])
    .default([]),
  keyTakeaways: z.array(z.string()).catch([]).default([]),
});

// ─── Normalization ───────────────────────────────────────────────────────────

function normalizeGeminiOutput(parsed) {
  if (!parsed || typeof parsed !== 'object') return parsed;

  // Normalize visualCallouts enum types
  if (Array.isArray(parsed.visualCallouts)) {
    parsed.visualCallouts = parsed.visualCallouts.map(callout => {
      let type = String(callout.type || "").toLowerCase().trim();
      if (['warning', 'important', 'danger', 'critical', 'alert', 'error'].includes(type)) {
        type = 'warning';
      } else if (['tip', 'hint', 'best practice', 'success', 'good'].includes(type)) {
        type = 'tip';
      } else {
        type = 'info'; // Fallback for 'note', 'unknown', or anything else
      }
      return { ...callout, type };
    });
  }

  return parsed;
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildPrompt(lesson, roadmapGoal) {
  const topics = lesson.topics?.join(", ") || lesson.title;
  return `You are the LearnOS Learning Engine, a premium instructor platform like AWS Skill Builder or Educative. Generate comprehensive, practical learning content for this lesson.

Lesson title: ${lesson.title}
Topics covered: ${topics}
Description: ${lesson.description}
Learner goal: ${roadmapGoal}
Practice task: ${lesson.practice}

Return ONLY a valid JSON object with this exact structure — no markdown blocks outside the JSON, no extra text:
{
  "overview": "1-2 paragraphs explaining what this lesson covers and why it matters",
  "objectives": ["objective 1", "objective 2"],
  "keyConcepts": [{ "term": "concept", "definition": "1-2 sentences explanation" }],
  "realWorldExample": {
    "title": "Example Title",
    "scenario": "Industry scenario...",
    "example": "Company like Netflix or AWS doing this...",
    "importance": "Why this matters in production"
  },
  "visualCallouts": [{ "type": "tip", "content": "Actionable tip" }],
  "mermaidDiagrams": [{ "title": "Architecture", "code": "graph TD; A-->B;" }],
  "comparisonTables": [{ "title": "SQL vs NoSQL", "markdown": "| Feature | SQL | NoSQL |\\n|---|---|---|" }],
  "codeExamples": [{ "title": "descriptive title", "language": "javascript", "code": "// code" }],
  "handsOnLabs": [{ "title": "Setup", "steps": ["Step 1", "Step 2"] }],
  "knowledgeChecks": [{ "question": "What is X?", "options": ["A", "B", "C"], "answer": "B", "explanation": "Because..." }],
  "interviewQuestions": [{ "question": "How do you...", "answer": "The answer is..." }],
  "bestPractices": ["practice 1"],
  "commonMistakes": ["mistake 1"],
  "officialDocs": [{ "title": "Doc Name", "url": "https://real-docs.com" }],
  "keyTakeaways": ["takeaway 1", "takeaway 2"]
}

Requirements:
- All content must be directly relevant to: ${topics}
- Reduce unnecessary paragraphs. Prefer bullets, tables, diagrams, and examples.
- Include 1 real-world industry example if applicable.
- Ensure officialDocs contain REAL, EXISTING URLs.
- Include 1-2 interactive knowledge checks.
- Include 1-2 interview questions.
- Mermaid diagrams must be valid syntax (avoid HTML tags inside nodes).`;
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

      let parsed = JSON.parse(text);
      
      // Normalize before validation to prevent minor string formatting bugs from failing the entire generation
      parsed = normalizeGeminiOutput(parsed);

      const result = contentSchema.safeParse(parsed);
      
      // With .catch() on optional blocks, it should rarely fail entirely unless "overview" is completely missing
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

const BACKGROUND_PREGENERATED_LESSONS = 1;

/**
 * Silently pre-generates the first N lessons in the background.
 */
export async function pregenerateLessons(roadmapId, count = BACKGROUND_PREGENERATED_LESSONS) {
  try {
    await connectToDatabase();
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return;
    
    // Find ungenerated lessons belonging to this roadmap
    const lessons = await Lesson.find({ roadmapId, generationStatus: "pending" })
      .sort({ order: 1 })
      .limit(count);
      
    for (const lesson of lessons) {
      await getOrGenerateLessonContent(lesson._id, roadmap.goal);
    }
  } catch (error) {
    console.error("[Pre-generation failed]:", error);
  }
}

/**
 * Returns cached AI content if it already exists on the lesson.
 * Otherwise, acquires a generation lock (generationStatus) and calls Gemini.
 * Returns an object { error: string } if generation fails — callers must handle gracefully.
 */
export async function getOrGenerateLessonContent(lessonId, roadmapGoal) {
  await connectToDatabase();
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return { error: "Lesson not found." };

  if (lesson.generationStatus === "completed" && lesson.aiContent) {
    return lesson.aiContent;
  }

  // Safe Generation Locking: If another request/background task is currently generating it,
  // we poll MongoDB until it's done so the UI can wait on this Suspense boundary instead of duplicate calling.
  if (lesson.generationStatus === "generating") {
    let attempts = 0;
    while (attempts < 15) { // 30s timeout
      await new Promise(res => setTimeout(res, 2000));
      const fresh = await Lesson.findById(lessonId).select("generationStatus aiContent");
      if (fresh?.generationStatus === "completed" && fresh.aiContent) {
        return fresh.aiContent;
      }
      if (fresh?.generationStatus === "failed") {
        return { error: "Lesson generation failed during background processing." };
      }
      attempts++;
    }
    // Timeout fallback
    await Lesson.findByIdAndUpdate(lessonId, { generationStatus: "failed" });
    return { error: "Lesson generation timed out. Please try again." };
  }

  // Lock acquired: Start generation
  await Lesson.findByIdAndUpdate(lessonId, { generationStatus: "generating" });

  try {
    const content = await generateContent(lesson, roadmapGoal);
    
    // Save to DB and strictly verify persistence to prevent regeneration loops
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lesson._id, 
      { $set: { aiContent: content, generationStatus: "completed" } },
      { new: true } // Return the updated document
    );

    if (!updatedLesson?.aiContent) {
      console.error(`[FATAL ERROR] Lesson ${lesson._id}: aiContent generated successfully but FAILED to persist to MongoDB.`);
      await Lesson.findByIdAndUpdate(lesson._id, { generationStatus: "failed" });
    } else {
      console.log(`[SUCCESS] Lesson ${lesson._id}: aiContent generated and persisted. Size: ${JSON.stringify(content).length} bytes. Timestamp: ${new Date().toISOString()}`);
    }

    return content;
  } catch (error) {
    console.warn("[LessonContent] AI generation failed:", error.message);
    await Lesson.findByIdAndUpdate(lessonId, { generationStatus: "failed" });
    return { error: error.message }; // Return error object gracefully to the UI
  }
}
