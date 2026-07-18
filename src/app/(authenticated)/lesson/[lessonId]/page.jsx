import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { LessonView } from "@/features/learning/components/lesson-view";
import { getLessonForUser, getLearningExperience } from "@/services/learning-service";
import { getLessonNote, getLessonResources } from "@/services/resources/resource-service";
import { getOrGenerateLessonContent } from "@/services/gemini/content-generator";
import { AIGenerationSkeleton } from "@/features/learning/components/ai-generation-skeleton";
import LessonLoading from "./loading";

export const metadata = { title: "Lesson" };

async function LessonDataFetcher({ learning, userId, lessonId }) {
  const { lesson, previousLesson, nextLesson, roadmap } = learning;

  // Parallel fetch: sidebar experience, resources list, note content, AI generated content
  const [experienceResult, resourcesResult, noteResult, contentResult] = await Promise.allSettled([
    getLearningExperience(userId, lesson.roadmapId.toString()),
    getLessonResources(userId, lessonId),
    getLessonNote(userId, lessonId),
    getOrGenerateLessonContent(lessonId, roadmap?.goal || ""),
  ]);

  const experience = experienceResult.status === "fulfilled" ? experienceResult.value : null;
  const aiResources = resourcesResult.status === "fulfilled" ? resourcesResult.value.aiResources : [];
  const initialUserResources = resourcesResult.status === "fulfilled" ? resourcesResult.value.userResources : [];
  const globalResources = resourcesResult.status === "fulfilled" ? resourcesResult.value.globalResources : [];
  const noteContent = noteResult.status === "fulfilled" ? noteResult.value?.content ?? "" : "";
  const aiContentRaw = contentResult.status === "fulfilled" ? contentResult.value : null;
  const aiError = aiContentRaw?.error || null;
  const aiContent = aiContentRaw?.error ? null : aiContentRaw;

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
      globalResources,
      noteContent,
      aiContent,
      aiError,
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
      globalResources={serialized.globalResources}
      noteContent={serialized.noteContent}
      aiContent={serialized.aiContent}
      aiError={serialized.aiError}
    />
  );
}

export default async function LessonPage({ params }) {
  const { lessonId } = await params;
  const user = await currentUser();

  // Get the specific lesson to determine if AI generation is needed
  let learning = null;
  try {
    if (user?.id) learning = await getLessonForUser(user.id, lessonId);
  } catch (error) {
    console.error("Unable to load lesson:", error);
  }
  
  if (!learning) notFound();

  // ONLY show AI generation skeleton if it's genuinely missing from DB (e.g. pending or generating)
  const needsGeneration = !learning.lesson.aiContent;

  return (
    <Suspense fallback={needsGeneration ? <AIGenerationSkeleton lessonTitle={learning.lesson.title} /> : <LessonLoading />}>
      <LessonDataFetcher learning={learning} userId={user.id} lessonId={lessonId} />
    </Suspense>
  );
}
