"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function GlobalError({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center px-6 text-center"><div className="max-w-md space-y-4"><p className="text-sm font-medium text-[var(--primary)]">LearnOS</p><h1 className="text-2xl font-bold">Something needs another try.</h1><p className="text-[var(--muted-foreground)]">We could not load this part of your experience. Please try again.</p><Button onClick={reset}>Try again</Button></div></main>;
}
