"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Clock3,
  ListChecks,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { CourseSidebar } from "./course-sidebar";
import { RightProgressPanel } from "./right-progress-panel";
import { LessonContent } from "./lesson-content";
import { LessonResources } from "./lesson-resources";
import { LessonNotes } from "./lesson-notes";
import { LessonActions } from "./lesson-actions";

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { id: "overview-section",  label: "Overview" },
  { id: "learn-section",     label: "Learn" },
  { id: "practice-section",  label: "Practice" },
  { id: "resources-section", label: "Resources" },
  { id: "project-section",   label: "Project" },
  { id: "notes-section",     label: "Notes" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Sticky section-navigation tab bar with scroll-spy awareness. */
const TabBar = memo(function TabBar({ activeTab, onTabClick, scrollProgress }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-[var(--background)]/95 px-4 py-2 backdrop-blur-sm sm:px-6">
      <nav
        className="flex gap-0.5 overflow-x-auto"
        aria-label="Lesson sections"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabClick(id)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring)] ${
              activeTab === id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
      <span className="hidden shrink-0 text-[10px] font-medium tabular-nums text-[var(--muted-foreground)] sm:block">
        {scrollProgress}%
      </span>
    </div>
  );
});

/** Lesson metadata chips (duration, status). */
const LessonMeta = memo(function LessonMeta({ estimatedDuration, status }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--card)] px-2.5 py-1 text-xs font-medium">
        <Clock3 className="size-3 text-[var(--primary)]" />
        {estimatedDuration}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--card)] px-2.5 py-1 text-xs font-medium">
        <CheckSquare className="size-3 text-[var(--primary)]" />
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
  noteContent,
  aiContent,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState("overview-section");
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

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

      if (e.key === "ArrowLeft" && previousLesson?._id)
        router.push(`/lesson/${previousLesson._id}`);
      else if (e.key === "ArrowRight" && nextLesson?._id)
        router.push(`/lesson/${nextLesson._id}`);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previousLesson, nextLesson, router]);

  // ── Scroll spy + reading progress ─────────────────────────────────────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollable = scrollHeight - clientHeight;
      setScrollProgress(
        scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 0,
      );
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        }
      },
      { root: container, rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );

    TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      container.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // ── Smooth anchor scroll on tab click ─────────────────────────────────────
  const handleTabClick = useCallback((tabId) => {
    const el = document.getElementById(tabId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(tabId);
    }
  }, []);

  // ── Derived state for progress panel ──────────────────────────────────────
  const currentPhase = phases.find((p) => p._id === lesson.phaseId) ?? phases[0];
  const phaseLessons = lessons.filter((l) => l.phaseId === lesson.phaseId);
  const completedPhaseLessons = phaseLessons.filter(
    (l) => l.status === "completed",
  ).length;

  return (
    // Full-height three-column flex layout within the DashboardLayout content area
    <div className="flex h-full min-w-0 flex-1 overflow-hidden">

      {/* ── Reading progress bar (top of scroll container) ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-[var(--muted)]"
        aria-hidden
      >
        <div
          className="h-full bg-[var(--primary)] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Left: Course Sidebar ── */}
      <CourseSidebar
        roadmapGoal={roadmap?.goal ?? ""}
        phases={phases}
        lessons={lessons}
        currentLessonId={lesson._id}
      />

      {/* ── Center: Scrollable lesson content ── */}
      <div
        ref={scrollRef}
        className="flex min-w-0 flex-1 flex-col overflow-y-auto"
      >
        <TabBar
          activeTab={activeTab}
          onTabClick={handleTabClick}
          scrollProgress={scrollProgress}
        />

        {/* Lesson body — constrained reading width, generous but not overwhelming */}
        <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-8 sm:px-8">

          {/* ── SECTION 1: Overview ── */}
          <section id="overview-section" className="scroll-mt-14 space-y-6">
            <Link
              href={`/roadmap?id=${lesson.roadmapId}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="size-3" />
              Back to roadmap
            </Link>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Lesson {lesson.order} &middot; Week {lesson.week}
              </p>
              <h1 className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                {lesson.title}
              </h1>
              <p className="text-base leading-7 text-[var(--muted-foreground)]">
                {lesson.description}
              </p>
            </div>

            <LessonMeta
              estimatedDuration={lesson.estimatedDuration}
              status={lesson.status}
            />

            {/* Objectives + Topics grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {lesson.learningObjectives?.length > 0 && (
                <div className="rounded-xl border bg-[var(--card)] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <ListChecks className="size-4 text-[var(--primary)]" />
                    <h3 className="text-sm font-semibold">Objectives</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {lesson.learningObjectives.map((obj, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs leading-5 text-[var(--muted-foreground)]"
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--primary)]" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.topics?.length > 0 && (
                <div className="rounded-xl border bg-[var(--card)] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="size-4 text-[var(--primary)]" />
                    <h3 className="text-sm font-semibold">Topics</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs font-medium text-[var(--secondary-foreground)]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="my-10" />

          {/* ── SECTION 2: Learn ── */}
          <section id="learn-section" className="scroll-mt-14">
            {aiContent ? (
              <LessonContent content={aiContent} />
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Lesson content is being prepared. Check back shortly or explore
                  the resources tab.
                </p>
              </div>
            )}
          </section>

          <hr className="my-10" />

          {/* ── SECTION 3: Practice ── */}
          <section id="practice-section" className="scroll-mt-14 space-y-4">
            <h2 className="text-lg font-bold">Hands-on Practice</h2>
            <div className="rounded-xl border bg-[var(--card)] p-5">
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                {lesson.practice ||
                  "Apply what you've learned by implementing a small coding exercise or task."}
              </p>
            </div>
          </section>

          <hr className="my-10" />

          {/* ── SECTION 4: Resources ── */}
          <section id="resources-section" className="scroll-mt-14">
            <LessonResources
              lessonId={lesson._id}
              aiResources={aiResources}
              initialUserResources={initialUserResources}
            />
          </section>

          <hr className="my-10" />

          {/* ── SECTION 5: Project ── */}
          <section id="project-section" className="scroll-mt-14 space-y-4">
            <h2 className="text-lg font-bold">Mini Project</h2>
            <div className="rounded-xl border bg-[var(--card)] p-5">
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                {lesson.project || "No mini project is included for this lesson."}
              </p>
            </div>
          </section>

          <hr className="my-10" />

          {/* ── SECTION 6: Notes ── */}
          <section id="notes-section" className="scroll-mt-14 space-y-4">
            <h2 className="text-lg font-bold">My Notes</h2>
            <LessonNotes lessonId={lesson._id} initialContent={noteContent} />
          </section>

          {/* ── Lesson navigation (Prev / Mark Complete / Next) ── */}
          <div className="mt-10">
            <LessonActions
              lessonId={lesson._id}
              previousLessonId={previousLesson?._id}
              nextLessonId={nextLesson?._id}
              isCompleted={lesson.status === "completed"}
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
