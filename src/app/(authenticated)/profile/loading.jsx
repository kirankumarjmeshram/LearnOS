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

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-12">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
        <Skeleton className="size-24 rounded-full" delay="0ms" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-8 w-48 rounded-lg" delay="50ms" />
          <Skeleton className="h-4 w-32 rounded-md" delay="100ms" />
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" delay={`${150 + i * 50}ms`} />
          ))}
        </div>
        <Skeleton className="h-10 w-32 rounded-xl mt-4" delay="300ms" />
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
        {/* Learning Overview Skeleton */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "200ms" }}>
          <div>
            <Skeleton className="h-7 w-48 rounded-lg mb-2" delay="300ms" />
            <Skeleton className="h-4 w-3/4 rounded-md" delay="350ms" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="rounded-2xl border bg-[var(--card)] p-5 space-y-3">
                <Skeleton className="h-4 w-1/2 rounded-md" delay={`${400 + i * 50}ms`} />
                <Skeleton className="h-8 w-1/3 rounded-lg" delay={`${450 + i * 50}ms`} />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Identity Skeleton */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "300ms" }}>
          <div>
            <Skeleton className="h-7 w-48 rounded-lg mb-2" delay="400ms" />
            <Skeleton className="h-4 w-3/4 rounded-md" delay="450ms" />
          </div>
          <div className="rounded-2xl border bg-[var(--card)] p-6 space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32 rounded-md" delay={`${500 + i * 50}ms`} />
                <Skeleton className="h-6 w-24 rounded-full" delay={`${550 + i * 50}ms`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
