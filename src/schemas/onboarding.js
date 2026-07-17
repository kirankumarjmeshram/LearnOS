import { z } from "zod";

export const onboardingSchema = z.object({
  // Career Goal (target role)
  goal: z.string().min(2, "Choose or enter a career goal."),
  
  // Experience Level
  experienceLevel: z.string().min(1, "Select your experience level."),
  
  // Learning Goal
  learningGoal: z.string().min(1, "Select your learning goal."),
  
  // Timeline
  timeline: z.string().min(1, "Choose a target timeline."),
  
  // Weekly Study Hours
  weeklyHours: z.coerce.number().min(5, "Choose at least 5 hours per week.").max(40),
  
  // Current Knowledge
  currentKnowledge: z.array(z.string()).default([]),
  
  // Preferred Technology Stack
  preferredTechnologyStack: z.array(z.string()).default([]),
  
  // Custom Technologies
  customTechnologies: z.array(z.string()).default([]),
  
  // Learning Style Ranking
  learningStyleRanking: z.array(z.string()).min(1, "Rank your learning style preferences."),
  
  // User Resources (Optional)
  resources: z.array(z.object({
    title: z.string(),
    type: z.string(),
    url: z.string().optional(),
    filePath: z.string().optional(),
    technology: z.string(),
    tags: z.array(z.string()).default([]),
    notes: z.string().default(""),
    visibility: z.enum(["global", "roadmap"]).default("roadmap"),
  })).default([]),
  
  // Legacy fields (optional / defaulted for backward compatibility)
  education: z.string().optional().default(""),
  experience: z.string().optional().default(""),
  currentJob: z.string().optional().default(""),
  country: z.string().optional().default(""),
  learningStyles: z.array(z.string()).optional().default([]),
  assessmentDecision: z.enum(["skip", "start"]).optional().default("skip"),
});

export const onboardingDefaults = {
  goal: "",
  experienceLevel: "Complete Beginner",
  learningGoal: "Upskill",
  timeline: "3 Months",
  weeklyHours: 10,
  currentKnowledge: [],
  preferredTechnologyStack: [],
  customTechnologies: [],
  learningStyleRanking: ["Projects", "Videos", "Reading", "Interactive Labs", "Documentation"],
  resources: [],
  education: "",
  experience: "",
  currentJob: "",
  country: "",
  learningStyles: [],
  assessmentDecision: "skip",
};
