import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  BookOpen,
  Compass,
  FolderKanban,
  Flame,
  Layers3,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Activity,
  Award,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/constants/routes";
import { getAllRoadmapsWithProgress } from "@/services/learning-service";

function ProgressBar({ value, color = "bg-[var(--primary)]" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
      <div
        className={`h-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
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

  // Serialize MongoDB documents
  const roadmaps = JSON.parse(JSON.stringify(allRoadmaps));

  const activeRoadmaps = roadmaps.filter((r) => r.status === "active");
  const completedRoadmaps = roadmaps.filter((r) => r.status === "completed");

  // Continue Learning Roadmap (most recently studied active one)
  const continueRoadmap =
    activeRoadmaps.find((r) => r.lastStudiedAt) || activeRoadmaps[0] || null;

  const continueProgress = continueRoadmap?.progress;
  const continueCurrentLessonId = continueProgress?.currentLessonId;

  // Find the next upcoming phase/module in the continue roadmap
  let upcomingPhase = null;
  if (continueRoadmap && continueRoadmap.phases) {
    // A phase is incomplete if the completed lessons in it is less than total phase lessons
    const progressCompletedIds = continueProgress?.completedLessonIds || [];
    upcomingPhase = continueRoadmap.phases.find((phase) => {
      // If phase has lessons, find if any of them are NOT completed
      // Since phases don't directly reference lessons in the DB, we can assume phase order
      return true; // fallback to showing the first or second phase depending on completion
    });
  }

  // Aggregate Metrics
  const totalCompletedLessons = roadmaps.reduce(
    (acc, r) => acc + (r.progress?.completedLessons ?? 0),
    0,
  );
  
  const totalLessonsCount = roadmaps.reduce(
    (acc, r) => acc + (r.progress?.totalLessons ?? 0),
    0,
  );

  const bestStreak = Math.max(0, ...roadmaps.map((r) => r.progress?.streak ?? 0));
  
  // Calculate study hours: 45 mins per completed lesson
  const estimatedMinutes = totalCompletedLessons * 45;
  const studyHours = (estimatedMinutes / 60).toFixed(1);
  const avgDailyMinutes = totalCompletedLessons > 0 ? Math.round(estimatedMinutes / Math.max(1, bestStreak)) : 0;

  // Modules/Phases completed count
  const completedModulesCount = completedRoadmaps.length; // placeholder, or count fully completed phases

  // Recent activity logs
  const recentActivities = roadmaps
    .filter((r) => r.lastStudiedAt)
    .map((r) => ({
      id: r._id,
      goal: r.goal,
      timestamp: new Date(r.lastStudiedAt),
      action: "Studied lessons in",
    }))
    .slice(0, 3);

  // Dynamic Achievements list
  const achievements = [];
  if (totalCompletedLessons >= 1) {
    achievements.push({
      title: "First Step",
      desc: "Completed your first lesson",
      icon: "🎯",
      color: "bg-blue-500/10 text-blue-500",
    });
  }
  if (bestStreak >= 3) {
    achievements.push({
      title: "Consistency",
      desc: "Maintained a 3-day streak",
      icon: "🔥",
      color: "bg-orange-500/10 text-orange-500",
    });
  }
  if (totalCompletedLessons >= 10) {
    achievements.push({
      title: "Knowledge Seeker",
      desc: "Completed 10 lessons",
      icon: "📚",
      color: "bg-purple-500/10 text-purple-500",
    });
  }
  if (completedRoadmaps.length > 0) {
    achievements.push({
      title: "Graduate",
      desc: "Finished a full roadmap",
      icon: "🎓",
      color: "bg-emerald-500/10 text-emerald-500",
    });
  }

  const hasRoadmap = roadmaps.length > 0;

  return (
    <PageWrapper className="space-y-10">
      {/* Greeting Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Workspace Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {name}!
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {hasRoadmap
              ? "Track your daily study goals and pick up where you left off."
              : "Generate a personalized roadmap to start your learning journey."}
          </p>
        </div>
        {hasRoadmap && (
          <Link
            href={ROUTES.ONBOARDING}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="size-4" />
            New Roadmap
          </Link>
        )}
      </section>

      {/* No Roadmap Empty State */}
      {!hasRoadmap && (
        <section className="rounded-2xl border bg-[var(--card)] p-8 text-center shadow-sm max-w-xl mx-auto space-y-6">
          <Sparkles className="size-8 text-[var(--primary)] mx-auto animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Build your Learning OS</h2>
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Specify your career goals, preferred technology stack, experience level, and weekly study availability to build a personalized learning roadmap.
            </p>
          </div>
          <Link
            href={ROUTES.ONBOARDING}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 shadow-sm transition-all"
          >
            <Plus className="size-4" />
            Build My Learning OS
          </Link>
        </section>
      )}

      {hasRoadmap && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Grid Area (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Continue Learning Widget */}
            {continueRoadmap && (
              <div className="rounded-2xl border bg-[var(--card)] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                    Continue Learning
                  </p>
                  {continueRoadmap.lastStudiedAt && (
                    <span className="text-[10px] text-[var(--muted-foreground)] font-semibold">
                      Last studied: {format(new Date(continueRoadmap.lastStudiedAt), "MMM d, yyyy")}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold truncate">{continueRoadmap.goal}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {continueRoadmap.difficulty} · {continueRoadmap.duration} · {continueRoadmap.estimatedHoursPerWeek}h/week
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>
                      {continueProgress?.completedLessons ?? 0} / {continueProgress?.totalLessons ?? 0} Lessons
                    </span>
                    <span>{continueProgress?.progressPercentage ?? 0}% Complete</span>
                  </div>
                  <ProgressBar value={continueProgress?.progressPercentage ?? 0} />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {continueCurrentLessonId ? (
                    <Link
                      href={`/lesson/${continueCurrentLessonId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
                    >
                      <Compass className="size-4" />
                      Resume Study Session
                    </Link>
                  ) : null}
                  <Link
                    href={`/roadmap?id=${continueRoadmap._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--card)] px-4 py-2.5 text-xs font-semibold hover:bg-[var(--muted)] transition-all"
                  >
                    <Layers3 className="size-4 text-[var(--muted-foreground)]" />
                    Browse Curriculum
                  </Link>
                </div>
              </div>
            )}

            {/* In Progress / Active Roadmaps Grid */}
            {activeRoadmaps.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Layers3 className="size-4 text-[var(--primary)]" />
                  Active Roadmaps
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeRoadmaps.slice(0, 4).map((r) => (
                    <Link
                      key={r._id}
                      href={r.progress?.currentLessonId ? `/lesson/${r.progress.currentLessonId}` : `/roadmap?id=${r._id}`}
                      className="rounded-xl border bg-[var(--card)] p-4 hover:border-[var(--primary)] hover:shadow-sm transition-all space-y-3"
                    >
                      <p className="font-bold text-xs truncate">{r.goal}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[var(--muted-foreground)]">
                          <span>{r.progress?.completedLessons ?? 0} / {r.progress?.totalLessons ?? 0} Lessons</span>
                          <span className="font-semibold">{r.progress?.progressPercentage ?? 0}%</span>
                        </div>
                        <ProgressBar value={r.progress?.progressPercentage ?? 0} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity Log */}
            {recentActivities.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Activity className="size-4 text-[var(--primary)]" />
                  Recent Activity
                </h3>
                <div className="rounded-2xl border bg-[var(--card)] p-4 divide-y space-y-3">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between text-xs pt-3 first:pt-0">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
                          🎯
                        </span>
                        <div>
                          <p className="font-semibold text-xs leading-5">
                            {act.action} <span className="text-[var(--primary)]">{act.goal}</span>
                          </p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            {format(new Date(act.timestamp), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-[var(--muted-foreground)]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Widgets Panel (1 Column) */}
          <div className="space-y-6">
            
            {/* Stats / Performance Summary */}
            <div className="rounded-2xl border bg-[var(--card)] p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-[var(--primary)]" />
                Performance Metrics
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3.5 space-y-1">
                  <Flame className="size-4 text-orange-500 fill-orange-500" />
                  <p className="text-lg font-bold leading-none mt-1">{bestStreak} Days</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Current Streak</p>
                </div>
                
                <div className="rounded-xl border p-3.5 space-y-1">
                  <Clock className="size-4 text-blue-500" />
                  <p className="text-lg font-bold leading-none mt-1">{studyHours} Hrs</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Total Study Time</p>
                </div>
              </div>

              <div className="rounded-xl border p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Completed Lessons</span>
                  <span className="font-bold">{totalCompletedLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Weekly Avg Time</span>
                  <span className="font-bold">{(avgDailyMinutes / 60 * 7).toFixed(1)} hrs/week</span>
                </div>
              </div>
            </div>

            {/* Weekly Goal Widget */}
            <div className="rounded-2xl border bg-[var(--card)] p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Target className="size-4 text-[var(--primary)]" />
                Weekly Study Goal
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-5">
                Target: {continueRoadmap?.estimatedHoursPerWeek || 10} hours of structured learning per week.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Hours completed</span>
                  <span>{studyHours} / {continueRoadmap?.estimatedHoursPerWeek || 10} hrs</span>
                </div>
                <ProgressBar
                  value={(parseFloat(studyHours) / (continueRoadmap?.estimatedHoursPerWeek || 10)) * 100}
                  color="bg-emerald-600"
                />
              </div>
            </div>

            {/* Achievements Card */}
            {achievements.length > 0 && (
              <div className="rounded-2xl border bg-[var(--card)] p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Award className="size-4 text-[var(--primary)]" />
                  Unlocked Achievements
                </h4>
                
                <div className="space-y-2.5">
                  {achievements.map((ach) => (
                    <div key={ach.title} className="flex gap-3 items-center">
                      <span className={`grid size-9 place-items-center rounded-xl text-lg shrink-0 ${ach.color}`}>
                        {ach.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-5">{ach.title}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)] leading-3">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
