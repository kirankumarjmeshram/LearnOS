import { cn } from "@/lib/utils";

export function Container({ children, className }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 lg:px-8", className)}>{children}</div>;
}
