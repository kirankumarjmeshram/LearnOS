"use client";

import {
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Premium shimmer helper
function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--muted)]/50 rounded-lg",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
    </div>
  );
}

export default function LessonLoading() {
  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden bg-[var(--background)]">
      {/* ── Left: Course Sidebar Skeleton ── */}
      <aside className="hidden h-full w-[300px] shrink-0 border-r border-[var(--border)] lg:flex flex-col bg-[var(--background)]">
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Roadmap</p>
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
          <div className="relative mt-2">
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4 mt-2">
          {[1, 2, 3].map((module) => (
            <div key={module} className="px-2">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-48 mb-3" />
              <Skeleton className="h-1 w-full rounded-full mb-3" />
              <div className="space-y-1 mt-2">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} className="h-8 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Center: Lesson Content Skeleton ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Top Action Bar */}
        <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur-md lg:px-6">
          <div className="inline-flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-[var(--muted-foreground)] opacity-50">
            <PanelLeftClose className="size-4" />
            <span className="hidden sm:inline">Hide Navigation</span>
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="inline-flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-[var(--muted-foreground)] opacity-50">
            <span className="hidden sm:inline">Learning Hub</span>
            <PanelRightClose className="size-4" />
          </div>
        </div>

        <div className="mx-auto w-full px-6 pb-32 pt-12 max-w-[900px] lg:px-12">
          {/* HEADER */}
          <div className="space-y-6 mb-12">
            <nav className="flex items-center gap-1.5 text-xs">
              <Skeleton className="h-3 w-16" />
              <ChevronRight className="size-3.5 shrink-0 text-[var(--muted-foreground)] opacity-50" />
              <Skeleton className="h-3 w-20" />
              <ChevronRight className="size-3.5 shrink-0 text-[var(--muted-foreground)] opacity-50" />
              <Skeleton className="h-3 w-32" />
            </nav>

            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-5/6 rounded-md" />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <hr className="my-12 border-[var(--border)]" />

          {/* OVERVIEW SECTION */}
          <section className="mb-12 space-y-6">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                 <div className="mb-4 flex items-center gap-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <Skeleton className="h-4 w-24" />
                 </div>
                 <div className="space-y-3 mt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                 </div>
              </div>
              <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                 <div className="mb-4 flex items-center gap-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <Skeleton className="h-4 w-24" />
                 </div>
                 <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-6 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                 </div>
              </div>
            </div>
            <hr className="my-12 border-[var(--border)]" />
          </section>

          {/* CONTENT SECTION (Paragraphs, Code, Diagram) */}
          <section className="space-y-8">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="space-y-3">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-11/12" />
               <Skeleton className="h-4 w-5/6" />
            </div>
            {/* Diagram Placeholder */}
            <Skeleton className="h-64 w-full rounded-2xl" />
            {/* Code Block Placeholder */}
            <Skeleton className="h-48 w-full rounded-xl" />
          </section>
        </div>
      </div>

      {/* ── Right: Learning Hub Skeleton ── */}
      <aside className="hidden h-full w-[300px] shrink-0 border-l border-[var(--border)] xl:flex flex-col bg-[var(--background)]">
        {/* Hub Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--border)] p-4">
           <Skeleton className="size-8 rounded-xl" />
           <Skeleton className="h-5 w-32" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {/* Section 1 */}
           <div className="space-y-3">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
           </div>

           {/* Section 2 */}
           <div className="space-y-3 pt-6 border-t border-[var(--border)]">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-32 w-full rounded-xl" />
           </div>
        </div>
      </aside>
    </div>
  );
}
