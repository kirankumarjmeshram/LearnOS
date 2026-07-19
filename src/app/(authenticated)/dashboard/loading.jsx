import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/layout/page-wrapper";

function Skeleton({ className }) {
  return (
    <div className={cn("relative overflow-hidden bg-[var(--muted)]/60 rounded-lg", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <PageWrapper className="space-y-10">
      {/* Greeting Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-9 w-64 rounded-lg sm:h-10 sm:w-80" />
          <Skeleton className="h-4 w-72 rounded-md sm:w-96" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </section>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (span 2) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Continue Learning */}
          <div className="space-y-5 rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-40 rounded-xl" />
              <Skeleton className="h-9 w-36 rounded-xl" />
            </div>
          </div>

          {/* Active Roadmaps */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4 rounded-xl border bg-[var(--card)] p-4">
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16 rounded-md" />
                      <Skeleton className="h-3 w-8 rounded-md" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-36 rounded-md" />
            <div className="divide-y rounded-2xl border bg-[var(--card)] p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 pt-3 flex-1 first:pt-0 last:pb-0">
                  <div className="flex w-full items-center gap-3">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-48 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="size-4 shrink-0 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="space-y-4 rounded-2xl border bg-[var(--card)] p-5 shadow-sm">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3 rounded-xl border p-3.5">
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
              <div className="space-y-3 rounded-xl border p-3.5">
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          </div>

          {/* Weekly Study Goal */}
          <div className="space-y-4 rounded-2xl border bg-[var(--card)] p-5 shadow-sm">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>

          {/* Unlocked Achievements */}
          <div className="space-y-4 rounded-2xl border bg-[var(--card)] p-5 shadow-sm">
            <Skeleton className="h-5 w-48 rounded-md" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
