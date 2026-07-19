"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckSquare,
  ChevronRight,
  Clock3,
  ListChecks,
  Maximize,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CourseSidebar } from "./course-sidebar";
import { LearningHub } from "./right-progress-panel";
import { LessonContent } from "./lesson-content";
import { LessonActions } from "./lesson-actions";
import { ResourcesDrawer } from "./lesson-resources";

const LessonMeta = memo(function LessonMeta({ estimatedDuration, status, difficulty }) {
  return (
    <div className="flex flex-wrap gap-2">
      {estimatedDuration && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
          <Clock3 className="size-3.5" />
          {estimatedDuration}
        </span>
      )}
      {difficulty && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] capitalize">
          {difficulty}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
        <CheckSquare className="size-3.5" />
        {status === "completed" ? "Completed" : "In Progress"}
      </span>
    </div>
  );
});

export function LessonView({
  lesson,
  previousLesson,
  nextLesson,
  roadmap,
  phases,
  lessons,
  progress,
  aiResources,
  initialUserResources,
  globalResources,
  noteContent,
  aiContent,
  aiError,
}) {
  const router = useRouter();
  const [isResourcesDrawerOpen, setIsResourcesDrawerOpen] = useState(false);

  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const width = window.innerWidth;
    
    // Left Sidebar state
    try {
      const stored = localStorage.getItem("learnos:study-mode");
      if (stored) {
        setIsLeftOpen(JSON.parse(stored).left ?? true);
      }
    } catch {}

    // Right Sidebar (Learning Hub) Responsive Logic
    if (width >= 1024) {
      // Desktop & Laptop: Persistent, visible by default
      const stored = localStorage.getItem("learnos:hub-desktop");
      setIsRightOpen(stored ? JSON.parse(stored) : true);
    } else {
      // Tablet/Mobile: Default closed
      setIsRightOpen(false);
    }
  }, []);

  const toggleLeft = () => {
    setIsLeftOpen((p) => {
      const next = !p;
      localStorage.setItem("learnos:study-mode", JSON.stringify({ left: next, right: isRightOpen }));
      return next;
    });
  };

  const toggleRight = () => {
    setIsRightOpen((p) => {
      const next = !p;
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width >= 1024) {
          localStorage.setItem("learnos:hub-desktop", JSON.stringify(next));
        }
      }
      return next;
    });
  };

  const toggleStudyMode = () => {
    const isStudyMode = !isLeftOpen && !isRightOpen;
    const nextState = !isStudyMode;
    setIsLeftOpen(nextState);
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsRightOpen(nextState);
      localStorage.setItem("learnos:hub-desktop", JSON.stringify(nextState));
    }
    localStorage.setItem("learnos:study-mode", JSON.stringify({ left: nextState, right: nextState }));
  };

  // Close right overlay on lesson change for mobile
  useEffect(() => {
    if (isMounted && window.innerWidth < 1024) {
      setIsRightOpen(false);
    }
  }, [lesson._id, isMounted]);

  const isStudyMode = !isLeftOpen && (!isRightOpen || (isMounted && window.innerWidth < 1024));

  // Derive phase info
  const currentPhase = phases.find((p) => p._id === lesson.phaseId) ?? phases[0];
  const isLastInPhase = nextLesson?.phaseId !== lesson.phaseId;

  // Remove module prefix from lesson title (e.g. "System Design: Scalability" -> "Scalability")
  const strippedTitle = lesson.title.includes(":") 
    ? lesson.title.split(":").slice(1).join(":").trim() 
    : lesson.title;

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      const el = document.activeElement;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      )
        return;

      if (e.key === "ArrowLeft" && previousLesson?._id) {
        router.push(`/lesson/${previousLesson._id}`);
      } else if (e.key === "ArrowRight" && nextLesson?._id) {
        router.push(`/lesson/${nextLesson._id}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previousLesson, nextLesson, router]);

  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden bg-[var(--background)]">
      {/* ── Left: Course Sidebar ── */}
      {isLeftOpen && (
        <CourseSidebar
          roadmapGoal={roadmap?.goal ?? "Course"}
          phases={phases}
          lessons={lessons}
          currentLessonId={lesson._id}
        />
      )}

      {/* ── Center: Scrollable Continuous Lesson Content ── */}
      <div id="lesson-scroll-container" className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Top Action Bar (Study Mode Controls) */}
        <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur-md lg:px-6">
          <button
            onClick={toggleLeft}
            className="inline-flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {isLeftOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
            <span className="hidden sm:inline">{isLeftOpen ? "Hide Navigation" : "Navigation"}</span>
          </button>

          <button
            onClick={toggleStudyMode}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              isStudyMode
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {isStudyMode ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            Study Mode
          </button>

          <button
            onClick={toggleRight}
            className="inline-flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span className="hidden sm:inline">{isRightOpen ? "Hide Hub" : "Learning Hub"}</span>
            <PanelRightClose className={cn("size-4 transition-transform", isRightOpen && "rotate-180")} />
          </button>
        </div>

        <motion.div
          key={lesson._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "mx-auto w-full px-6 pb-32 pt-12 transition-all duration-300 lg:px-12",
            isStudyMode ? "max-w-[1000px]" : "max-w-[900px]"
          )}
        >
          
          {/* HEADER */}
          <div className="space-y-6 mb-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
              <Link href={`/roadmap?id=${lesson.roadmapId}`} className="hover:text-[var(--foreground)] transition-colors line-clamp-1">
                {roadmap?.goal || "Roadmap"}
              </Link>
              <ChevronRight className="size-3.5 shrink-0" />
              <span className="line-clamp-1">{currentPhase.title}</span>
              <ChevronRight className="size-3.5 shrink-0" />
              <span className="text-[var(--foreground)] line-clamp-1">{strippedTitle}</span>
            </nav>

            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[var(--foreground)]">
                {strippedTitle}
              </h1>
              <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">
                {lesson.description}
              </p>
            </div>

            <LessonMeta
              estimatedDuration={lesson.estimatedDuration}
              status={lesson.status}
              difficulty={lesson.difficulty}
            />
          </div>

          <hr className="my-12 border-[var(--border)]" />

          {/* OVERVIEW SECTION (Objectives & Topics) */}
          {(lesson.learningObjectives?.length > 0 || lesson.topics?.length > 0) && (
            <section className="mb-12 space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {lesson.learningObjectives?.length > 0 && (
                  <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <ListChecks className="size-4" />
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Objectives</h3>
                    </div>
                    <ul className="space-y-3">
                      {lesson.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[var(--foreground)]">
                          <div className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lesson.topics?.length > 0 && (
                  <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        <BookOpen className="size-4" />
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lesson.topics.map((topic, i) => (
                        <span key={i} className="rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--secondary-foreground)]">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <hr className="my-12 border-[var(--border)]" />
            </section>
          )}

          {/* LEARN SECTION (AI Content) */}
          <section className="mb-12">
            {aiError ? (
              <div className="rounded-2xl border border-dashed border-red-500/30 bg-red-500/10 p-12 text-center text-red-600 dark:text-red-400">
                <p className="text-base font-semibold">{aiError}</p>
              </div>
            ) : aiContent ? (
              <LessonContent content={aiContent} />
            ) : (
              <div className="rounded-2xl border border-dashed bg-[var(--card)] p-12 text-center">
                <p className="text-base font-medium text-[var(--muted-foreground)]">
                  Lesson content is being prepared.
                </p>
              </div>
            )}
          </section>



          {/* NEXT / PREV ACTIONS */}
          <div className="mt-16">
            <LessonActions
              lessonId={lesson._id}
              previousLessonId={previousLesson?._id}
              nextLessonId={nextLesson?._id}
              isCompleted={lesson.status === "completed"}
              isLastInPhase={isLastInPhase}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Right: Learning Hub ── */}
      <LearningHub
        lesson={lesson}
        currentPhaseName={currentPhase?.title}
        phases={phases}
        lessons={lessons}
        aiResources={aiResources}
        initialUserResources={initialUserResources}
        globalResources={globalResources}
        noteContent={noteContent}
        onOpenResources={() => setIsResourcesDrawerOpen(true)}
        isOpen={isRightOpen}
        onClose={() => setIsRightOpen(false)}
      />

      {/* Resources Drawer */}
      <ResourcesDrawer 
        isOpen={isResourcesDrawerOpen}
        onClose={() => setIsResourcesDrawerOpen(false)}
        lessonId={lesson._id}
        aiResources={aiResources}
        initialUserResources={initialUserResources}
        globalResources={globalResources}
      />
    </div>
  );
}
