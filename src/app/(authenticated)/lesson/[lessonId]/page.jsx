import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, BookOpen, CheckSquare, Clock3, FolderKanban, ListChecks } from "lucide-react";
import { notFound } from "next/navigation";

import { LessonActions } from "@/features/learning/components/lesson-actions";
import { LessonContent } from "@/features/learning/components/lesson-content";
import { LessonNotes } from "@/features/learning/components/lesson-notes";
import { LessonResources } from "@/features/learning/components/lesson-resources";
import { CourseSidebar } from "@/features/learning/components/course-sidebar";
import { getLessonForUser, getLearningExperience } from "@/services/learning-service";
import { getLessonNote, getLessonResources } from "@/services/resources/resource-service";
import { getOrGenerateLessonContent } from "@/services/gemini/content-generator";

export const metadata = { title: "Lesson" };

export default async function LessonPage({ params }) {
  const { lessonId } = await params;
  const user = await currentUser();

  // Step 1: get the specific lesson (needed to resolve roadmapId)
  let learning = null;
  try {
    if (user?.id) learning = await getLessonForUser(user.id, lessonId);
  } catch (error) {
    console.error("Unable to load lesson:", error);
  }
  if (!learning) notFound();

  const { lesson, previousLesson, nextLesson, roadmap } = learning;

  // Step 2: parallel fetch — sidebar data, resources, note, AI content
  const [experienceResult, resourcesResult, noteResult, contentResult] = await Promise.allSettled([
    getLearningExperience(user.id, lesson.roadmapId.toString()),
    getLessonResources(user.id, lessonId),
    getLessonNote(user.id, lessonId),
    getOrGenerateLessonContent(lesson, roadmap?.goal || ""),
  ]);

  // Sidebar data (phases + all lessons for current roadmap)
  const experience =
    experienceResult.status === "fulfilled" ? experienceResult.value : null;
  const sidebarPhases = JSON.parse(
    JSON.stringify(experience?.roadmap?.phases || []),
  );
  const sidebarLessons = JSON.parse(
    JSON.stringify(experience?.lessons || []),
  );

  // Resources
  const aiResources =
    resourcesResult.status === "fulfilled"
      ? JSON.parse(JSON.stringify(resourcesResult.value.aiResources))
      : [];
  const initialUserResources =
    resourcesResult.status === "fulfilled"
      ? JSON.parse(JSON.stringify(resourcesResult.value.userResources))
      : [];

  // Note
  const noteContent =
    noteResult.status === "fulfilled" ? noteResult.value?.content ?? "" : "";

  // AI lesson content (null if generation failed)
  const aiContent =
    contentResult.status === "fulfilled" ? contentResult.value : null;

  return (
    <div className="flex min-h-0 flex-1">
      {/* ── Course navigation sidebar ── */}
      <CourseSidebar
        roadmapGoal={roadmap?.goal || ""}
        phases={sidebarPhases}
        lessons={sidebarLessons}
        currentLessonId={lesson._id.toString()}
      />

      {/* ── Main lesson content ── */}
      <main className="min-w-0 flex-1 overflow-y-auto p-5 lg:p-8">
        {/* Breadcrumb */}
        <Link
          href={`/roadmap?id=${lesson.roadmapId.toString()}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-4" />
          Back to roadmap
        </Link>

        {/* Lesson header */}
        <section className="mt-6 max-w-4xl">
          <p className="text-sm font-semibold text-[var(--primary)]">
            Lesson {lesson.order} · Week {lesson.week}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            {lesson.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-xl border bg-[var(--card)] px-3 py-2">
              <Clock3 className="size-4 text-[var(--primary)]" />
              {lesson.estimatedDuration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border bg-[var(--card)] px-3 py-2">
              <CheckSquare className="size-4 text-[var(--primary)]" />
              {lesson.status === "completed" ? "Completed" : "Ready to start"}
            </span>
          </div>
        </section>

        {/* Objectives + Topics grid */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border bg-[var(--card)] p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
                <ListChecks className="size-5" />
              </span>
              <h2 className="text-xl font-semibold">Learning objectives</h2>
            </div>
            <ul className="mt-5 space-y-3 text-[var(--muted-foreground)]">
              {lesson.learningObjectives.map((objective) => (
                <li key={objective} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border bg-[var(--card)] p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
                <BookOpen className="size-5" />
              </span>
              <h2 className="text-xl font-semibold">Topics</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {lesson.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-[var(--secondary)] px-3 py-1.5 text-sm font-medium text-[var(--secondary-foreground)]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* AI Learning Content */}
        {aiContent && (
          <div className="mt-5">
            <LessonContent content={aiContent} />
          </div>
        )}

        {/* Learning Content (curated resources) */}
        <div className="mt-5">
          <LessonResources
            lessonId={lesson._id.toString()}
            aiResources={aiResources}
            initialUserResources={initialUserResources}
          />
        </div>

        {/* Practice + Project */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border bg-[var(--card)] p-6">
            <h2 className="text-xl font-semibold">Practice exercise</h2>
            <p className="mt-3 leading-7 text-[var(--muted-foreground)]">{lesson.practice}</p>
          </section>

          <section className="rounded-2xl border bg-[var(--card)] p-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="size-5 text-[var(--primary)]" />
              <h2 className="text-xl font-semibold">Mini project</h2>
            </div>
            <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
              {lesson.project || "This lesson does not include a mini project."}
            </p>
          </section>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <LessonNotes lessonId={lesson._id.toString()} initialContent={noteContent} />
        </div>

        {/* Previous / Next / Complete */}
        <LessonActions
          lessonId={lesson._id.toString()}
          previousLessonId={previousLesson?._id?.toString()}
          nextLessonId={nextLesson?._id?.toString()}
          isCompleted={lesson.status === "completed"}
        />
      </main>
    </div>
  );
}
