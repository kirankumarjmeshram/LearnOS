"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ChevronRight,
  Clock,
  FileText,
  Share2,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

export function RightProgressPanel({
  currentPhaseName = "Current Module",
  completedLessons = 0,
  totalLessons     = 0,
  nextLessonId     = null,
  lessonId         = "",
}) {
  // Read bookmark state synchronously from localStorage on mount (lazy initializer)
  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const bookmarks = JSON.parse(localStorage.getItem("learnos:bookmarks") ?? "[]");
      return bookmarks.includes(lessonId);
    } catch {
      return false;
    }
  });

  const toggleBookmark = () => {
    try {
      let bookmarks = JSON.parse(localStorage.getItem("learnos:bookmarks") ?? "[]");
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
    } catch {
      toast.error("Could not save bookmark.");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => null);
      toast.success("Link copied to clipboard!");
    }
  };

  const progressPct =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const remainingMins = Math.max(0, totalLessons - completedLessons) * 45;
  const timeLeft =
    remainingMins >= 60
      ? `${Math.floor(remainingMins / 60)}h ${remainingMins % 60}m`
      : `${remainingMins}m`;

  return (
    <aside className="hidden h-full w-56 shrink-0 flex-col gap-0 overflow-y-auto border-l bg-[var(--card)] xl:flex">
      <div className="space-y-5 p-4">
        
        {/* Module progress */}
        <div className="space-y-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Module Progress
          </p>
          <p
            className="text-xs font-semibold leading-4 line-clamp-2"
            title={currentPhaseName}
          >
            {currentPhaseName}
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-semibold">
              <span>{completedLessons}/{totalLessons} Lessons</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[var(--muted)]">
              <div
                className="h-full bg-[var(--primary)] transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)]">
            <Clock className="size-3" />
            <span>{timeLeft} remaining</span>
          </div>
        </div>

        <hr />

        {/* Quick actions */}
        <div className="space-y-1.5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Quick Actions
          </p>

          <button
            type="button"
            onClick={toggleBookmark}
            className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              isBookmarked
                ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400"
                : "hover:bg-[var(--muted)]"
            }`}
          >
            <Bookmark className={`size-3.5 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--muted)] transition-colors"
          >
            <Share2 className="size-3.5" />
            Share Lesson
          </button>

          <a
            href="#notes-section"
            className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--muted)] transition-colors"
          >
            <FileText className="size-3.5" />
            Jump to Notes
          </a>
        </div>

        <hr />

        {/* Next lesson */}
        {nextLessonId ? (
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Next Up
            </p>
            <Link
              href={`/lesson/${nextLessonId}`}
              className="flex w-full items-center justify-between gap-1.5 rounded-lg bg-[var(--primary)] px-2.5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
            >
              Continue
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5 rounded-lg border border-dashed p-3 text-center">
            <Trophy className="size-4 mx-auto text-emerald-600" />
            <p className="text-[10px] font-semibold">Module Complete!</p>
            <p className="text-[10px] leading-3.5 text-[var(--muted-foreground)]">
              All lessons done.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
