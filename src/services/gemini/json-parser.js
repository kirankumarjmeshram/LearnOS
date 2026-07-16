import { z } from "zod";

const phaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  weeks: z.coerce.number().int().positive(),
  skills: z.array(z.string().min(1)),
  projects: z.array(z.string()),
  resources: z.array(z.string()),
});

const dailyPlanSchema = z.object({
  day: z.coerce.number().int().positive(),
  task: z.string().min(1),
  duration: z.string().min(1),
});

export const roadmapSchema = z.object({
  goal: z.string().min(1),
  duration: z.string().min(1),
  summary: z.string().min(1),
  difficulty: z.string().min(1),
  estimatedHoursPerWeek: z.coerce.number().positive(),
  phases: z.array(phaseSchema).min(1),
  dailyPlan: z.array(dailyPlanSchema).min(1),
});

function extractJsonObject(value) {
  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) throw new Error("The AI response did not contain a JSON object.");
  return value.slice(firstBrace, lastBrace + 1);
}

function repairJson(value) {
  return value
    .replace(/^\uFEFF/, "")
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

export function parseRoadmapJson(responseText) {
  if (typeof responseText !== "string" || !responseText.trim()) throw new Error("Gemini returned an empty roadmap response.");
  let parsed;
  try {
    parsed = JSON.parse(extractJsonObject(repairJson(responseText)));
  } catch {
    throw new Error("Gemini returned a malformed roadmap response.");
  }

  const validated = roadmapSchema.safeParse(parsed);
  if (!validated.success) throw new Error("Gemini returned a roadmap with missing or invalid required fields.");
  return validated.data;
}
