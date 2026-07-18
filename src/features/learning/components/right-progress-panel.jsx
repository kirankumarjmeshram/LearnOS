"use client";

import { useRef, useState, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  useEffect(() => {
    if (!lessonId) return;
    const t = setTimeout(() => {
      try {
        const bookmarks = JSON.parse(localStorage.getItem("learnos:bookmarks") ?? "[]");
        setIsBookmarked(bookmarks.includes(lessonId));
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [lessonId]);

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
  const [isNotesOpen, setIsNotesOpen] = useState(false);
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
  const quickResources = [...globalResources, ...aiResources].slice(0, 3);

  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col gap-0 overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] xl:flex shadow-sm pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur">
        <h2 className="text-sm font-bold tracking-tight">Learning Hub</h2>
      </div>

      <div className="flex-1 space-y-4 p-4">
        
        {/* Module Progress Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Module Progress</h3>
            <span className="text-[10px] font-bold text-[var(--foreground)]">{completedLessons} / {totalLessons}</span>
          </div>
          
          <div className="space-y-1.5">
            <p className="text-xs font-semibold leading-tight line-clamp-2">
              {currentPhaseName}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
              <div
                className="h-full bg-[var(--primary)] transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5">
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase text-[var(--primary)] w-10 shrink-0">Now</span>
              <span className="text-xs font-semibold line-clamp-1">{lesson.title.split(":").pop()?.trim()}</span>
            </div>
            {nextLesson && (
              <div className="flex gap-2">
                <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] w-10 shrink-0">Next</span>
                <Link href={`/lesson/${nextLesson._id}`} className="text-xs font-semibold line-clamp-1 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  {nextLesson.title.split(":").pop()?.trim()}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (Always visible, primary tools) */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => toast.info("Ask AI is coming soon!")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] p-3 text-xs font-bold text-[var(--primary-foreground)] shadow-sm hover:opacity-90 transition-opacity"
          >
            <Sparkles className="size-4" />
            Ask AI
          </button>
          
          <button
            onClick={toggleBookmark}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold shadow-sm transition-colors",
              isBookmarked 
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-500" 
                : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)]"
            )}
          >
            <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
            {isBookmarked ? "Lesson Bookmarked" : "Bookmark Lesson"}
          </button>
        </div>

        {/* Expandable Notes Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-1.5">
              📝 My Notes
            </h3>
            <button 
              onClick={() => setIsNotesOpen(!isNotesOpen)} 
              className="text-[10px] font-bold text-[var(--primary)] hover:underline"
            >
              {isNotesOpen ? "Close Notes" : "Open Notes"}
            </button>
          </div>
          
          <AnimatePresence>
            {isNotesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-end">
                    <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[var(--muted-foreground)]">
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
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-[11px] leading-5 outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary)] resize-y min-h-[150px]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Resources Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">⭐ Quick Resources</h3>
          
          <div className="space-y-2">
            {quickResources.map(res => {
              const Icon = iconByType[res.type] || Link2;
              const url = res.filePath || res.url;
              const isFree = ["website", "youtube", "documentation", "blog"].includes(res.type);
              return (
                <a key={res._id} href={url} target="_blank" rel="noreferrer" className="group flex items-start gap-2.5 rounded-lg border border-transparent p-2 text-xs font-semibold hover:border-[var(--border)] hover:bg-[var(--background)] transition-colors">
                  <Icon className="mt-0.5 size-3.5 text-[var(--muted-foreground)] shrink-0" />
                  <div className="flex flex-col min-w-0 flex-1 gap-1">
                    <span className="line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">{res.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase text-[var(--muted-foreground)]">{res.type}</span>
                      {isFree && <span className="rounded bg-emerald-100 dark:bg-emerald-950/40 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Free</span>}
                    </div>
                  </div>
                </a>
              )
            })}
            {quickResources.length === 0 && (
              <p className="text-xs text-[var(--muted-foreground)] px-2 py-1">No resources yet.</p>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-[var(--border)] mt-3">
            <button
              onClick={onOpenResources}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-2 text-[10px] font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-center"
            >
              View All
            </button>
            <button
              onClick={() => {
                onOpenResources();
                setTimeout(() => {
                  const form = document.querySelector('form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-1 rounded-lg bg-[var(--primary)] px-2.5 py-2 text-[10px] font-bold text-[var(--primary-foreground)] shadow-sm hover:opacity-90 transition-opacity text-center"
            >
              Add Resource
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
