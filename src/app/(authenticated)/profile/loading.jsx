import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/layout/page-wrapper";

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

export default function ProfileLoading() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1100px] space-y-10">
        {/* Horizontal Hero Skeleton */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
          <Skeleton className="size-20 md:size-24 rounded-full shrink-0" delay="0ms" />
          <div className="space-y-3 flex-1 text-center md:text-left">
            <Skeleton className="h-8 w-48 md:w-64 rounded-lg mx-auto md:mx-0" delay="50ms" />
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-full" delay={`${100 + i * 50}ms`} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Skeleton className="h-9 w-28 rounded-xl" delay="250ms" />
            <Skeleton className="h-9 w-32 rounded-xl" delay="300ms" />
          </div>
        </div>

        <Skeleton className="h-14 w-full rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" delay="350ms" />

        <div className="grid gap-10 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
          {/* Learning Overview Skeleton */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "400ms" }}>
            <Skeleton className="h-7 w-48 rounded-lg mb-2" delay="400ms" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="rounded-2xl border bg-[var(--card)] p-4 space-y-3">
                  <div className="size-8 rounded-lg bg-[var(--muted)]" />
                  <Skeleton className="h-4 w-16 rounded-md" delay={`${450 + i * 50}ms`} />
                  <Skeleton className="h-6 w-12 rounded-lg" delay={`${500 + i * 50}ms`} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "450ms" }}>
            <Skeleton className="h-7 w-32 rounded-lg mb-2" delay="500ms" />
            <div className="space-y-2">
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" delay={`${550 + i * 50}ms`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
