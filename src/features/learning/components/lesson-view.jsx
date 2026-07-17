"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckSquare, Clock3, FolderKanban, ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";

import { CourseSidebar } from "./course-sidebar";
import { RightProgressPanel } from "./right-progress-panel";
import { LessonContent } from "./lesson-content";
import { LessonResources } from "./lesson-resources";
import { LessonNotes } from "./lesson-notes";
import { LessonActions } from "./lesson-actions";

const TABS = [
  { id: "overview-section", label: "Overview" },
  { id: "learn-section", label: "Learn" },
  { id: "practice-section", label: "Practice" },
  { id: "resources-section", label: "Resources" },
  { id: "project-section", label: "Project" },
  { id: "notes-section", label: "Notes" },
];

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
  const [activeTab, setActiveTab] = useState("overview-section");
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  // Keyboard Shortcuts: Left/Right arrows for lesson navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't navigate if user is typing in an input, textarea or contenteditable element
      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);
      
      if (isTyping) return;

      if (e.key === "ArrowLeft" && previousLesson?._id) {
        router.push(`/lesson/${previousLesson._id}`);
      } else if (e.key === "ArrowRight" && nextLesson?._id) {
        router.push(`/lesson/${nextLesson._id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previousLesson, nextLesson, router]);

  // Scroll Spy & Reading Progress Indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Track scroll progress percentage
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScrollable = scrollHeight - clientHeight;
      const percentage = totalScrollable > 0 ? Math.round((scrollTop / totalScrollable) * 100) : 0;
      setScrollProgress(percentage);
    };

    container.addEventListener("scroll", handleScroll);

    // Intersection Observer for scroll spy
    const observerOptions = {
      root: container,
      rootMargin: "-20% 0px -60% 0px", // triggers when section is in upper-middle of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);

    TABS.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) observer.observe(element);
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleTabClick = (tabId) => {
    const element = document.getElementById(tabId);
    if (element && scrollContainerRef.current) {
      // Smooth scroll container to section
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(tabId);
    }
  };

  // Find info for the right progress panel
  const currentPhase = phases.find((p) => p._id === lesson.phaseId) || phases[0];
  const phaseLessons = lessons.filter((l) => l.phaseId === lesson.phaseId);
  const completedPhaseLessons = phaseLessons.filter((l) => l.status === "completed").length;

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden relative">
      
      {/* ── Reading Progress Bar ── */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--muted)] z-30">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* ── Collapsible Left Sidebar ── */}
      <CourseSidebar
        roadmapGoal={roadmap?.goal || ""}
        phases={phases}
        lessons={lessons}
        currentLessonId={lesson._id}
      />

      {/* ── Center Content Area ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pt-1 scroll-smooth"
      >
        {/* Sticky Tab bar */}
        <div className="sticky top-0 z-20 bg-[var(--background)]/90 backdrop-blur border-b px-5 lg:px-8 py-2.5 flex items-center justify-between">
          <nav className="flex gap-1.5 overflow-x-auto no-scrollbar" aria-label="Lesson sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <span className="text-[10px] font-bold text-[var(--muted-foreground)] hidden sm:inline-block">
            {scrollProgress}% Read
          </span>
        </div>

        {/* Content body */}
        <div className="p-5 lg:p-8 space-y-12 max-w-4xl">
          
          {/* SECTION 1: Overview */}
          <div id="overview-section" className="scroll-mt-16 space-y-6">
            <Link
              href={`/roadmap?id=${lesson.roadmapId}`}
              className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to roadmap
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                Lesson {lesson.order} · Week {lesson.week}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {lesson.title}
              </h1>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                {lesson.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--card)] px-3 py-1.5 font-medium">
                <Clock3 className="size-3.5 text-[var(--primary)]" />
                {lesson.estimatedDuration}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--card)] px-3 py-1.5 font-medium">
                <CheckSquare className="size-3.5 text-[var(--primary)]" />
                {lesson.status === "completed" ? "Completed" : "In Progress"}
              </span>
            </div>

            {/* Objectives + Topics */}
            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <div className="rounded-xl border bg-[var(--card)] p-5">
                <div className="flex items-center gap-2">
                  <ListChecks className="size-4 text-[var(--primary)]" />
                  <h4 className="font-semibold text-sm">Learning Objectives</h4>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-[var(--muted-foreground)]">
                  {lesson.learningObjectives?.map((obj, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--primary)]" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border bg-[var(--card)] p-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-[var(--primary)]" />
                  <h4 className="font-semibold text-sm">Topics</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {lesson.topics?.map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs font-semibold text-[var(--secondary-foreground)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* SECTION 2: Learn (AI Lesson Content) */}
          <div id="learn-section" className="scroll-mt-16">
            {aiContent ? (
              <LessonContent content={aiContent} />
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-xs text-[var(--muted-foreground)]">
                  No detailed concept summary available. Use the resources tab to learn.
                </p>
              </div>
            )}
          </div>

          <hr />

          {/* SECTION 3: Practice */}
          <div id="practice-section" className="scroll-mt-16 space-y-4">
            <h3 className="text-lg font-bold">Hands-on Practice</h3>
            <div className="rounded-xl border bg-[var(--card)] p-5">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                {lesson.practice || "Apply what you have learned by implementing a small coding exercise or task."}
              </p>
            </div>
          </div>

          <hr />

          {/* SECTION 4: Resources */}
          <div id="resources-section" className="scroll-mt-16">
            <LessonResources
              lessonId={lesson._id}
              aiResources={aiResources}
              initialUserResources={initialUserResources}
            />
          </div>

          <hr />

          {/* SECTION 5: Project */}
          <div id="project-section" className="scroll-mt-16 space-y-4">
            <h3 className="text-lg font-bold">Mini Project</h3>
            <div className="rounded-xl border bg-[var(--card)] p-5">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                {lesson.project || "No mini project included for this lesson."}
              </p>
            </div>
          </div>

          <hr />

          {/* SECTION 6: Notes */}
          <div id="notes-section" className="scroll-mt-16 space-y-4">
            <h3 className="text-lg font-bold">Lesson Notes</h3>
            <LessonNotes lessonId={lesson._id} initialContent={noteContent} />
          </div>

          {/* Previous / Next Actions */}
          <div className="pt-6">
            <LessonActions
              lessonId={lesson._id}
              previousLessonId={previousLesson?._id}
              nextLessonId={nextLesson?._id}
              isCompleted={lesson.status === "completed"}
            />
          </div>

        </div>
      </div>

      {/* ── Collapsible Right Progress Panel ── */}
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
