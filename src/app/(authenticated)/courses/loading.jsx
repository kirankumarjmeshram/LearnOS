export default function CoursesLoading() {
  return (
    <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
        <div className="h-4 w-96 animate-pulse rounded-md bg-[var(--muted)]/50" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex h-64 flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div className="space-y-3 mt-4">
              <div className="h-5 w-4/5 animate-pulse rounded-md bg-[var(--muted)]" />
              <div className="h-4 w-full animate-pulse rounded-md bg-[var(--muted)]/50" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-[var(--muted)]/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
