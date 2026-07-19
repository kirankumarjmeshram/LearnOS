import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2, ChevronRight, Circle } from "lucide-react";

function Skeleton({ className, delay = "0ms" }) {
  return (
    <div 
      className={cn("relative overflow-hidden bg-[var(--muted)]/60 rounded-lg animate-in fade-in fill-mode-both duration-500", className)}
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
    </div>
  );
}

export default function RoadmapLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-8">
      {/* Roadmap Header Card Skeleton */}
      <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
        <Skeleton className="h-3 w-32 mb-2 rounded-md" delay="0ms" />
        <Skeleton className="mt-2 h-9 w-3/4 rounded-lg sm:h-10 sm:w-2/3" delay="50ms" />
        
        <div className="mt-4 space-y-2 max-w-3xl">
          <Skeleton className="h-4 w-full rounded-md" delay="100ms" />
          <Skeleton className="h-4 w-5/6 rounded-md" delay="100ms" />
        </div>

        <div className="mt-6 flex flex-wrap gap-6 text-xs">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 rounded-md" delay="150ms" />
            <Skeleton className="h-4 w-20 rounded-md" delay="150ms" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 rounded-md" delay="150ms" />
            <Skeleton className="h-4 w-20 rounded-md" delay="150ms" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 rounded-md" delay="150ms" />
            <Skeleton className="h-4 w-12 rounded-md" delay="150ms" />
          </div>
        </div>
        
        <Skeleton className="mt-4 h-2 w-full rounded-full" delay="200ms" />
        <Skeleton className="mt-2 h-3 w-40 rounded-md" delay="200ms" />
      </div>

      {/* Modules/Phases List Skeleton */}
      <div className="space-y-4">
        {/* Phase 1: Expanded state */}
        <div className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
          {/* Summary Area */}
          <div className="flex items-center justify-between gap-4 p-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" delay="150ms" />
                <Skeleton className="h-5 w-16 rounded-full" delay="150ms" />
                <Skeleton className="h-4 w-16 rounded-md" delay="150ms" />
              </div>
              
              <Skeleton className="mt-3 h-6 w-1/2 rounded-lg sm:h-7 sm:w-1/3" delay="200ms" />
              <div className="mt-3 space-y-1.5">
                <Skeleton className="h-3 w-full rounded-md" delay="250ms" />
                <Skeleton className="h-3 w-2/3 rounded-md" delay="250ms" />
              </div>

              {/* Metadata Indicators */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-6 text-xs">
                <Skeleton className="h-4 w-20 rounded-md" delay="300ms" />
                <Skeleton className="h-4 w-16 rounded-md" delay="300ms" />
                <Skeleton className="h-4 w-24 rounded-md" delay="300ms" />
                <Skeleton className="h-4 w-20 rounded-md" delay="300ms" />
                
                <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto pt-2 sm:pt-0">
                  <Skeleton className="h-4 w-24 rounded-md" delay="300ms" />
                  <Skeleton className="h-1.5 w-20 rounded-full" delay="300ms" />
                </div>
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)] rotate-90 opacity-20" />
          </div>

          {/* Expanded Content Area */}
          <div className="border-t p-6 space-y-6 bg-[var(--secondary)]/5">
            <div className="space-y-3">
              <Skeleton className="h-3 w-16 rounded-md" delay="350ms" />
              
              <div className="grid gap-3">
                {/* Lesson rows */}
                {[
                  { w: "w-3/4", subW: "w-1/2", isDone: true },
                  { w: "w-2/3", subW: "w-1/3", isDone: true },
                  { w: "w-1/2", subW: "w-1/4", isDone: false },
                  { w: "w-4/5", subW: "w-1/2", isDone: false },
                ].map((lesson, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 rounded-xl border bg-[var(--card)] p-4 shadow-sm opacity-80">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="size-8 shrink-0 rounded-full" delay={`${400 + idx * 50}ms`} />
                      <div className="w-full space-y-2">
                        <Skeleton className={`h-4 ${lesson.w} rounded-md`} delay={`${400 + idx * 50}ms`} />
                        <Skeleton className={`h-3 ${lesson.subW} rounded-md`} delay={`${400 + idx * 50}ms`} />
                      </div>
                    </div>
                    <BookOpen className="size-4 shrink-0 text-[var(--primary)] opacity-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Capstone Section */}
            <div className="mt-8 rounded-xl border border-dashed bg-[var(--secondary)]/20 p-5 space-y-4">
              <Skeleton className="h-5 w-48 rounded-md" delay="600ms" />
              <Skeleton className="h-3 w-3/4 rounded-md" delay="600ms" />
              
              <div className="grid gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((_, idx) => (
                  <div key={idx} className="rounded-lg border bg-[var(--card)] p-3 flex items-center justify-between opacity-60">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 rounded-md" delay={`${650 + idx * 50}ms`} />
                      <Skeleton className="h-3 w-16 rounded-md" delay={`${650 + idx * 50}ms`} />
                    </div>
                    <Skeleton className="size-5 rounded-md" delay={`${650 + idx * 50}ms`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2: Collapsed state */}
        <div className="overflow-hidden rounded-2xl border bg-[var(--card)] animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between gap-4 p-6 opacity-60">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" delay="250ms" />
                <Skeleton className="h-5 w-16 rounded-full" delay="250ms" />
                <Skeleton className="h-4 w-16 rounded-md" delay="250ms" />
              </div>
              <Skeleton className="mt-3 h-6 w-1/3 rounded-lg sm:h-7 sm:w-1/4" delay="300ms" />
              <div className="mt-3 space-y-1.5">
                <Skeleton className="h-3 w-full rounded-md" delay="350ms" />
                <Skeleton className="h-3 w-1/2 rounded-md" delay="350ms" />
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)] opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
