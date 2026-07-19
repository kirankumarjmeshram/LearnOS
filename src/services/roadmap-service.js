import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { DailyPlan } from "@/models/daily-plan";
import { Phase } from "@/models/phase";
import { Roadmap } from "@/models/roadmap";
import { GlobalResource } from "@/models/global-resource";

export async function saveRoadmap({ clerkId, onboarding, roadmap }) {
  await connectToDatabase();
  const savedRoadmap = await Roadmap.create({
    clerkId,
    goal: roadmap.goal,
    duration: roadmap.duration,
    summary: roadmap.summary,
    difficulty: roadmap.difficulty,
    estimatedHoursPerWeek: roadmap.estimatedHoursPerWeek,
    onboarding,
  });

  const phases = await Phase.insertMany(roadmap.phases.map((phase) => ({ ...phase, roadmapId: savedRoadmap._id })));
  const dailyPlan = await DailyPlan.insertMany(roadmap.dailyPlan.map((item) => ({ ...item, roadmapId: savedRoadmap._id })));
  savedRoadmap.phases = phases.map((phase) => phase._id);
  savedRoadmap.dailyPlan = dailyPlan.map((item) => item._id);
  await savedRoadmap.save();

  // Save Global Resources from onboarding
  if (onboarding.resources && onboarding.resources.length > 0) {
    const resourceDocs = onboarding.resources.map(r => ({
      ...r,
      clerkId,
      roadmapId: r.visibility === "roadmap" ? savedRoadmap._id : null,
    }));
    await GlobalResource.insertMany(resourceDocs);
  }

  return savedRoadmap.populate(["phases", { path: "dailyPlan", options: { sort: { day: 1 } } }]);
}

export async function getLatestRoadmap(clerkId) {
  await connectToDatabase();
  return Roadmap.findOne({ clerkId }).sort({ createdAt: -1 }).populate(["phases", { path: "dailyPlan", options: { sort: { day: 1 } } }]).lean();
}

export async function updateRoadmapStatus(clerkId, roadmapId, status) {
  await connectToDatabase();
  const roadmap = await Roadmap.findOneAndUpdate(
    { _id: roadmapId, clerkId },
    { $set: { status } },
    { returnDocument: "after" },
  ).lean();
  if (!roadmap) throw new Error("Roadmap not found or access denied.");
  return roadmap;
}

