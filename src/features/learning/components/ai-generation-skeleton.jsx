"use client";
import { useState, useEffect } from "react";
import { Check, LoaderCircle, Sparkles } from "lucide-react";

export function AIGenerationSkeleton({ lessonTitle }) {
  const steps = [
    "Understanding topic",
    "Creating explanations",
    "Building examples",
    "Preparing quizzes"
  ];
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Cycle through steps every 2.5 seconds
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto items-center justify-center p-6 h-[80vh] w-full">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
        <div className="text-center space-y-4">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--muted-foreground)]">Preparing your lesson...</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Creating:</p>
            <p className="text-lg font-extrabold tracking-tight text-[var(--primary)]">{lessonTitle || "Personalized Lesson"}</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-8">
          {steps.map((step, index) => {
             const isCompleted = index < currentStepIndex;
             const isCurrent = index === currentStepIndex;
             const isPending = index > currentStepIndex;

             return (
               <div key={step} className={`flex items-center gap-3 text-sm font-semibold ${isPending ? 'opacity-40' : 'opacity-100'} transition-opacity duration-500`}>
                 {isCompleted ? (
                   <span className="grid size-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-600"><Check className="size-3.5" /></span>
                 ) : isCurrent ? (
                   <span className="grid size-6 place-items-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)]"><LoaderCircle className="size-3.5 animate-spin" /></span>
                 ) : (
                   <span className="grid size-6 place-items-center rounded-full border border-[var(--border)] bg-[var(--muted)]" />
                 )}
                 <span className={isCompleted ? "text-[var(--muted-foreground)] line-through" : isCurrent ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}>
                   {step}
                 </span>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
