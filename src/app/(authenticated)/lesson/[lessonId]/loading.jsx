"use client";

export default function LessonLoading() {
  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden bg-[var(--background)]">
      {/* Sidebar Skeleton */}
      <aside className="hidden h-full w-[300px] shrink-0 border-r border-[var(--border)] lg:flex flex-col p-4 space-y-6 bg-[var(--background)]">
         <div className="space-y-2">
           <div className="h-3 w-16 animate-pulse rounded bg-[var(--muted)]" />
           <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
         </div>
         <div className="space-y-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-[var(--muted)]/50" />
           ))}
         </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 flex-col overflow-y-auto p-6 lg:p-12">
        <div className="mx-auto w-full max-w-3xl space-y-8">
           <div className="h-8 w-3/4 animate-pulse rounded-lg bg-[var(--muted)]" />
           <div className="h-4 w-full animate-pulse rounded bg-[var(--muted)]/50" />
           <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--muted)]/50" />
           
           <div className="h-32 w-full animate-pulse rounded-2xl bg-[var(--card)] border border-[var(--border)] mt-8" />
           <div className="h-48 w-full animate-pulse rounded-2xl bg-[var(--card)] border border-[var(--border)]" />
        </div>
      </div>
      
      {/* Right Sidebar Skeleton */}
      <aside className="hidden h-full w-[300px] shrink-0 border-l border-[var(--border)] xl:flex flex-col p-4 space-y-4 bg-[var(--background)]">
        <div className="h-32 w-full animate-pulse rounded-2xl bg-[var(--card)] border border-[var(--border)]" />
        <div className="h-12 w-full animate-pulse rounded-2xl bg-[var(--card)] border border-[var(--border)]" />
        <div className="h-48 w-full animate-pulse rounded-2xl bg-[var(--card)] border border-[var(--border)]" />
      </aside>
    </div>
  );
}
