import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { onboardingSchema } from "@/schemas/onboarding";
import { generateRoadmap } from "@/services/gemini/roadmap-generator";
import { saveRoadmap } from "@/services/roadmap-service";
import { pregenerateLessons } from "@/services/gemini/content-generator";

export const runtime = "nodejs";

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

  try {
    const body = await request.json();
    const onboarding = onboardingSchema.parse(body.onboarding);
    const roadmap = await generateRoadmap(onboarding);
    const savedRoadmap = await saveRoadmap({ clerkId: userId, onboarding, roadmap });
    
    // Background pre-generation (fire-and-forget)
    pregenerateLessons(savedRoadmap._id).catch(console.error);

    return NextResponse.json({ roadmap: savedRoadmap }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not generate your roadmap.";
    const status = message.includes("validation") || message.includes("Choose") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
