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
} from "lucide-react";

import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLessonsForPhase(lessons, phaseId) {
  return lessons.filter((l) => l.phaseId === phaseId);
}

function getNextIncompleteOrder(lessons) {
  const incomplete = lessons.find((l) => l.status !== "completed");
  return incomplete?.order ?? Infinity;
}

function readExpandedPhases(roadmapId, currentLesson) {
  if (typeof window === "undefined") {
    return currentLesson ? { [currentLesson.phaseId]: true } : {};
  }
  try {
    const stored = localStorage.getItem(`learnos:phases:${roadmapId}`);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return currentLesson ? { [currentLesson.phaseId]: true } : {};
}

// ─── Phase header (phase + its lessons list) ─────────────────────────────────

function PhaseSection({
  phase,
  phaseIndex,
  phaseLessons,
  currentLessonId,
  nextIncompleteOrder,
  isExpanded,
  onToggle,
  onLessonClick,
  activeLinkRef,
}) {
  const completed = phaseLessons.filter((l) => l.status === "completed").length;

  return (
    <div className="border-b last:border-b-0">
      {/* Phase toggle button */}
      <button
        onClick={() => onToggle(phase._id)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-[var(--muted)]/40 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--ring)]"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--primary)]">
            Phase {phaseIndex + 1}
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold leading-4">
            {phase.title}
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">
            {completed}/{phaseLessons.length}
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown className="size-3.5 shrink-0 text-[var(--muted-foreground)]" />
        ) : (
          <ChevronRight className="size-3.5 shrink-0 text-[var(--muted-foreground)]" />
        )}
      </button>

      {/* Lesson list */}
      {isExpanded && (
        <div role="group">
          {phaseLessons.map((lesson) => {
            const isCurrent = lesson._id === currentLessonId;
            const isDone    = lesson.status === "completed";
            const isLocked  = lesson.order > nextIncompleteOrder;

            if (isLocked) {
              return (
                <div
                  key={lesson._id}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-2 px-4 py-2 text-[var(--muted-foreground)] opacity-40 select-none"
                >
                  <Lock className="size-3 shrink-0" />
                  <span className="line-clamp-2 text-xs">{lesson.title}</span>
                </div>
              );
            }

            return (
              <Link
                key={lesson._id}
                ref={isCurrent ? activeLinkRef : null}
                href={`/lesson/${lesson._id}`}
                onClick={onLessonClick}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-[var(--muted)]/60 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--ring)]",
                  isCurrent
                    ? "border-l-2 border-[var(--primary)] bg-[var(--secondary)] font-semibold text-[var(--secondary-foreground)]"
                    : "text-[var(--muted-foreground)]",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-3 shrink-0 text-emerald-600" />
                ) : (
                  <Circle
                    className={cn(
                      "size-3 shrink-0",
                      isCurrent ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
                    )}
                  />
                )}
                <span className="line-clamp-2 leading-4">{lesson.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Inner sidebar content (shared between desktop and mobile) ────────────────

function SidebarInner({
  roadmapGoal,
  phases,
  lessons,
  currentLessonId,
  expandedPhases,
  onTogglePhase,
  onCollapse,
  onLessonClick,
  activeLinkRef,
  listRef,
  onKeyDown,
}) {
  const nextIncompleteOrder = getNextIncompleteOrder(lessons);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--card)]">
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-2 border-b p-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Course
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-4">
            {roadmapGoal}
          </p>
        </div>
        <button
          onClick={onCollapse}
          title="Collapse sidebar"
          className="shrink-0 grid size-7 place-items-center rounded-md hover:bg-[var(--muted)]"
        >
          <PanelLeftClose className="size-3.5" />
        </button>
      </div>

      {/* Phase + lesson navigation */}
      <nav
        ref={listRef}
        onKeyDown={onKeyDown}
        className="flex-1 overflow-y-auto"
        aria-label="Course curriculum"
      >
        {phases.map((phase, phaseIdx) => (
          <PhaseSection
            key={phase._id}
            phase={phase}
            phaseIndex={phaseIdx}
            phaseLessons={getLessonsForPhase(lessons, phase._id)}
            currentLessonId={currentLessonId}
            nextIncompleteOrder={nextIncompleteOrder}
            isExpanded={expandedPhases[phase._id] ?? false}
            onToggle={onTogglePhase}
            onLessonClick={onLessonClick}
            activeLinkRef={activeLinkRef}
          />
        ))}
      </nav>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function CourseSidebar({ roadmapGoal, phases, lessons, currentLessonId }) {
  const [isOpen, setIsOpen]           = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentLesson = lessons.find((l) => l._id === currentLessonId);
  const roadmapId     = currentLesson?.roadmapId ?? "";

  const [expandedPhases, setExpandedPhases] = useState(() =>
    readExpandedPhases(roadmapId, currentLesson),
  );

  const togglePhase = (phaseId) => {
    setExpandedPhases((prev) => {
      const next = { ...prev, [phaseId]: !prev[phaseId] };
      try {
        localStorage.setItem(`learnos:phases:${roadmapId}`, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Mobile drawer toggle via custom event from DashboardLayout
  useEffect(() => {
    const onToggle = () => setIsMobileOpen((v) => !v);
    window.addEventListener("toggle-learning-sidebar", onToggle);
    return () => window.removeEventListener("toggle-learning-sidebar", onToggle);
  }, []);

  // Auto-scroll active lesson into view
  const activeLinkRef = useRef(null);
  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentLessonId]);

  // Keyboard nav within sidebar list
  const listRef = useRef(null);
  const onKeyDown = (e) => {
    if (!listRef.current) return;
    const focusable = Array.from(
      listRef.current.querySelectorAll("a:not([aria-disabled='true']), button"),
    );
    const idx = focusable.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusable[(idx + 1) % focusable.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusable[(idx - 1 + focusable.length) % focusable.length]?.focus();
    }
  };

  const handleCollapse = () => {
    setIsOpen(false);
    setIsMobileOpen(false);
  };

  const sharedProps = {
    roadmapGoal,
    phases,
    lessons,
    currentLessonId,
    expandedPhases,
    onTogglePhase: togglePhase,
    onCollapse: handleCollapse,
    onLessonClick: () => setIsMobileOpen(false),
    activeLinkRef,
    listRef,
    onKeyDown,
  };

  return (
    <>
      {/* ── Mobile drawer overlay ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] shadow-2xl">
            <SidebarInner {...sharedProps} />
          </div>
        </div>
      )}

      {/* ── Desktop: expanded ── */}
      {isOpen ? (
        <aside className="hidden h-full w-64 shrink-0 border-r lg:block">
          <SidebarInner {...sharedProps} />
        </aside>
      ) : (
        /* ── Desktop: collapsed strip ── */
        <aside className="hidden h-full w-10 shrink-0 flex-col items-center border-r pt-3 lg:flex">
          <button
            onClick={() => setIsOpen(true)}
            title="Expand sidebar"
            className="grid size-7 place-items-center rounded-md hover:bg-[var(--muted)]"
          >
            <PanelLeftOpen className="size-3.5" />
          </button>
        </aside>
      )}
    </>
  );
}
