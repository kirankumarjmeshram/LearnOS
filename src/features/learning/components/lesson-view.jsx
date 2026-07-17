"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckSquare,
  Clock3,
  ListChecks,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { CourseSidebar } from "./course-sidebar";
import { RightProgressPanel } from "./right-progress-panel";
import { LessonContent } from "./lesson-content";
import { LessonResources } from "./lesson-resources";
import { LessonNotes } from "./lesson-notes";
import { LessonActions } from "./lesson-actions";

// ─── Sub-components ──────────────────────────────────────────────────────────

const GuidedStepper = memo(function GuidedStepper({ steps, activeIndex, onStepClick }) {
  return (
    <div className="sticky top-0 z-20 border-b bg-[var(--background)]/95 px-5 py-4 backdrop-blur-sm sm:px-8">
      <nav aria-label="Progress" className="mx-auto max-w-3xl">
        <ol role="list" className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            const isLast = index === steps.length - 1;
            
            return (
              <li key={step.id} className={cn("relative flex items-center", !isLast && "flex-1")}>
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute top-1/2 w-full -translate-y-1/2 left-4 px-2" aria-hidden="true">
                    <div className={cn("h-0.5 w-full rounded-full", isCompleted ? "bg-[var(--primary)]" : "bg-[var(--muted)]")} />
                  </div>
                )}
                
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  disabled={index > activeIndex && !isCompleted}
                  className="relative flex flex-col items-center group bg-[var(--background)] z-10"
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    isCompleted ? "bg-[var(--primary)] text-[var(--primary-foreground)]" 
                      : isActive ? "border-2 border-[var(--primary)] bg-[var(--background)] text-[var(--primary)]"
                      : "border-2 border-[var(--muted)] bg-[var(--background)] text-[var(--muted-foreground)] group-hover:border-[var(--muted-foreground)]"
                  )}>
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "absolute -bottom-6 text-[10px] sm:text-xs font-semibold whitespace-nowrap",
                    isActive ? "text-[var(--primary)]" : isCompleted ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                  )}>
                    {step.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
});

const LessonMeta = memo(function LessonMeta({ estimatedDuration, status }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--card)] px-3 py-1.5 text-xs font-semibold">
        <Clock3 className="size-3.5 text-[var(--primary)]" />
        {estimatedDuration}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--card)] px-3 py-1.5 text-xs font-semibold">
        <CheckSquare className="size-3.5 text-[var(--primary)]" />
        {status === "completed" ? "Completed" : "In Progress"}
      </span>
    </div>
  );
});

