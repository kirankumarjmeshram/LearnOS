import { Sparkles } from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";

export function PlaceholderPage({ title, description }) {
  return <PageWrapper><section className="max-w-2xl"><p className="text-sm font-semibold text-[var(--primary)]">LearnOS workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><div className="mt-8 rounded-2xl border bg-[var(--card)] p-8"><Sparkles className="size-6 text-[var(--primary)]" aria-hidden="true" /><h2 className="mt-5 text-xl font-semibold">Coming Soon</h2><p className="mt-2 leading-7 text-[var(--muted-foreground)]">{description}</p></div></section></PageWrapper>;
}
