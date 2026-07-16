import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  completedLessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  completedLessons: { type: Number, default: 0, min: 0 },
  totalLessons: { type: Number, default: 0, min: 0 },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  currentLessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", default: null },
  streak: { type: Number, default: 0, min: 0 },
  lastCompletedAt: { type: Date, default: null },
}, { timestamps: true });

progressSchema.index({ clerkId: 1, roadmapId: 1 }, { unique: true });

export const Progress = mongoose.models.Progress || mongoose.model("Progress", progressSchema);