// ─── Main component ──────────────────────────────────────────────────────────

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
}) {
  const router = useRouter();

  // Dynamic steps based on lesson content
  const STEPS = useMemo(() => {
    const s = [
      { id: "overview", label: "Overview" },
      { id: "learn", label: "Learn" },
    ];
    if (lesson.practice) s.push({ id: "practice", label: "Practice" });
    s.push({ id: "resources", label: "Resources" });
    if (lesson.project) s.push({ id: "project", label: "Project" });
    s.push({ id: "notes", label: "Notes" });
    return s;
  }, [lesson.practice, lesson.project]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeStep = STEPS[activeIndex];

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
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

      if (e.key === "ArrowLeft") {
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        } else if (previousLesson?._id) {
          router.push(`/lesson/${previousLesson._id}`);
        }
      } else if (e.key === "ArrowRight") {
        if (activeIndex < STEPS.length - 1) {
          setActiveIndex(activeIndex + 1);
        } else if (nextLesson?._id) {
          router.push(`/lesson/${nextLesson._id}`);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previousLesson, nextLesson, router, activeIndex, STEPS.length]);

  // Scroll to top when step changes
  useEffect(() => {
    const container = document.getElementById("lesson-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeIndex]);

  // ── Derived state for progress panel ──────────────────────────────────────
  const currentPhase = phases.find((p) => p._id === lesson.phaseId) ?? phases[0];
  const phaseLessons = lessons.filter((l) => l.phaseId === lesson.phaseId);
  const completedPhaseLessons = phaseLessons.filter((l) => l.status === "completed").length;

  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden bg-[var(--background)]">
      {/* ── Left: Course Sidebar ── */}
      <CourseSidebar
        roadmapGoal={roadmap?.goal ?? ""}
        phases={phases}
        lessons={lessons}
        currentLessonId={lesson._id}
      />

      {/* ── Center: Scrollable lesson content ── */}
      <div
        id="lesson-scroll-container"
        className="flex min-w-0 flex-1 flex-col overflow-y-auto"
      >
        <GuidedStepper
          steps={STEPS}
          activeIndex={activeIndex}
          onStepClick={(index) => setActiveIndex(index)}
        />

        {/* Lesson body — constrained reading width */}
        <div className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-10 sm:px-8">
          
          {/* STEP: Overview */}
          {activeStep.id === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Link
                href={`/roadmap?id=${lesson.roadmapId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                <ArrowLeft className="size-4" />
                Back to roadmap
              </Link>

              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                  Lesson {lesson.order} &middot; Week {lesson.week}
                </p>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  {lesson.title}
                </h1>
                <p className="text-lg leading-8 text-[var(--muted-foreground)]">
                  {lesson.description}
                </p>
              </div>

              <LessonMeta
                estimatedDuration={lesson.estimatedDuration}
                status={lesson.status}
              />

              <div className="grid gap-4 sm:grid-cols-2 mt-8">
                {lesson.learningObjectives?.length > 0 && (
                  <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                        <ListChecks className="size-4" />
                      </span>
                      <h3 className="text-base font-semibold">Objectives</h3>
                    </div>
                    <ul className="space-y-3">
                      {lesson.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[var(--muted-foreground)]">
                          <Check className="mt-1 size-4 shrink-0 text-[var(--primary)]" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lesson.topics?.length > 0 && (
                  <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                        <BookOpen className="size-4" />
                      </span>
                      <h3 className="text-base font-semibold">Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lesson.topics.map((topic, i) => (
                        <span key={i} className="rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-xs font-bold text-[var(--secondary-foreground)]">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP: Learn */}
          {activeStep.id === "learn" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {aiContent ? (
                <LessonContent content={aiContent} />
              ) : (
                <div className="rounded-2xl border border-dashed bg-[var(--card)] p-12 text-center">
                  <p className="text-base font-medium text-[var(--muted-foreground)]">
                    Lesson content is being prepared. Check back shortly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP: Practice */}
          {activeStep.id === "practice" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight">Hands-on Practice</h2>
              <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                <p className="text-base leading-8 text-[var(--foreground)]">
                  {lesson.practice}
                </p>
              </div>
            </div>
          )}

          {/* STEP: Resources */}
          {activeStep.id === "resources" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LessonResources
                lessonId={lesson._id}
                aiResources={aiResources}
                initialUserResources={initialUserResources}
                globalResources={globalResources}
              />
            </div>
          )}

          {/* STEP: Project */}
          {activeStep.id === "project" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight">Mini Project</h2>
              <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                <p className="text-base leading-8 text-[var(--foreground)]">
                  {lesson.project}
                </p>
              </div>
            </div>
          )}

          {/* STEP: Notes */}
          {activeStep.id === "notes" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight">My Notes</h2>
              <LessonNotes lessonId={lesson._id} initialContent={noteContent} />
            </div>
          )}

          {/* ── Stepper Navigation ── */}
          <div className="mt-16 border-t pt-8">
            <LessonActions
              lessonId={lesson._id}
              previousLessonId={previousLesson?._id}
              nextLessonId={nextLesson?._id}
              isCompleted={lesson.status === "completed"}
              
              // New stepper props
              isFirstStep={activeIndex === 0}
              isLastStep={activeIndex === STEPS.length - 1}
              onPrevStep={() => setActiveIndex(activeIndex - 1)}
              onNextStep={() => setActiveIndex(activeIndex + 1)}
              nextStepLabel={activeIndex < STEPS.length - 1 ? STEPS[activeIndex + 1].label : null}
            />
          </div>
        </div>
      </div>

      {/* ── Right: Progress Panel ── */}
      <RightProgressPanel
        currentPhaseName={currentPhase?.title}
        completedLessons={completedPhaseLessons}
        totalLessons={phaseLessons.length}
        nextLessonId={nextLesson?._id}
        lessonId={lesson._id}
      />
    </div>
  );
}
