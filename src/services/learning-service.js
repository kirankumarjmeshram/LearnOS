import "server-only";

import { connectToDatabase } from "@/lib/mongodb";

// Register referenced mongoose models
import "@/models/phase";
import "@/models/daily-plan";

import { Lesson } from "@/models/lesson";
import { Progress } from "@/models/progress";
import { Roadmap } from "@/models/roadmap";

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

export async function getLearningExperience(clerkId) {
  await connectToDatabase();
  const roadmap = await Roadmap.findOne({ clerkId })
  .sort({ createdAt: -1 })
  .populate({
    path: "phases",
  })
  .lean();
  if (!roadmap) return null;
  const lessons = await ensureLessons(roadmap);
  const progress = await ensureProgress(clerkId, roadmap._id, lessons);
  return { roadmap, lessons, progress };
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

export async function completeLessonForUser(clerkId, lessonId) {
  await connectToDatabase();
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found.");
  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId });
  if (!roadmap) throw new Error("You do not have access to this lesson.");

  if (lesson.status !== "completed") {
    lesson.status = "completed";
    lesson.completedAt = new Date();
    await lesson.save();
  }

  const lessons = await Lesson.find({ roadmapId: roadmap._id }).sort({ order: 1 }).lean();
  const progress = await ensureProgress(clerkId, roadmap._id, lessons);
  return {
    lessonId: lesson._id.toString(),
    progress,
    nextLesson: lessons.find((item) => item.status !== "completed") || null,
  };
}
