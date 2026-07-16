import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return <Link href={ROUTES.HOME} className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}><span className="grid size-9 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]"><Sparkles className="size-4" aria-hidden="true" /></span><span>LearnOS</span></Link>;
}
