import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BookOpen,
  Compass,
  FolderKanban,
  Flame,
  Layers3,
  Map,
  Plus,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/constants/routes";
import { getAllRoadmapsWithProgress } from "@/services/learning-service";

function ProgressBar({ value }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
      <div
        className="h-full bg-[var(--primary)] transition-all"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5">
      <Icon className="size-5 text-[var(--primary)]" />
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-sm font-medium">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();
  const name = user?.firstName || user?.username || user?.fullName || "Learner";

  let allRoadmaps = [];
  try {
    if (user?.id) allRoadmaps = await getAllRoadmapsWithProgress(user.id);
  } catch (error) {
    console.error("Unable to load dashboard:", error);
  }

  // Serialize MongoDB docs
  const roadmaps = JSON.parse(JSON.stringify(allRoadmaps));

  const activeRoadmaps = roadmaps.filter((r) => r.status === "active");
  const completedRoadmaps = roadmaps.filter((r) => r.status === "completed");

  // Find the "continue learning" roadmap — most recently studied active one
  const continueRoadmap =
    activeRoadmaps.find((r) => r.lastStudiedAt) || activeRoadmaps[0] || null;

  const continueProgress = continueRoadmap?.progress;
  const continueCurrentLessonId = continueProgress?.currentLessonId;

  // Aggregate stats
  const totalCompleted = roadmaps.reduce(
    (acc, r) => acc + (r.progress?.completedLessons ?? 0),
    0,
  );
  const totalLessons = roadmaps.reduce(
    (acc, r) => acc + (r.progress?.totalLessons ?? 0),
    0,
  );
  const bestStreak = Math.max(0, ...roadmaps.map((r) => r.progress?.streak ?? 0));

  const hasRoadmap = roadmaps.length > 0;

  return (
    <PageWrapper>
      {/* ── Greeting ── */}
      <section>
        <p className="text-sm font-semibold text-[var(--primary)]">Your Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, {name}!
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted-foreground)]">
          {hasRoadmap
            ? "Pick up where you left off or explore your learning roadmaps."
            : "Build your Learning OS to create a personalized roadmap from your goals."}
        </p>
      </section>

      {/* ── No roadmap CTA ── */}
      {!hasRoadmap && (
        <section className="mt-10 rounded-2xl border bg-[var(--card)] p-9 shadow-sm">
          <Sparkles className="size-6 text-[var(--primary)]" />
          <h2 className="mt-5 text-2xl font-semibold">Build your Learning OS</h2>
          <p className="mt-2 max-w-xl leading-7 text-[var(--muted-foreground)]">
            Tell LearnOS about your career goal, availability, and learning preferences to generate
            your first personalized roadmap.
          </p>
          <Link
            href={ROUTES.ONBOARDING}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)]"
          >
            <Plus className="size-4" />
            Build My Learning OS
          </Link>
        </section>
      )}

      {hasRoadmap && (
        <>
          {/* ── Stats ── */}
          <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={BookOpen}
              label="Lessons completed"
              value={totalCompleted}
              sub={`of ${totalLessons} total`}
            />
            <StatCard
              icon={Layers3}
              label="Active roadmaps"
              value={activeRoadmaps.length}
            />
            <StatCard
              icon={Trophy}
              label="Completed roadmaps"
              value={completedRoadmaps.length}
            />
            <StatCard
              icon={Flame}
              label="Best streak"
              value={`${bestStreak} days`}
            />
          </section>

          {/* ── Continue Learning ── */}
          {continueRoadmap && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <div className="mt-4 rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {continueRoadmap.goal}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {continueRoadmap.difficulty} · {continueRoadmap.duration}
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--muted-foreground)]">
                          {continueProgress?.completedLessons ?? 0} /{" "}
                          {continueProgress?.totalLessons ?? 0} lessons
                        </span>
                        <span className="font-semibold">
                          {continueProgress?.progressPercentage ?? 0}%
                        </span>
                      </div>
                      <ProgressBar value={continueProgress?.progressPercentage ?? 0} />
                    </div>
                    {continueRoadmap.lastStudiedAt && (
                      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                        Last studied:{" "}
                        {format(new Date(continueRoadmap.lastStudiedAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {continueCurrentLessonId && (
                      <Link
                        href={`/lesson/${continueCurrentLessonId}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
                      >
                        <Compass className="size-4" />
                        Continue lesson
                        <ArrowRight className="size-4" />
                      </Link>
                    )}
                    <Link
                      href={`/roadmap?id=${continueRoadmap._id}`}
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-[var(--muted)]"
                    >
                      <Map className="size-4" />
                      View roadmap
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Active roadmaps ── */}
          {activeRoadmaps.length > 1 && (
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Active Roadmaps</h2>
                <Link
                  href={ROUTES.COURSES}
                  className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {activeRoadmaps.slice(0, 4).map((r) => (
                  <Link
                    key={r._id}
                    href={
                      r.progress?.currentLessonId
                        ? `/lesson/${r.progress.currentLessonId}`
                        : `/roadmap?id=${r._id}`
                    }
                    className="rounded-2xl border bg-[var(--card)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md"
                  >
                    <p className="truncate font-semibold">{r.goal}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {r.progress?.completedLessons ?? 0} / {r.progress?.totalLessons ?? 0} lessons
                    </p>
                    <ProgressBar value={r.progress?.progressPercentage ?? 0} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Completed ── */}
          {completedRoadmaps.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Completed</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedRoadmaps.map((r) => (
                  <Link
                    key={r._id}
                    href={`/roadmap?id=${r._id}`}
                    className="flex items-start gap-3 rounded-2xl border bg-[var(--card)] p-5 hover:border-[var(--primary)]"
                  >
                    <Target className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{r.goal}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        {r.progress?.totalLessons ?? 0} lessons · 100% complete
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Quick Actions ── */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "My Learning", description: "Browse all your roadmaps.", href: ROUTES.COURSES, icon: BookOpen },
            { title: "My Notes", description: "Review your lesson notes.", href: ROUTES.RESOURCES, icon: FolderKanban },
            { title: "New Roadmap", description: "Generate a new learning journey.", href: ROUTES.ONBOARDING, icon: Plus },
          ].map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="rounded-2xl border bg-[var(--card)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
            >
              <Icon className="size-5 text-[var(--primary)]" />
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
