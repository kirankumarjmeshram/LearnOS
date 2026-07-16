import mongoose from "mongoose";

const lessonResourceSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Phase", required: true, index: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
  source: { type: String, enum: ["ai", "user"], required: true, index: true },
  type: { type: String, enum: ["youtube", "documentation", "article", "book", "exercise", "website", "pdf", "image", "drive", "github", "other"], required: true },
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  thumbnailUrl: { type: String, default: "" },
}, { timestamps: true });

lessonResourceSchema.index({ lessonId: 1, source: 1, url: 1 }, { unique: true });

export const LessonResource = mongoose.models.LessonResource || mongoose.model("LessonResource", lessonResourceSchema);
