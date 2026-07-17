"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Clock, Compass, FileText, Share2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";

export function RightProgressPanel({
  currentPhaseName = "Current Module",
  completedLessons = 0,
  totalLessons = 0,
  nextLessonId = null,
  lessonId = "",
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Load bookmark status from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const bookmarks = JSON.parse(localStorage.getItem("learnos:bookmarks") || "[]");
        setIsBookmarked(bookmarks.includes(lessonId));
      } catch (e) {
        // ignore
      }
    }
  }, [lessonId]);

  const toggleBookmark = () => {
    if (typeof window !== "undefined") {
      try {
        let bookmarks = JSON.parse(localStorage.getItem("learnos:bookmarks") || "[]");
        if (bookmarks.includes(lessonId)) {
          bookmarks = bookmarks.filter((id) => id !== lessonId);
          setIsBookmarked(false);
          toast.success("Bookmark removed.");
        } else {
          bookmarks.push(lessonId);
          setIsBookmarked(true);
          toast.success("Lesson bookmarked.");
        }
        localStorage.setItem("learnos:bookmarks", JSON.stringify(bookmarks));
      } catch (e) {
        toast.error("Could not save bookmark.");
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lesson link copied to clipboard!");
    }
  };

  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  // Calculate remaining estimated hours (assume 45 min per remaining lesson)
  const remainingLessons = Math.max(0, totalLessons - completedLessons);
  const remainingMinutes = remainingLessons * 45;
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const timeRemainingStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 p-5 border-l bg-[var(--card)] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto xl:flex z-10">
      {/* Current Module Progress */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Module Progress
          </p>
          <h4 className="mt-1 text-sm font-semibold truncate" title={currentPhaseName}>
            {currentPhaseName}
          </h4>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>{completedLessons} / {totalLessons} Lessons</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Clock className="size-3.5" />
          <span>{timeRemainingStr} remaining</span>
        </div>
      </div>

      <hr />

      {/* Actions */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          Lesson Actions
        </p>

        {/* Bookmark */}
        <button
          type="button"
          onClick={toggleBookmark}
          className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold transition-colors ${
            isBookmarked
              ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-950 dark:bg-amber-950/20 dark:text-amber-300"
              : "hover:bg-[var(--muted)]"
          }`}
        >
          <Bookmark className={`size-4 ${isBookmarked ? "fill-current" : ""}`} />
          <span>{isBookmarked ? "Bookmarked" : "Bookmark Lesson"}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold hover:bg-[var(--muted)] transition-colors"
        >
          <Share2 className="size-4" />
          <span>Share Lesson</span>
        </button>

        {/* Notes Jump shortcut */}
        <a
          href="#notes-section"
          className="flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold hover:bg-[var(--muted)] transition-colors"
        >
          <FileText className="size-4" />
          <span>Jump to Notes</span>
        </a>
      </div>

      <hr />

      {/* Continue Learning Widget */}
      {nextLessonId && (
        <div className="rounded-xl border bg-[var(--secondary)]/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Compass className="size-3.5" />
            <span>Next Up</span>
          </div>
          <p className="text-xs font-semibold line-clamp-2">
            Proceed to the next lesson to keep up the momentum.
          </p>
          <Link
            href={`/lesson/${nextLessonId}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90"
          >
            Continue Learning
          </Link>
        </div>
      )}

      {/* Achievements / Encouragement */}
      <div className="mt-auto rounded-xl border border-dashed p-4 text-center space-y-2 bg-[var(--card)]">
        <Trophy className="size-5 mx-auto text-emerald-600 animate-bounce" />
        <p className="text-xs font-semibold">Milestone Target</p>
        <p className="text-[10px] leading-4 text-[var(--muted-foreground)]">
          Complete modules to unlock completion certificates.
        </p>
      </div>
    </aside>
  );
}
