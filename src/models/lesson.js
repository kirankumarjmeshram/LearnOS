import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["video", "documentation", "article", "book", "exercise"] },
  title: { type: String, required: true, trim: true },
  url: { type: String, default: "" },
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Phase", required: true, index: true },
  week: { type: Number, required: true, min: 1 },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  learningObjectives: [{ type: String, trim: true }],
  topics: [{ type: String, trim: true }],
  estimatedDuration: { type: String, required: true, trim: true },
  resources: [resourceSchema],
  practice: { type: String, required: true, trim: true },
  project: { type: String, default: "", trim: true },
  order: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["pending", "completed"], default: "pending", index: true },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

lessonSchema.index({ roadmapId: 1, order: 1 }, { unique: true });

export const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
