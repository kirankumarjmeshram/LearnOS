import { cn } from "@/lib/utils";

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
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
        <Skeleton className="h-9 w-48 rounded-lg sm:h-10 sm:w-64" delay="0ms" />
        <Skeleton className="h-4 w-3/4 rounded-md sm:w-1/2" delay="50ms" />
      </div>

      {/* Split Layout Skeleton */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
        
        {/* Left Sidebar Skeleton */}
        <div className="md:w-64 shrink-0 space-y-2">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" delay={`${150 + i * 50}ms`} />
          ))}
        </div>

        {/* Right Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-7 w-40 rounded-lg" delay="300ms" />
            <Skeleton className="h-4 w-full rounded-md" delay="350ms" />
          </div>

          <div className="space-y-4 rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b last:border-0 border-[var(--border)]">
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
  );
}
