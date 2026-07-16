import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function Loader({ className, fullScreen = false, label = "Loading..." }) {
  return <div className={cn("flex items-center justify-center gap-3 text-[var(--muted-foreground)]", fullScreen && "min-h-screen", className)} role="status"><LoaderCircle className="size-5 animate-spin" aria-hidden="true" /><span>{label}</span></div>;
}
