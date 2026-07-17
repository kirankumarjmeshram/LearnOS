import mongoose from "mongoose";

// Force registration of referenced models
import "@/models/phase";
import "@/models/daily-plan";

const roadmapSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },

    goal: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      required: true,
      trim: true,
    },

    estimatedHoursPerWeek: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      default: "active",
      index: true,
    },

    lastStudiedAt: {
      type: Date,
      default: null,
    },

    onboarding: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    phases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phase",
      },
    ],

    dailyPlan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyPlan",
      },
    ],
  },
  {
    timestamps: true,
  }
);

roadmapSchema.index({ clerkId: 1, createdAt: -1 });
roadmapSchema.index({ clerkId: 1, status: 1, lastStudiedAt: -1 });

export const Roadmap =
  mongoose.models.Roadmap ||
  mongoose.model("Roadmap", roadmapSchema);