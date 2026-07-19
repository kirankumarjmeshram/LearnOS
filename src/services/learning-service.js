import "server-only";

import { connectToDatabase } from "@/lib/mongodb";

// Register referenced mongoose models
import "@/models/phase";
import "@/models/daily-plan";

import { Lesson } from "@/models/lesson";
import { Progress } from "@/models/progress";
import { Roadmap } from "@/models/roadmap";

// ─── Private helpers ────────────────────────────────────────────────────────

function createResourcePlaceholders(resources = []) {
  const sourceItems =
    resources.length > 0
      ? resources
      : ["Official documentation", "Practice exercise"];

  return sourceItems.map((title, index) => ({
    type:
      index === sourceItems.length - 1
        ? "exercise"
        : "documentation",
    title,
    url: "",
  }));
}

async function ensureLessons(roadmap) {
  const existingLessons = await Lesson.find({ roadmapId: roadmap._id })
    .sort({ order: 1 })
    .lean();
  if (existingLessons.length) return existingLessons;

  let order = 1;
  const lessons = roadmap.phases.flatMap((phase) => {
    const skills = phase.skills?.length ? phase.skills : [phase.title];
    return skills.map((skill, index) => ({
      roadmapId: roadmap._id,
      phaseId: phase._id,
      week: Math.min(index + 1, phase.weeks),
      title: `${phase.title}: ${skill}`,
      description: phase.description,
      learningObjectives: [
        `Understand the fundamentals of ${skill}.`,
        `Apply ${skill} within your ${roadmap.goal} journey.`,
      ],
      topics: [skill],
      estimatedDuration: "60 minutes",
      resources: createResourcePlaceholders(phase.resources || []),
      practice: `Complete a focused practice exercise covering ${skill}.`,
      project: phase.projects?.[0] || "",
      order: order++,
      status: "pending",
    }));
  });

  if (!lessons.length) return [];
  await Lesson.insertMany(lessons, { ordered: false });
  return Lesson.find({ roadmapId: roadmap._id }).sort({ order: 1 }).lean();
}

async function ensureProgress(clerkId, roadmapId, lessons) {
  const currentLesson = lessons.find((lesson) => lesson.status !== "completed") || null;
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;
  return Progress.findOneAndUpdate(
    { clerkId, roadmapId },
    {
      $set: {
        completedLessonIds: completedLessons.map((lesson) => lesson._id),
        completedLessons: completedLessons.length,
        totalLessons,
        progressPercentage,
        currentLessonId: currentLesson?._id || null,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    },
  ).lean();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns the learning experience for a specific roadmap (or the latest one
 * if roadmapId is omitted).  Phases are populated on the roadmap.
 */
export async function getLearningExperience(clerkId, roadmapId = null) {
  await connectToDatabase();

  let roadmapQuery;
  if (roadmapId) {
    roadmapQuery = Roadmap.findOne({ _id: roadmapId, clerkId });
  } else {
    roadmapQuery = Roadmap.findOne({ clerkId }).sort({ createdAt: -1 });
  }

  const roadmap = await roadmapQuery
    .populate({ path: "phases" })
    .lean();

  if (!roadmap) return null;
  const lessons = await ensureLessons(roadmap);
  const progress = await ensureProgress(clerkId, roadmap._id, lessons);
  return { roadmap, lessons, progress };
}

/**
 * Returns all lessons for a roadmap ordered by `order`.
 * Lightweight — does not call ensureLessons.
 */
export async function getLessonsForRoadmap(roadmapId) {
  await connectToDatabase();
  return Lesson.find({ roadmapId }).sort({ order: 1 }).lean();
}

/**
 * Returns all roadmaps for a user, each annotated with its Progress document.
 * Sorted by most recently studied, then creation date.
 */
export async function getAllRoadmapsWithProgress(clerkId) {
  await connectToDatabase();
  const [roadmaps, progressList] = await Promise.all([
    Roadmap.find({ clerkId })
      .sort({ lastStudiedAt: -1, createdAt: -1 })
      .populate("phases")
      .lean(),
    Progress.find({ clerkId }).lean(),
  ]);

  const progressMap = progressList.reduce((acc, p) => {
    acc[p.roadmapId.toString()] = p;
    return acc;
  }, {});

  return roadmaps.map((r) => ({
    ...r,
    progress: progressMap[r._id.toString()] || null,
  }));
}

/**
 * Lightweight query for the dashboard.
 * Does not populate phases to reduce serialization and DB overhead.
 */
export async function getDashboardRoadmaps(clerkId) {
  await connectToDatabase();
  const [roadmaps, progressList] = await Promise.all([
    Roadmap.find({ clerkId })
      .sort({ lastStudiedAt: -1, createdAt: -1 })
      .select("-phases") // Optional: strictly exclude phases if stored, though .lean() without .populate is enough
      .lean(),
    Progress.find({ clerkId }).lean(),
  ]);

  const progressMap = progressList.reduce((acc, p) => {
    acc[p.roadmapId.toString()] = p;
    return acc;
  }, {});

  return roadmaps.map((r) => ({
    ...r,
    progress: progressMap[r._id.toString()] || null,
  }));
}

export async function getLessonForUser(clerkId, lessonId) {
  await connectToDatabase();
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) return null;
  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId }).lean();
  if (!roadmap) return null;
  const [previousLesson, nextLesson] = await Promise.all([
    Lesson.findOne({ roadmapId: lesson.roadmapId, order: { $lt: lesson.order } })
      .sort({ order: -1 })
      .lean(),
    Lesson.findOne({ roadmapId: lesson.roadmapId, order: { $gt: lesson.order } })
      .sort({ order: 1 })
      .lean(),
  ]);
  return { lesson, previousLesson, nextLesson, roadmap };
}

