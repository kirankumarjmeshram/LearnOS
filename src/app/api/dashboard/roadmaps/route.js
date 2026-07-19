import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDashboardRoadmaps } from "@/services/learning-service";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roadmaps = await getDashboardRoadmaps(userId);
    return NextResponse.json({ roadmaps: JSON.parse(JSON.stringify(roadmaps)) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
