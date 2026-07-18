export default function ResourcesLoading() {
  return (
    <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-[var(--muted)]/50" />
      </div>

      <div className="flex flex-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {/* Sidebar Skeleton */}
        <div className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] p-4 md:flex">
          <div className="h-6 w-32 animate-pulse rounded-md bg-[var(--muted)] mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--muted)]/50" />
            ))}
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-[var(--border)] p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-[var(--muted)]/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
