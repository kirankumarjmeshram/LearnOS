import mongoose from "mongoose";

const globalResourceSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", default: null, index: true },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Phase", default: null, index: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", default: null, index: true },
  
  // Denormalized context for safety
  roadmapTitle: { type: String, default: "" },
  phaseTitle: { type: String, default: "" },
  lessonTitle: { type: String, default: "" },
  
  type: {
    type: String,
    enum: ["youtube", "documentation", "blog", "github", "pdf", "docx", "pptx", "image", "markdown", "text", "website", "other"],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  url: { type: String, trim: true },
  filePath: { type: String, trim: true },
  technology: { type: String, required: true, trim: true },
  tags: { type: [String], default: [] },
  notes: { type: String, default: "", trim: true },
  
  // Visibility and context
  visibility: { type: String, enum: ["global", "roadmap"], default: "global" },
  savedFrom: { 
    type: String, 
    enum: ["lesson", "dashboard", "resources", "ai_tutor", "quick_resource", "unknown"], 
    default: "unknown" 
  },
  
  // Learning metadata
  isFavorite: { type: Boolean, default: false },
  status: { type: String, enum: ["unread", "reading", "completed", "archived"], default: "unread" },
  
  // Architecture preparation for future features
  processedStatus: { type: String, enum: ["pending", "processed", "failed"], default: "pending" },
}, { timestamps: true });

// Ensure we can query quickly by clerkId and technology
globalResourceSchema.index({ clerkId: 1, technology: 1 });
globalResourceSchema.index({ clerkId: 1, isFavorite: 1 });
globalResourceSchema.index({ clerkId: 1, lessonId: 1 });

export const GlobalResource = mongoose.models.GlobalResource || mongoose.model("GlobalResource", globalResourceSchema);
