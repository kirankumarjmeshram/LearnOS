"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers3,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

function ProgressBar({ value }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
      <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export function RoadmapCard({ roadmap }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const progress = roadmap.progress;
  const isArchived = roadmap.status === "archived";
  const isCompleted = roadmap.status === "completed";
  const progressPct = progress?.progressPercentage ?? 0;
  const completedLessons = progress?.completedLessons ?? 0;
  const totalLessons = progress?.totalLessons ?? 0;
  const streak = progress?.streak ?? 0;
  const currentLessonId = progress?.currentLessonId;

  const handleStatus = async (newStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/roadmap/${roadmap._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error);
      }
      toast.success(newStatus === "archived" ? "Roadmap archived." : "Roadmap resumed.");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not update roadmap.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
      {/* Status badge + title */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
              isArchived
                ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
                : isCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-[var(--secondary)] text-[var(--primary)]",
            )}
          >
            {isArchived ? "Archived" : isCompleted ? "Completed" : "Active"}
          </span>
          <h2 className="mt-2 text-lg font-semibold leading-6">{roadmap.goal}</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {roadmap.difficulty} · {roadmap.duration} · {roadmap.estimatedHoursPerWeek}h/week
          </p>
        </div>

        {!isArchived && (
          <Link
            href={
              currentLessonId
                ? `/lesson/${currentLessonId}`
                : `/roadmap?id=${roadmap._id}`
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
          >
            {isCompleted ? "Review" : "Resume"}
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">
            {completedLessons} / {totalLessons} lessons
          </span>
          <span className="font-semibold">{progressPct}%</span>
        </div>
        <ProgressBar value={progressPct} />
      </div>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted-foreground)]">
        {roadmap.lastStudiedAt && (
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            Last studied {format(new Date(roadmap.lastStudiedAt), "MMM d, yyyy")}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          Created {format(new Date(roadmap.createdAt), "MMM d, yyyy")}
        </span>
        {streak > 0 && (
          <span className="flex items-center gap-1">
            🔥 {streak} day streak
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3 border-t pt-4">
        <Link
          href={`/roadmap?id=${roadmap._id}`}
          className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <span className="flex items-center gap-1">
            <Layers3 className="size-3.5" />
            View roadmap
          </span>
        </Link>
        {!isArchived ? (
          <button
            onClick={() => handleStatus("archived")}
            disabled={isLoading}
            className="ml-auto flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50"
          >
            <Archive className="size-3.5" />
            Archive
          </button>
        ) : (
          <button
            onClick={() => handleStatus("active")}
            disabled={isLoading}
            className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            Resume
          </button>
        )}
      </div>
    </article>
  );
}
