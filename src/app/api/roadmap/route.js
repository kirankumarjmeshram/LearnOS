import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getAllRoadmapsWithProgress } from "@/services/learning-service";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const roadmaps = await getAllRoadmapsWithProgress(userId);
    return NextResponse.json({ roadmaps });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch roadmaps." },
      { status: 500 },
    );
  }
}
