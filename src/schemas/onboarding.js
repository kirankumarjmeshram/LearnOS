import { z } from "zod";

export const onboardingSchema = z.object({
  goal: z.string().min(2, "Choose or enter a learning goal."),
  timeline: z.string().min(1, "Choose a target timeline."),
  weeklyHours: z.coerce.number().min(5, "Choose at least 5 hours per week.").max(40),
  education: z.string().optional(),
  experience: z.string().optional(),
  currentJob: z.string().optional(),
  country: z.string().optional(),
  learningStyles: z.array(z.string()).min(1, "Select at least one learning style."),
  assessmentDecision: z.enum(["skip", "start"], { message: "Choose how to continue with the assessment." }),
});

export const onboardingDefaults = {
  goal: "",
  timeline: "",
  weeklyHours: 10,
  education: "",
  experience: "",
  currentJob: "",
  country: "",
  learningStyles: [],
  assessmentDecision: "skip",
};
