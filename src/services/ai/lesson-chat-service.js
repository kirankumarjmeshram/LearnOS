import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { Lesson } from "@/models/lesson";
import { Roadmap } from "@/models/roadmap";
import { handleGeminiError } from "@/services/gemini/error-handler";
import { queryRag } from "@/services/rag/rag-service";
import "@/models/phase";

export async function askAiTutor(clerkId, lessonId, userMessage) {
  await connectToDatabase();
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new Error("Lesson not found.");

  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId }).populate("phases").lean();
  if (!roadmap) throw new Error("Roadmap not found or access denied.");

  const phase = roadmap.phases?.find((item) => item._id.toString() === lesson.phaseId.toString());
  try {
    return await queryRag({
      userId: clerkId,
      question: userMessage,
      lessonId,
      lessonContext: {
        goal: roadmap.goal,
        module: phase?.title || "Current module",
        title: lesson.title,
        objectives: lesson.learningObjectives || [],
      },
    });
  } catch (error) {
    const handled = handleGeminiError(error);
    console.error("[LessonTutor] AI generation failed:", handled.message);
    throw new Error(handled.message);
  }
}
