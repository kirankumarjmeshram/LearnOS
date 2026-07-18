"use client";

import Link from "next/link";
import { memo, useMemo, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Lock,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLessonsForPhase(lessons, phaseId) {
  return lessons.filter((l) => l.phaseId === phaseId);
}

// ─── Phase header (phase + its lessons list) ─────────────────────────────────

const PhaseSection = memo(function PhaseSection({
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
  const progressPct = phaseLessons.length > 0 ? Math.round((completed / phaseLessons.length) * 100) : 0;

  return (
    <div className="border-b border-[var(--border)] last:border-b-0 pb-2 mb-2">
      {/* Phase toggle button */}
      <button
        onClick={() => onToggle(phase._id)}
        aria-expanded={isExpanded}
        className="group flex w-full flex-col px-4 py-3 text-left hover:bg-[var(--muted)]/40 transition-colors focus:outline-none focus:bg-[var(--muted)]/60"
      >
        <div className="flex w-full items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Module {phaseIndex + 1}
          </p>
          {isExpanded ? (
            <ChevronDown className="size-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
          ) : (
            <ChevronRight className="size-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
          )}
        </div>
        
        <p className="mt-1 text-sm font-bold leading-tight text-[var(--foreground)]">
          {phase.title}
        </p>
        
        <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-[var(--muted-foreground)]">
          <span>{completed} / {phaseLessons.length} Lessons</span>
          <span>{progressPct}%</span>
        </div>
        
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]">
          <div
            className="h-full bg-[var(--primary)] transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </button>

      {/* Lesson list */}
      {isExpanded && (
        <div role="group" className="mt-2 space-y-0.5 px-2">
          {phaseLessons.map((lesson) => {
            const isCurrent = lesson._id === currentLessonId;
            const isDone    = lesson.status === "completed";
            const isLocked  = lesson.order > nextIncompleteOrder;
            
            // Strip phase title from lesson title
            const strippedTitle = lesson.title.includes(":") 
              ? lesson.title.split(":").slice(1).join(":").trim() 
              : lesson.title;

            if (isLocked) {
              return (
                <div
                  key={lesson._id}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-start gap-2.5 rounded-lg px-2.5 py-2 text-[var(--muted-foreground)] opacity-50 select-none"
                >
                  <Lock className="mt-0.5 size-3.5 shrink-0" />
                  <span className="text-xs font-medium leading-relaxed">{strippedTitle}</span>
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
                  "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
                  isCurrent
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] font-medium",
                )}
              >
                {isDone ? (
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                ) : isCurrent ? (
                  <Circle className="mt-0.5 size-3.5 shrink-0 fill-current" />
                ) : (
                  <Circle className="mt-0.5 size-3.5 shrink-0" />
                )}
                <span className="leading-relaxed">{strippedTitle}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

// ─── Inner sidebar content (shared between desktop and mobile) ────────────────

function getNextIncompleteOrder(lessons) {
  const incomplete = lessons.find((l) => l.status !== "completed");
  return incomplete?.order ?? Infinity;
}

function SidebarInner({
  roadmapGoal,
  phases,
  lessons,
  currentLessonId,
  expandedPhases,
  onTogglePhase,
  onLessonClick,
  activeLinkRef,
  listRef,
  onKeyDown,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const nextIncompleteOrder = getNextIncompleteOrder(lessons);

  // Filter logic
  const query = searchQuery.toLowerCase().trim();
  
  const { filteredPhases, filteredLessons } = useMemo(() => {
    if (!query) return { filteredPhases: phases, filteredLessons: lessons };
    
    const matchedLessons = lessons.filter(l => l.title.toLowerCase().includes(query));
    const matchedPhaseIds = new Set(matchedLessons.map(l => l.phaseId));
    const matchedPhases = phases.filter(p => matchedPhaseIds.has(p._id));
    
    return { filteredPhases: matchedPhases, filteredLessons: matchedLessons };
  }, [query, phases, lessons]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Roadmap
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-tight">
            {roadmapGoal}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-1.5 pl-9 pr-8 text-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Phase + lesson navigation */}
      <nav
        ref={listRef}
        onKeyDown={onKeyDown}
        className="flex-1 overflow-y-auto pb-4"
        aria-label="Course curriculum"
      >
        {filteredPhases.length === 0 ? (
          <div className="p-4 text-center text-xs text-[var(--muted-foreground)]">
            No lessons found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredPhases.map((phase, phaseIdx) => (
            <PhaseSection
              key={phase._id}
              phase={phase}
              phaseIndex={phaseIdx}
              phaseLessons={getLessonsForPhase(filteredLessons, phase._id)}
              currentLessonId={currentLessonId}
              nextIncompleteOrder={nextIncompleteOrder}
              isExpanded={query.length > 0 ? true : (expandedPhases[phase._id] ?? false)}
              onToggle={onTogglePhase}
              onLessonClick={onLessonClick}
              activeLinkRef={activeLinkRef}
            />
          ))
        )}
      </nav>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

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

export function CourseSidebar({ roadmapGoal, phases, lessons, currentLessonId }) {
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
    activeLinkRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  const sharedProps = {
    roadmapGoal,
    phases,
    lessons,
    currentLessonId,
    expandedPhases,
    onTogglePhase: togglePhase,
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-[300px] max-w-[85vw] shadow-2xl">
            <SidebarInner {...sharedProps} />
          </div>
        </div>
      )}

      {/* ── Desktop: expanded ── */}
      <aside className="hidden h-full w-[300px] shrink-0 border-r border-[var(--border)] lg:block">
        <SidebarInner {...sharedProps} />
      </aside>
    </>
  );
}
