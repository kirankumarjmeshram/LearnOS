"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, BrainCircuit, CheckCircle2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const messages = ["Analyzing your goals...", "Understanding your experience...", "Selecting learning resources...", "Designing personalized roadmap...", "Preparing AI mentor..."];

export default function RoadmapLoadingPage() {
  const router = useRouter();
  const onboarding = useSelector((state) => state.onboarding.data);
  const [activeStep, setActiveStep] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const interval = window.setInterval(() => setActiveStep((current) => Math.min(current + 1, messages.length - 1)), 900);

    async function requestRoadmap() {
      try {
        const response = await fetch("/api/roadmap/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ onboarding }), signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "We could not generate your roadmap.");
        if (isMounted) router.replace("/dashboard");
      } catch (requestError) {
        if (requestError.name !== "AbortError" && isMounted) setError(requestError.message || "We could not generate your roadmap.");
      } finally {
        window.clearInterval(interval);
      }
    }

    requestRoadmap();
    return () => { isMounted = false; controller.abort(); window.clearInterval(interval); };
  }, [attempt, onboarding, router]);

  const retry = () => { setError(""); setActiveStep(0); setAttempt((current) => current + 1); };

  return <main className="grid min-w-0 flex-1 place-items-center p-5 lg:p-8"><section className="w-full max-w-xl rounded-3xl border bg-[var(--card)] p-7 shadow-sm sm:p-10"><motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [0.8, 1.05, 1], opacity: 1 }} className="grid size-14 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--primary)]"><BrainCircuit className="size-7" /></motion.span><h1 className="mt-7 text-3xl font-semibold tracking-tight">LearnOS Intelligence is creating your personalized roadmap...</h1>{error ? <div className="mt-7 rounded-2xl border border-red-300 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"><div className="flex gap-3"><AlertCircle className="mt-0.5 size-5 shrink-0" /><div><h2 className="font-semibold">Roadmap generation needs another try.</h2><p className="mt-1 text-sm leading-6">{error}</p></div></div><button type="button" onClick={retry} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"><RefreshCw className="size-4" />Retry</button></div> : <><p className="mt-3 leading-7 text-[var(--muted-foreground)]">We are building a structured plan from your learning profile.</p><div className="mt-8 space-y-3">{messages.map((message, index) => <motion.div key={message} initial={{ opacity: 0, x: -8 }} animate={{ opacity: index <= activeStep ? 1 : 0.35, x: 0 }} className="flex items-center gap-3 rounded-xl border p-3"><CheckCircle2 className="size-5 text-[var(--primary)]" /><span className="text-sm font-medium">{message}</span></motion.div>)}</div><div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--muted)]"><motion.div className="h-full bg-[var(--primary)]" initial={{ width: "0%" }} animate={{ width: `${((activeStep + 1) / messages.length) * 100}%` }} /></div></>}</section></main>;
}
