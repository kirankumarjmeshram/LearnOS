import { cn } from "@/lib/utils";

/**
 * Standard scrollable page container used by dashboard, roadmap, courses, etc.
 * overflow-y-auto ensures this section scrolls independently within the fixed
 * DashboardLayout parent without affecting the navbar or workspace sidebar.
 */
export function PageWrapper({ children, className }) {
  return (
    <main className={cn("min-w-0 flex-1 overflow-y-auto p-5 lg:p-8", className)}>
      {children}
    </main>
  );
}
