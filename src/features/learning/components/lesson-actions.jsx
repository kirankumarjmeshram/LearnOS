"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LessonActions({
  lessonId,
  previousLessonId,
  nextLessonId,
  isCompleted,
  isLastInPhase,
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markComplete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "We could not update this lesson.");
      toast.success("Lesson marked complete. Great work! 🎉");
      router.refresh();
      
      // Auto-navigate to next lesson if available
      if (nextLessonId) {
        router.push(`/lesson/${nextLessonId}`);
      }
    } catch (error) {
      toast.error(error.message || "We could not update this lesson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
      <div>
        {previousLessonId ? (
          <Link
            href={`/lesson/${previousLessonId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-semibold hover:bg-[var(--muted)] transition-colors"
          >
            <ChevronLeft className="size-4" />
            Previous Lesson
          </Link>
        ) : (
          <div /> /* spacer */
        )}
      </div>

      <div className="flex gap-4">
        {nextLessonId ? (
          <button
            type="button"
            onClick={markComplete}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle2 className="size-4" />
            ) : null}
            {isCompleted 
              ? (isLastInPhase ? "Next Module" : "Next Lesson") 
              : (isLastInPhase ? "Finish Module 🎉" : "Next Lesson")}
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={markComplete}
            disabled={isCompleted || isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {isCompleted ? "Course Completed 🎉" : "Finish Course 🎉"}
          </button>
        )}
      </div>
    </div>
  );
}
