"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const messages = ["Analyzing your goals...", "Understanding your experience...", "Selecting learning resources...", "Designing personalized roadmap...", "Preparing AI mentor..."];

export default function RoadmapLoadingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setActiveStep((current) => Math.min(current + 1, messages.length - 1)), 700);
    const redirect = window.setTimeout(() => router.replace("/dashboard"), 4000);
    return () => { window.clearInterval(interval); window.clearTimeout(redirect); };
  }, [router]);

  return <main className="grid min-w-0 flex-1 place-items-center p-5 lg:p-8"><section className="w-full max-w-xl rounded-3xl border bg-[var(--card)] p-7 shadow-sm sm:p-10"><motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [0.8, 1.05, 1], opacity: 1 }} className="grid size-14 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--primary)]"><BrainCircuit className="size-7" /></motion.span><h1 className="mt-7 text-3xl font-semibold tracking-tight">LearnOS Intelligence is creating your personalized roadmap...</h1><p className="mt-3 leading-7 text-[var(--muted-foreground)]">This is a guided preview. No AI request is being made yet.</p><div className="mt-8 space-y-3">{messages.map((message, index) => <motion.div key={message} initial={{ opacity: 0, x: -8 }} animate={{ opacity: index <= activeStep ? 1 : 0.35, x: 0 }} className="flex items-center gap-3 rounded-xl border p-3"><CheckCircle2 className="size-5 text-[var(--primary)]" /><span className="text-sm font-medium">{message}</span></motion.div>)}</div><div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--muted)]"><motion.div className="h-full bg-[var(--primary)]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 4, ease: "linear" }} /></div></section></main>;
}
