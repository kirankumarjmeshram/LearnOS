"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

function lessonsForPhase(lessons, phaseId) {
  return lessons.filter((l) => l.phaseId === phaseId);
}

export function CourseSidebar({ roadmapGoal, phases, lessons, currentLessonId }) {
  // Desktop collapse state (default open)
  const [isOpen, setIsOpen] = useState(true);
  // Mobile drawer state (default closed)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentLesson = lessons.find((l) => l._id === currentLessonId);
  const roadmapId = currentLesson?.roadmapId || "";

  // Next incomplete lesson in sequence
  const nextIncompleteLesson = lessons.find((l) => l.status !== "completed");

  const isLessonLocked = (lesson) => {
    if (!nextIncompleteLesson) return false; // all completed
    return lesson.order > nextIncompleteLesson.order;
  };

  // Expanded phases state with localStorage memory
  const [expandedPhases, setExpandedPhases] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`learnos:expanded-phases:${roadmapId}`);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        // ignore
      }
    }
    // Default to expanding the phase of the current lesson, and collapsing others
    return currentLesson ? { [currentLesson.phaseId]: true } : {};
  });

  const togglePhase = (phaseId) => {
    setExpandedPhases((prev) => {
      const next = { ...prev, [phaseId]: !prev[phaseId] };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`learnos:expanded-phases:${roadmapId}`, JSON.stringify(next));
        } catch (e) {
          // ignore
        }
      }
      return next;
    });
  };

  // Listen to custom menu event from header/layout for mobile drawer toggling
  useEffect(() => {
    const handleToggle = () => {
      setIsMobileOpen((prev) => !prev);
    };
    window.addEventListener("toggle-learning-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-learning-sidebar", handleToggle);
    };
  }, []);

  // Auto-scroll the active lesson element into view on mount
  const activeLinkRef = useRef(null);
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentLessonId]);

  // Keyboard navigation within the sidebar elements
  const listRef = useRef(null);
  const handleKeyDown = (e) => {
    if (!listRef.current) return;
    const focusable = Array.from(listRef.current.querySelectorAll("a:not([aria-disabled='true']), button"));
    const active = document.activeElement;
    const index = focusable.indexOf(active);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = (index + 1) % focusable.length;
      focusable[nextIdx]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIdx = (index - 1 + focusable.length) % focusable.length;
      focusable[prevIdx]?.focus();
    }
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--card)]">
      {/* Header */}
      <div className="flex min-h-0 items-start justify-between gap-3 border-b p-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Course Map
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5">{roadmapGoal}</p>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setIsMobileOpen(false);
          }}
          title="Close course navigation"
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg hover:bg-[var(--muted)]"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      {/* Phase + lesson list */}
      <nav
        ref={listRef}
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-y-auto py-1 space-y-1"
        aria-label="Course Curriculum"
      >
        {phases.map((phase, phaseIndex) => {
          const phaseLessons = lessonsForPhase(lessons, phase._id);
          const completed = phaseLessons.filter((l) => l.status === "completed").length;
          const isExpanded = expandedPhases[phase._id] ?? false;

          return (
            <div key={phase._id} className="border-b last:border-b-0">
              {/* Phase header/toggle */}
              <button
                onClick={() => togglePhase(phase._id)}
                aria-expanded={isExpanded}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-inset"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                    Phase {phaseIndex + 1}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold">{phase.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {completed}/{phaseLessons.length} completed
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="size-4 shrink-0 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronRight className="size-4 shrink-0 text-[var(--muted-foreground)]" />
                )}
              </button>

              {/* Lessons inside phase */}
              {isExpanded && (
                <div className="pb-1 bg-[var(--muted)]/10 space-y-0.5" role="group">
                  {phaseLessons.map((lesson) => {
                    const isCurrent = lesson._id === currentLessonId;
                    const isDone = lesson.status === "completed";
                    const isLocked = isLessonLocked(lesson);

                    return isLocked ? (
                      <div
                        key={lesson._id}
                        aria-disabled="true"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm leading-5 text-[var(--muted-foreground)] opacity-50 cursor-not-allowed select-none"
                      >
                        <Lock className="size-4 shrink-0" />
                        <span className="line-clamp-2">{lesson.title}</span>
                      </div>
                    ) : (
                      <Link
                        key={lesson._id}
                        ref={isCurrent ? activeLinkRef : null}
                        href={`/lesson/${lesson._id}`}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm leading-5 transition-colors hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-inset",
                          isCurrent
                            ? "bg-[var(--secondary)] font-semibold text-[var(--secondary-foreground)] border-l-2 border-[var(--primary)]"
                            : "",
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        ) : (
                          <Circle
                            className={cn(
                              "size-4 shrink-0",
                              isCurrent
                                ? "text-[var(--primary)]"
                                : "text-[var(--muted-foreground)]",
                            )}
                          />
                        )}
                        <span className="line-clamp-2">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* ── Mobile Overlay Drawer ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative flex w-80 max-w-xs flex-col bg-[var(--card)] shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ── Desktop Collapsible Sidebar ── */}
      {isOpen ? (
        <aside className="hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r bg-[var(--card)] sticky top-16 lg:block z-20">
          {renderSidebarContent()}
        </aside>
      ) : (
        <aside className="hidden w-12 shrink-0 flex-col items-center border-r bg-[var(--card)] pt-4 sticky top-16 h-[calc(100vh-4rem)] lg:flex z-20">
          <button
            onClick={() => setIsOpen(true)}
            title="Open course navigation"
            className="grid size-9 place-items-center rounded-lg hover:bg-[var(--muted)]"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        </aside>
      )}
    </>
  );
}
