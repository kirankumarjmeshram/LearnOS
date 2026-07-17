"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

function ProgressBar({ value }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
      <div
        className="h-full bg-[var(--primary)] transition-all duration-300"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export function RoadmapView({ roadmap, phases = [], lessons = [], progress }) {
  const lessonsForPhase = (phaseId) =>
    lessons.filter((lesson) => lesson.phaseId.toString() === phaseId.toString());

  return (
    <section className="space-y-8">
      {/* Roadmap Header Card */}
      <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Active Roadmap
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {roadmap.goal}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
          {roadmap.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-xs">
          <div>
            <p className="text-[var(--muted-foreground)] font-semibold">Duration</p>
            <p className="mt-1 font-bold text-sm">{roadmap.duration}</p>
          </div>
          <div>
            <p className="text-[var(--muted-foreground)] font-semibold">Difficulty</p>
            <p className="mt-1 font-bold text-sm">{roadmap.difficulty}</p>
          </div>
          <div>
            <p className="text-[var(--muted-foreground)] font-semibold">Completion</p>
            <p className="mt-1 font-bold text-sm">{progress.progressPercentage}%</p>
          </div>
        </div>
        <ProgressBar value={progress.progressPercentage} />
        <p className="mt-2 text-xs text-[var(--muted-foreground)] font-medium">
          {progress.completedLessons} of {progress.totalLessons} lessons completed
        </p>
      </div>

      {/* Modules/Phases List */}
      <div className="space-y-4">
        {phases.map((phase, phaseIndex) => {
          const phaseLessons = lessonsForPhase(phase._id);
          const completedCount = phaseLessons.filter((l) => l.status === "completed").length;
          const pct = phaseLessons.length > 0 ? Math.round((completedCount / phaseLessons.length) * 100) : 0;

          return (
            <details
              key={phase._id.toString()}
              className="group overflow-hidden rounded-2xl border bg-[var(--card)] transition-all hover:shadow-md"
              open={phaseIndex === 0}
            >
              {/* Improved Module Card Summary */}
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 hover:bg-[var(--secondary)]/10">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                      Module {phaseIndex + 1}
                    </span>
                    <span className="inline-flex rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                      {roadmap.difficulty}
                    </span>
                    <span className="text-[11px] text-[var(--muted-foreground)] font-semibold">
                      {phase.weeks} week{phase.weeks === 1 ? "" : "s"}
                    </span>
                  </div>
                  
                  <h2 className="mt-2 text-lg font-bold tracking-tight">{phase.title}</h2>
                  <p className="mt-2 text-xs text-[var(--muted-foreground)] line-clamp-2">
                    {phase.description}
                  </p>

                  {/* Metadata Indicators */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-6 text-xs text-[var(--muted-foreground)]">
                    <div>
                      <span className="font-bold text-[var(--foreground)]">{phaseLessons.length}</span> Lessons
                    </div>
                    <div>
                      <span className="font-bold text-[var(--foreground)]">1</span> Quiz
                    </div>
                    <div>
                      <span className="font-bold text-[var(--foreground)]">{phase.projects?.length || 1}</span> Project
                    </div>
                    <div>
                      <span className="font-bold text-[var(--foreground)]">{phaseLessons.length * 1}</span> Hours
                    </div>
                    
                    {/* Completion bar */}
                    <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto pt-2 sm:pt-0">
                      <span className="font-semibold text-[var(--foreground)]">{pct}% Complete</span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--muted)] inline-block">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="size-5 shrink-0 transition-transform group-open:rotate-90 text-[var(--muted-foreground)]" />
              </summary>

              {/* Module contents */}
              <div className="border-t p-6 space-y-6 bg-[var(--secondary)]/5">
                {Array.from({ length: phase.weeks }, (_, index) => index + 1).map((week) => {
                  const weekLessons = phaseLessons.filter((lesson) => lesson.week === week);
                  
                  return (
                    <div key={week} className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                        Week {week}
                      </p>
                      
                      {weekLessons.length > 0 ? (
                        <div className="grid gap-3">
                          {weekLessons.map((lesson) => {
                            const isDone = lesson.status === "completed";
                            return (
                              <Link
                                key={lesson._id.toString()}
                                href={`/lesson/${lesson._id.toString()}`}
                                className="flex items-center justify-between gap-4 rounded-xl border bg-[var(--card)] p-4 hover:border-[var(--primary)] hover:shadow-sm transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={cn(
                                      "grid size-8 place-items-center rounded-full transition-colors",
                                      isDone
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                        : "bg-[var(--muted)] text-[var(--muted-foreground)]",
                                    )}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="size-4" />
                                    ) : (
                                      <Circle className="size-4" />
                                    )}
                                  </span>
                                  <div>
                                    <p className="font-semibold text-sm">{lesson.title}</p>
                                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)] truncate max-w-md">
                                      {lesson.estimatedDuration} · {lesson.topics.join(", ")}
                                    </p>
                                  </div>
                                </div>
                                <BookOpen className="size-4 text-[var(--primary)] shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="rounded-xl border border-dashed p-4 text-xs text-[var(--muted-foreground)] bg-[var(--card)]">
                          Lessons for this week will be organized as you progress.
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Module Capstone Section */}
                <div className="mt-8 rounded-xl border border-dashed bg-[var(--secondary)]/20 p-5 space-y-4">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    🏆 Phase {phaseIndex + 1} Capstone & Completion
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] leading-5">
                    Complete all lessons in this phase to unlock the capstone quiz, assessment, and earn your phase certificate.
                  </p>
                  
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    {/* Quiz */}
                    <div
                      className={cn(
                        "rounded-lg border p-3 flex items-center justify-between transition-all bg-[var(--card)]",
                        pct === 100
                          ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                          : "opacity-60",
                      )}
                    >
                      <div>
                        <p className="font-bold">Phase Quiz</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">
                          {pct === 100 ? "Available" : "Locked"}
                        </p>
                      </div>
                      <span className="text-base">{pct === 100 ? "📝" : "🔒"}</span>
                    </div>

                    {/* Mini Project */}
                    <div
                      className={cn(
                        "rounded-lg border p-3 flex items-center justify-between transition-all bg-[var(--card)]",
                        pct === 100
                          ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                          : "opacity-60",
                      )}
                    >
                      <div>
                        <p className="font-bold">Mini Project</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">
                          {pct === 100 ? "Ready to Submit" : "Locked"}
                        </p>
                      </div>
                      <span className="text-base">{pct === 100 ? "💻" : "🔒"}</span>
                    </div>

                    {/* Certificate */}
                    <div
                      className={cn(
                        "rounded-lg border p-3 flex items-center justify-between transition-all bg-[var(--card)]",
                        pct === 100
                          ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                          : "opacity-60",
                      )}
                    >
                      <div>
                        <p className="font-bold">Completion Certificate</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">
                          {pct === 100 ? "Earned" : "Locked"}
                        </p>
                      </div>
                      <span className="text-base">{pct === 100 ? "🎓" : "🔒"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
