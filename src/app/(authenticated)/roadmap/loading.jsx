export default function RoadmapLoading() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-12">
      <div className="mb-12 space-y-4 text-center">
        <div className="mx-auto h-10 w-3/4 animate-pulse rounded-xl bg-[var(--muted)]" />
        <div className="mx-auto h-5 w-1/2 animate-pulse rounded-lg bg-[var(--muted)]/50" />
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--primary)] before:via-[var(--primary)]/50 before:to-transparent">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--background)] bg-[var(--muted)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow animate-pulse" />
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="space-y-3">
                <div className="h-6 w-2/3 animate-pulse rounded-lg bg-[var(--muted)]" />
                <div className="h-4 w-full animate-pulse rounded-md bg-[var(--muted)]/50" />
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-[var(--muted)]/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
