export default function DashboardLoading() {
  return (
    <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-[var(--muted)]/50" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Roadmap Cards */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-[var(--muted)]" />
            <div className="space-y-2">
              <div className="h-6 w-3/4 animate-pulse rounded-lg bg-[var(--muted)]" />
              <div className="h-4 w-full animate-pulse rounded-md bg-[var(--muted)]/50" />
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-[var(--muted)]/50" />
            </div>
            <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
