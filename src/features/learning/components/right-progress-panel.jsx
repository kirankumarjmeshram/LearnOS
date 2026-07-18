"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ChevronRight,
  ExternalLink,
  LoaderCircle,
  Sparkles,
  Save,
  Check,
  Video,
  FileText,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const iconByType = {
  youtube: Video,
  documentation: FileText,
  website: Link2,
  other: Link2,
};

export function LearningHub({
  lesson,
  currentPhaseName = "Current Module",
  phases = [],
  lessons = [],
  aiResources = [],
  globalResources = [],
  noteContent = "",
  onOpenResources,
}) {
  const lessonId = lesson?._id;

  // ─── Module Progress ────────────────────────────────────────────────────────
  const phaseLessons = lessons.filter((l) => l.phaseId === lesson?.phaseId);
  const completedLessons = phaseLessons.filter((l) => l.status === "completed").length;
  const totalLessons = phaseLessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Next lesson in module
  const nextLessonIndex = phaseLessons.findIndex(l => l.order > lesson.order);
  const nextLesson = nextLessonIndex > -1 ? phaseLessons[nextLessonIndex] : null;

  // ─── Bookmarks ─────────────────────────────────────────────────────────────
  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (typeof window === "undefined" || !lessonId) return false;
    try {
      const bookmarks = JSON.parse(localStorage.getItem("learnos:bookmarks") ?? "[]");
      return bookmarks.includes(lessonId);
    } catch {
      return false;
    }
  });

  const toggleBookmark = () => {
    if (!lessonId) return;
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

  // ─── Notes Auto-save ───────────────────────────────────────────────────────
  const [content, setContent] = useState(noteContent ?? "");
  const [status, setStatus] = useState("saved"); // "saved" | "pending" | "saving" | "error"
  const timerRef = useRef(null);

  const saveNote = async (nextContent) => {
    if (!lessonId) return;
    setStatus("saving");
    try {
      const response = await fetch(`/api/lessons/${lessonId}/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent }),
      });
      if (!response.ok) throw new Error();
      setStatus("saved");
    } catch (error) {
      setStatus("error");
      toast.error("Could not save note.");
    }
  };

  const handleNoteChange = (event) => {
    const nextContent = event.target.value;
    setContent(nextContent);
    setStatus("pending");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => saveNote(nextContent), 1000);
  };

  // ─── Quick Resources ───────────────────────────────────────────────────────
  const quickResources = [...globalResources, ...aiResources].slice(0, 4);

  return (
    <aside className="hidden h-full w-[320px] shrink-0 flex-col gap-0 overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] xl:flex shadow-sm">
      <div className="flex items-center gap-2 border-b border-[var(--border)] p-4">
        <h2 className="text-sm font-bold tracking-tight">Learning Hub</h2>
      </div>

      <div className="flex-1 space-y-8 p-5">
        
        {/* Module Progress */}
        <section className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Module Progress
              </p>
              <span className="text-[10px] font-bold text-[var(--foreground)]">{completedLessons} / {totalLessons} Lessons</span>
            </div>
            <p className="mt-1 text-xs font-semibold leading-tight line-clamp-2">
              {currentPhaseName}
            </p>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full bg-[var(--primary)] transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <div className="flex gap-3">
              <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] w-12 shrink-0">Current</span>
              <span className="text-xs font-semibold line-clamp-1">{lesson.title.split(":").pop()?.trim()}</span>
            </div>
            {nextLesson && (
              <div className="flex gap-3">
                <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] w-12 shrink-0">Next</span>
                <Link href={`/lesson/${nextLesson._id}`} className="text-xs font-semibold line-clamp-1 hover:text-[var(--primary)] transition-colors">
                  {nextLesson.title.split(":").pop()?.trim()}
                </Link>
              </div>
            )}
          </div>
        </section>

        <hr className="border-[var(--border)]" />

        {/* Embedded Notes */}
        <section className="space-y-3 flex flex-col h-64">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-1.5">
              📝 Notes
            </p>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-[var(--muted-foreground)]">
              {status === "saving" ? (
                <><LoaderCircle className="size-3 animate-spin" /> Saving</>
              ) : status === "saved" ? (
                <><Check className="size-3 text-emerald-600" /> Saved</>
              ) : status === "error" ? (
                "Error"
              ) : (
                <><Save className="size-3" /> Unsaved</>
              )}
            </span>
          </div>
          <textarea
            value={content}
            onChange={handleNoteChange}
            placeholder="Type your markdown notes here..."
            className="flex-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 font-mono text-[11px] leading-5 outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)] resize-none"
          />
        </section>

        <hr className="border-[var(--border)]" />

        {/* Quick Resources */}
        <section className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-1.5">
            ⭐ Quick Resources
          </p>
          
          <div className="space-y-1.5">
            {quickResources.map(res => {
              const Icon = iconByType[res.type] || Link2;
              const url = res.filePath || res.url;
              return (
                <a key={res._id} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-lg p-2 text-xs font-semibold hover:bg-[var(--muted)] transition-colors">
                  <Icon className="size-3.5 text-[var(--muted-foreground)] shrink-0" />
                  <span className="line-clamp-1 min-w-0 flex-1">{res.title}</span>
                </a>
              )
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onOpenResources();
                // Optionally scroll to form when the drawer opens
                setTimeout(() => {
                  const form = document.querySelector('form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-1 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-bold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-center"
            >
              + Add Resource
            </button>
            <button
              onClick={onOpenResources}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-center"
            >
              View All
            </button>
          </div>
        </section>

        <hr className="border-[var(--border)]" />

        {/* Tools & Bookmarks */}
        <section className="space-y-2">
          <button
            onClick={() => toast.info("Ask AI is coming soon!")}
            className="flex w-full items-center gap-2.5 rounded-lg p-2 text-xs font-bold hover:bg-[var(--muted)] transition-colors"
          >
            <Sparkles className="size-4 text-[var(--primary)]" />
            Ask AI
          </button>
          
          <button
            onClick={toggleBookmark}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg p-2 text-xs font-bold transition-colors",
              isBookmarked ? "text-amber-600 bg-amber-50 dark:bg-amber-950/20" : "hover:bg-[var(--muted)]"
            )}
          >
            <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
            {isBookmarked ? "Bookmarked" : "Bookmark Lesson"}
          </button>
        </section>

      </div>
    </aside>
  );
}
