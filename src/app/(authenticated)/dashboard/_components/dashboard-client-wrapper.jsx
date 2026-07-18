"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { DashboardAIBuilder } from "./dashboard-ai-builder";
import DashboardContent from "./dashboard-content";

export function DashboardClientWrapper({ isGenerating, name, initialRoadmaps }) {
  const router = useRouter();
  
  const [roadmaps, setRoadmaps] = useState(() => {
    if (isGenerating) return null;
    
    // Cache-first: Check localStorage on mount
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("learnos_dashboard_roadmaps");
      if (cached) {
        try { 
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.warn("Failed to parse cached roadmaps");
        }
      }
    }
    // Fallback to server-provided roadmaps
    return initialRoadmaps;
  });

  const [generating, setGenerating] = useState(isGenerating);

  useEffect(() => {
    if (generating) return;

    // Background fetch to ensure fresh data and silently update UI & cache
    let isMounted = true;
    fetch("/api/dashboard/roadmaps")
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.roadmaps) {
          setRoadmaps(data.roadmaps);
          localStorage.setItem("learnos_dashboard_roadmaps", JSON.stringify(data.roadmaps));
        }
      })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [generating]);

  useEffect(() => {
    // If the server pushes fresh data directly via RSC (e.g. after a mutation), update state and cache
    if (!generating && initialRoadmaps && initialRoadmaps.length > 0) {
      const t = setTimeout(() => setRoadmaps(initialRoadmaps), 0);
      localStorage.setItem("learnos_dashboard_roadmaps", JSON.stringify(initialRoadmaps));
      return () => clearTimeout(t);
    }
  }, [initialRoadmaps, generating]);

  const handleGenerationComplete = () => {
    setGenerating(false);
    // Strip the query param to clean up the URL
    router.replace("/dashboard");
  };

  return (
    <AnimatePresence mode="wait">
      {generating ? (
        <motion.div
          key="builder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <DashboardAIBuilder onComplete={handleGenerationComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {roadmaps ? (
            <DashboardContent roadmaps={roadmaps} name={name} />
          ) : (
            // Layout preserving fallback skeleton
            <div className="animate-pulse space-y-6 opacity-50">
               <div className="h-32 bg-[var(--card)] rounded-2xl border border-[var(--border)]" />
               <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 h-96 bg-[var(--card)] rounded-2xl border border-[var(--border)]" />
                  <div className="col-span-1 h-96 bg-[var(--card)] rounded-2xl border border-[var(--border)]" />
               </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
