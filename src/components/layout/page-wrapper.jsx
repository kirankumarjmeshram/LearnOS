import { cn } from "@/lib/utils";

export function PageWrapper({ children, className }) {
  return <main className={cn("min-w-0 flex-1 p-5 lg:p-8", className)}>{children}</main>;
}
