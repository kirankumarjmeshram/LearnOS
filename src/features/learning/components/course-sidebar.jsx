"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";

function lessonsForPhase(lessons, phaseId) {
  return lessons.filter((l) => l.phaseId === phaseId);
}

export function CourseSidebar({ roadmapGoal, phases, lessons, currentLessonId }) {
  const [isOpen, setIsOpen] = useState(true);

  // Default-expand the phase that contains the current lesson
  const currentLesson = lessons.find((l) => l._id === currentLessonId);
  const [expandedPhases, setExpandedPhases] = useState(() =>
    currentLesson ? { [currentLesson.phaseId]: true } : {},
  );

  const togglePhase = (phaseId) =>
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));

  // Collapsed sidebar — just a toggle button
  if (!isOpen) {
    return (
      <aside className="flex w-12 shrink-0 flex-col items-center border-r bg-[var(--card)] pt-4">
        <button
          onClick={() => setIsOpen(true)}
          title="Open course navigation"
          className="grid size-9 place-items-center rounded-lg hover:bg-[var(--muted)]"
        >
          <PanelLeftOpen className="size-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-r bg-[var(--card)]">
      {/* Header */}
      <div className="flex min-h-0 items-start justify-between gap-3 border-b p-4">
        <p className="line-clamp-3 text-sm font-semibold leading-5">{roadmapGoal}</p>
        <button
          onClick={() => setIsOpen(false)}
          title="Close course navigation"
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg hover:bg-[var(--muted)]"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      {/* Phase + lesson list */}
      <nav className="flex-1 overflow-y-auto py-1">
        {phases.map((phase, phaseIndex) => {
          const phaseLessons = lessonsForPhase(lessons, phase._id);
          const completed = phaseLessons.filter((l) => l.status === "completed").length;
          const isExpanded = expandedPhases[phase._id] ?? false;

          return (
            <div key={phase._id} className="border-b last:border-b-0">
              {/* Phase toggle */}
              <button
                onClick={() => togglePhase(phase._id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--muted)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                    Phase {phaseIndex + 1}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium">{phase.title}</p>
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

              {/* Lessons */}
              {isExpanded && (
                <div className="pb-1">
                  {phaseLessons.map((lesson) => {
                    const isCurrent = lesson._id === currentLessonId;
                    const isDone = lesson.status === "completed";

                    return (
                      <Link
                        key={lesson._id}
                        href={`/lesson/${lesson._id}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm leading-5 transition-colors hover:bg-[var(--muted)]",
                          isCurrent &&
                            "bg-[var(--secondary)] font-medium text-[var(--secondary-foreground)]",
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
    </aside>
  );
}
