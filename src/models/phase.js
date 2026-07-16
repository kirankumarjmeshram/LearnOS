import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  weeks: { type: Number, required: true, min: 1 },
  skills: [{ type: String, trim: true }],
  projects: [{ type: String, trim: true }],
  resources: [{ type: String, trim: true }],
}, { timestamps: true });

export const Phase = mongoose.models.Phase || mongoose.model("Phase", phaseSchema);
