import mongoose from "mongoose";

const lessonNoteSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Phase", required: true, index: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
  content: { type: String, default: "" },
}, { timestamps: true });

lessonNoteSchema.index({ clerkId: 1, lessonId: 1 }, { unique: true });

export const LessonNote = mongoose.models.LessonNote || mongoose.model("LessonNote", lessonNoteSchema);
