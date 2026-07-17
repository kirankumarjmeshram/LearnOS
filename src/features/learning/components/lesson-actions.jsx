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
    } catch (error) {
      toast.error(error.message || "We could not update this lesson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
      <div>
        {previousLessonId ? (
          <Link
            href={`/lesson/${previousLessonId}`}
            className="inline-flex items-center gap-2 rounded-xl border bg-[var(--card)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--muted)]"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        ) : (
          <div /> /* spacer */
        )}
      </div>

      <button
        type="button"
        onClick={markComplete}
        disabled={isCompleted || isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <CheckCircle2 className="size-4" />
        )}
        {isCompleted ? "Completed ✓" : "Mark Complete"}
      </button>

      <div>
        {nextLessonId ? (
          <Link
            href={`/lesson/${nextLessonId}`}
            className="inline-flex items-center gap-2 rounded-xl border bg-[var(--card)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--muted)]"
          >
            Next
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <div /> /* spacer */
        )}
      </div>
    </div>
  );
}
