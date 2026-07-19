import { currentUser } from "@clerk/nextjs/server";
import { getDashboardRoadmaps } from "@/services/learning-service";
import { ProfileClient } from "./_components/profile-client";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await currentUser();
  const roadmaps = user ? await getDashboardRoadmaps(user.id) : [];

  const serializedUser = user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Learner",
    email: user.emailAddresses[0]?.emailAddress || "Unknown",
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
  } : null;

  // Calculate learning stats
  const activeRoadmaps = roadmaps.filter((r) => r.status === "active");
  const totalLessons = roadmaps.reduce((acc, r) => acc + (r.progress?.completedLessons || 0), 0);
  const currentStreak = roadmaps.reduce((acc, r) => Math.max(acc, r.progress?.streak || 0), 0);
  
  // Estimate hours (assume 0.5 hours per lesson completed for fun stats, or parse real duration if needed)
  const estimatedHours = Math.round(totalLessons * 0.75); 
  
  // Calculate level based on lessons
  let currentLevel = "Novice";
  if (totalLessons >= 10) currentLevel = "Apprentice";
  if (totalLessons >= 25) currentLevel = "Scholar";
  if (totalLessons >= 50) currentLevel = "Master";

  const stats = {
    activeRoadmapCount: activeRoadmaps.length,
    totalLessons,
    currentStreak,
    estimatedHours,
    currentLevel,
    currentGoal: activeRoadmaps.length > 0 ? activeRoadmaps[0].goal : null,
    continueLessonId: activeRoadmaps.length > 0 ? activeRoadmaps[0].progress?.currentLessonId : null
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 animate-in fade-in duration-500">
      <ProfileClient user={serializedUser} stats={stats} />
    </div>
  );
}
