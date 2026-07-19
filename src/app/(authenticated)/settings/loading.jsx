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

export default function SettingsLoading() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1100px] animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="space-y-2 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
          <Skeleton className="h-9 w-48 rounded-lg" delay="0ms" />
          <Skeleton className="h-4 w-3/4 rounded-md sm:w-1/3" delay="50ms" />
        </div>

        {/* Split Layout Skeleton */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
          
          {/* Left Sidebar Skeleton */}
          <div className="md:w-[280px] shrink-0 space-y-1">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" delay={`${150 + i * 50}ms`} />
            ))}
          </div>

          {/* Right Content Skeleton */}
          <div className="flex-1 max-w-[760px] space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 rounded-lg" delay="300ms" />
              <Skeleton className="h-4 w-64 rounded-md" delay="350ms" />
            </div>

            <div className="space-y-0 rounded-2xl border bg-[var(--card)] shadow-sm">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-5 border-b last:border-0 border-[var(--border)]">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-32 rounded-md" delay={`${400 + i * 50}ms`} />
                    <Skeleton className="h-3 w-48 rounded-md" delay={`${450 + i * 50}ms`} />
                  </div>
                  <Skeleton className="h-9 w-20 rounded-lg shrink-0" delay={`${400 + i * 50}ms`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
