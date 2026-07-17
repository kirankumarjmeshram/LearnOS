import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { BookOpen, Plus, Sparkles } from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/constants/routes";
import { RoadmapCard } from "@/features/learning/components/roadmap-card";
import { getAllRoadmapsWithProgress } from "@/services/learning-service";

export const metadata = { title: "My Learning" };

export default async function CoursesPage() {
  const user = await currentUser();
  let data = [];

  try {
    if (user?.id) data = await getAllRoadmapsWithProgress(user.id);
  } catch (error) {
    console.error("Unable to load roadmaps:", error);
  }

  // Serialize MongoDB documents for client components
  const roadmaps = JSON.parse(JSON.stringify(data));

  const active = roadmaps.filter((r) => r.status === "active");
  const completed = roadmaps.filter((r) => r.status === "completed");
  const archived = roadmaps.filter((r) => r.status === "archived");

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Your progress</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">My Learning</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted-foreground)]">
            All your personalised roadmaps in one place. Resume, archive, or create a new one.
          </p>
        </div>
        <Link
          href={ROUTES.ONBOARDING}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] hover:opacity-90"
        >
          <Plus className="size-4" />
          New Roadmap
        </Link>
      </section>

      {/* ── Stats row ── */}
      {roadmaps.length > 0 && (
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total roadmaps", value: roadmaps.length },
            { label: "Active roadmaps", value: active.length },
            { label: "Completed", value: completed.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border bg-[var(--card)] p-5">
              <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
              <p className="mt-1 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>
      )}

      {/* ── Empty state ── */}
      {roadmaps.length === 0 && (
        <section className="mt-10 rounded-2xl border bg-[var(--card)] p-9 shadow-sm">
          <Sparkles className="size-6 text-[var(--primary)]" />
          <h2 className="mt-5 text-2xl font-semibold">Start your first roadmap</h2>
          <p className="mt-2 max-w-xl leading-7 text-[var(--muted-foreground)]">
            Tell LearnOS about your goal, time, and experience level to generate a personalised
            learning roadmap powered by Gemini AI.
          </p>
          <Link
            href={ROUTES.ONBOARDING}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)]"
          >
            <Plus className="size-4" />
            Create My First Roadmap
          </Link>
        </section>
      )}

      {/* ── Active roadmaps ── */}
      {active.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <BookOpen className="size-5 text-[var(--primary)]" />
            In Progress
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {active.map((r) => (
              <RoadmapCard key={r._id} roadmap={r} />
            ))}
          </div>
        </section>
      )}

      {/* ── Completed roadmaps ── */}
      {completed.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            ✅ Completed
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {completed.map((r) => (
              <RoadmapCard key={r._id} roadmap={r} />
            ))}
          </div>
        </section>
      )}

      {/* ── Archived ── */}
      {archived.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[var(--muted-foreground)]">Archived</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {archived.map((r) => (
              <RoadmapCard key={r._id} roadmap={r} />
            ))}
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
