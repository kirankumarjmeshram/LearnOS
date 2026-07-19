import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { Lesson } from "@/models/lesson";
import { Roadmap } from "@/models/roadmap";
import { GEMINI_MODEL, getGeminiClient } from "@/services/gemini/client";
import { handleGeminiError } from "@/services/gemini/error-handler";
import "@/models/phase";

export async function askAiTutor(clerkId, lessonId, userMessage) {
  await connectToDatabase();
  
  // 1. Fetch lesson
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new Error("Lesson not found.");

  // 2. Fetch roadmap to get goal and module
  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId }).populate("phases").lean();
  if (!roadmap) throw new Error("Roadmap not found or access denied.");

  const phase = roadmap.phases?.find(p => p._id.toString() === lesson.phaseId.toString());
  const moduleName = phase?.title || "Unknown Module";
  
  // Extract objectives cleanly
  const objectives = lesson.learningObjectives?.length 
    ? lesson.learningObjectives.map(o => `- ${o}`).join("\n") 
    : "Not specified";

  // Build the strict system prompt
  const systemPrompt = `You are LearnOS AI Tutor.

The student is currently studying the following lesson.

Roadmap Goal
${roadmap.goal}

Module
${moduleName}

Lesson Title
${lesson.title}

Learning Objectives
${objectives}

Lesson Content
${lesson.aiContent ? JSON.stringify(lesson.aiContent) : "Content not yet generated."}

Your purpose is to help the student MASTER this lesson.

Always use the lesson as the primary source of truth.

Capabilities
• Explain concepts
• Simplify concepts
• Summarize lessons
• Generate revision notes
• Give practical examples
• Generate quizzes
• Generate interview questions with answers

If the question is closely related to the lesson, answer it.

If the question is completely unrelated, politely respond:
"This question is outside the current lesson. Let's focus on what you're learning."

Always respond using Markdown.
Keep responses educational and concise.`;

  // Combine system prompt and user message
  const prompt = `${systemPrompt}\n\nStudent Request:\n${userMessage}`;

  try {
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.4 },
    });

    const text = response.text;
    if (!text?.trim()) throw new Error("Gemini returned an empty response.");

    return text;
  } catch (error) {
    const handled = handleGeminiError(error);
    console.error("[LessonTutor] AI generation failed:", handled.message);
    throw new Error(handled.message);
  }
}
