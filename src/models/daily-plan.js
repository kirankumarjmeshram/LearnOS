import mongoose from "mongoose";

const dailyPlanSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  day: { type: Number, required: true, min: 1 },
  task: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
}, { timestamps: true });

dailyPlanSchema.index({ roadmapId: 1, day: 1 }, { unique: true });

export const DailyPlan = mongoose.models.DailyPlan || mongoose.model("DailyPlan", dailyPlanSchema);
