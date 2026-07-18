"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Bot, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const ROTATING_MESSAGES = [
  "Analyzing industry trends...",
  "Selecting the best learning sequence...",
  "Matching projects to your goals...",
  "Building practical exercises...",
  "Preparing interview questions...",
  "Optimizing module difficulty...",
  "Choosing official resources...",
  "Creating hands-on labs..."
];

export function DashboardAIBuilder({ onComplete }) {
  const router = useRouter();
  const onboarding = useSelector((state) => state.onboarding.data);
  const [activeStep, setActiveStep] = useState(0);
  const [rotatingMsgIndex, setRotatingMsgIndex] = useState(0);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const steps = [
    "Understanding your experience",
    "Selecting technologies",
    "Designing your roadmap",
    "Creating learning modules"
  ];

  // Dummy preview nodes based on user onboarding
  const previewNodes = useMemo(() => {
    if (!onboarding) return ["Foundation", "Language", "Framework", "Projects"];
    const base = ["Foundation"];
    if (onboarding.preferredTechnologyStack?.length > 0) {
      base.push(onboarding.preferredTechnologyStack[0]);
    } else {
      base.push(onboarding.goal || "Core Skills");
    }
    if (onboarding.preferredTechnologyStack?.length > 1) {
      base.push(onboarding.preferredTechnologyStack[1]);
    } else {
      base.push("Advanced Concepts");
    }
    base.push("Projects");
    return base;
  }, [onboarding]);

  useEffect(() => {
    // Message rotator
    const msgInterval = setInterval(() => {
      setRotatingMsgIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // Fake step progression
    const stepInterval = setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, 3000);

    if (!onboarding?.goal) {
      clearInterval(stepInterval);
      router.replace("/onboarding");
      return;
    }

    async function requestRoadmap() {
      try {
        const response = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ onboarding }),
          signal: controller.signal
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "We could not generate your roadmap.");
        
        if (isMounted) {
          setActiveStep(steps.length); // All done
          setTimeout(() => {
            onComplete();
            toast.info("Optimizing your learning experience...", {
              description: "Preparing your first lesson in the background.",
              duration: 10000,
            });
          }, 800); // Small delay for visual completion
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError" && isMounted) {
          setError(requestError.message || "We could not generate your roadmap.");
        }
      } finally {
        clearInterval(stepInterval);
      }
    }

    requestRoadmap();
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(stepInterval);
    };
  }, [attempt, onboarding, router, onComplete, steps.length]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto grid size-16 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]"
          >
            <Bot className="size-8" />
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight">Creating your personalized learning journey...</h2>
          <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-500 text-left">
            <div className="flex gap-3">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold">Generation failed</h3>
                <p className="mt-1 text-sm text-red-500/80">{error}</p>
              </div>
            </div>
            <button onClick={() => { setError(""); setAttempt(a => a + 1); setActiveStep(0); }} className="mt-4 flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600">
              <RefreshCw className="size-4" /> Retry
            </button>
          </div>
        ) : (
          <>
            {/* Step Checklist */}
            <div className="space-y-4 text-left mx-auto max-w-xs">
              {steps.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isPending = idx > activeStep;
                
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 font-medium"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 className="size-5 animate-spin text-[var(--primary)]" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-[var(--border)]" />
                    )}
                    <span className={isCompleted ? "text-[var(--muted-foreground)] line-through" : isCurrent ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}>
                      {step}
                    </span>
                  </motion.div>
                );
              })}
              <p className="pt-2 text-xs font-semibold text-[var(--muted-foreground)] text-center animate-pulse">
                Estimated time: 10–20 seconds
              </p>
            </div>

            {/* Rotating Messages */}
            <div className="h-6 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={rotatingMsgIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm italic text-[var(--primary)]"
                >
                  {ROTATING_MESSAGES[rotatingMsgIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Roadmap Preview (Animated Stepper) */}
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">Roadmap Preview</p>
              <div className="flex flex-col items-center gap-3">
                {previewNodes.map((node, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.4 + 1 }}
                      className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2 text-sm font-bold text-[var(--primary)]"
                    >
                      {node}
                    </motion.div>
                    {i < previewNodes.length - 1 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 24, opacity: 1 }}
                        transition={{ delay: i * 0.4 + 1.2, duration: 0.3 }}
                        className="w-px bg-gradient-to-b from-[var(--primary)] to-transparent my-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