/**
 * Marks a lesson complete, recalculates progress (including streak and
 * lastCompletedAt), updates the roadmap's lastStudiedAt, and sets the
 * roadmap status to "completed" if every lesson is done.
 */
export async function completeLessonForUser(clerkId, lessonId) {
  await connectToDatabase();
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found.");
  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId });
  if (!roadmap) throw new Error("You do not have access to this lesson.");

  const now = new Date();

  if (lesson.status !== "completed") {
    lesson.status = "completed";
    lesson.completedAt = now;
    await lesson.save();
  }

  // Fetch existing progress for streak calculation
  const existingProgress = await Progress.findOne({ clerkId, roadmapId: roadmap._id }).lean();
  let newStreak = existingProgress?.streak || 0;

  if (existingProgress?.lastCompletedAt) {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const lastDay = new Date(existingProgress.lastCompletedAt);
    lastDay.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastDay) / 86_400_000);

    if (diffDays === 0) {
      // Same calendar day — leave streak unchanged
    } else if (diffDays === 1) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  // Recalculate full progress
  const lessons = await Lesson.find({ roadmapId: roadmap._id }).sort({ order: 1 }).lean();
  const completedLessons = lessons.filter((l) => l.status === "completed");
  const totalLessons = lessons.length;
  const currentLesson = lessons.find((l) => l.status !== "completed") || null;
  const progressPercentage = totalLessons
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  const progress = await Progress.findOneAndUpdate(
    { clerkId, roadmapId: roadmap._id },
    {
      $set: {
        completedLessonIds: completedLessons.map((l) => l._id),
        completedLessons: completedLessons.length,
        totalLessons,
        progressPercentage,
        currentLessonId: currentLesson?._id || null,
        streak: newStreak,
        lastCompletedAt: now,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).lean();

  // Update roadmap activity timestamp + completion status
  const allDone = completedLessons.length === totalLessons && totalLessons > 0;
  await Roadmap.findByIdAndUpdate(roadmap._id, {
    lastStudiedAt: now,
    ...(allDone && { status: "completed" }),
  });

  return {
    lessonId: lesson._id.toString(),
    progress,
    nextLesson: currentLesson,
  };
}
