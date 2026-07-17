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
  isFirstStep,
  isLastStep,
  onPrevStep,
  onNextStep,
  nextStepLabel,
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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        {!isFirstStep ? (
          <button
            type="button"
            onClick={onPrevStep}
            className="inline-flex items-center gap-2 rounded-xl border bg-[var(--card)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--muted)]"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
        ) : previousLessonId ? (
          <Link
            href={`/lesson/${previousLessonId}`}
            className="inline-flex items-center gap-2 rounded-xl border bg-[var(--card)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--muted)]"
          >
            <ChevronLeft className="size-4" />
            Prev Lesson
          </Link>
        ) : (
          <div /> /* spacer */
        )}
      </div>

      <div className="flex gap-3">
        {isLastStep ? (
          <button
            type="button"
            onClick={markComplete}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {isCompleted ? (nextLessonId ? "Next Lesson" : "Completed ✓") : "Mark Complete"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
          >
            Next: {nextStepLabel}
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
