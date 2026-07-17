import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { LessonView } from "@/features/learning/components/lesson-view";
import { getLessonForUser, getLearningExperience } from "@/services/learning-service";
import { getLessonNote, getLessonResources } from "@/services/resources/resource-service";
import { getOrGenerateLessonContent } from "@/services/gemini/content-generator";

export const metadata = { title: "Lesson" };

export default async function LessonPage({ params }) {
  const { lessonId } = await params;
  const user = await currentUser();

  // Get the specific lesson to resolve roadmapId
  let learning = null;
  try {
    if (user?.id) learning = await getLessonForUser(user.id, lessonId);
  } catch (error) {
    console.error("Unable to load lesson:", error);
  }
  if (!learning) notFound();

  const { lesson, previousLesson, nextLesson, roadmap } = learning;

  // Parallel fetch: sidebar experience, resources list, note content, AI generated content
  const [experienceResult, resourcesResult, noteResult, contentResult] = await Promise.allSettled([
    getLearningExperience(user.id, lesson.roadmapId.toString()),
    getLessonResources(user.id, lessonId),
    getLessonNote(user.id, lessonId),
    getOrGenerateLessonContent(lesson, roadmap?.goal || ""),
  ]);

  // Sidebar data
  const experience =
    experienceResult.status === "fulfilled" ? experienceResult.value : null;

  // Resources
  const aiResources =
    resourcesResult.status === "fulfilled" ? resourcesResult.value.aiResources : [];
  const initialUserResources =
    resourcesResult.status === "fulfilled" ? resourcesResult.value.userResources : [];

  // Note
  const noteContent =
    noteResult.status === "fulfilled" ? noteResult.value?.content ?? "" : "";

  // AI lesson content
  const aiContent =
    contentResult.status === "fulfilled" ? contentResult.value : null;

  // Safe Serialization of MongoDB items for Client Component boundaries
  const serialized = JSON.parse(
    JSON.stringify({
      lesson,
      previousLesson,
      nextLesson,
      roadmap,
      phases: experience?.roadmap?.phases || [],
      lessons: experience?.lessons || [],
      progress: experience?.progress || null,
      aiResources,
      initialUserResources,
      noteContent,
      aiContent,
    }),
  );

  return (
    <LessonView
      lesson={serialized.lesson}
      previousLesson={serialized.previousLesson}
      nextLesson={serialized.nextLesson}
      roadmap={serialized.roadmap}
      phases={serialized.phases}
      lessons={serialized.lessons}
      progress={serialized.progress}
      aiResources={serialized.aiResources}
      initialUserResources={serialized.initialUserResources}
      noteContent={serialized.noteContent}
      aiContent={serialized.aiContent}
    />
  );
}
