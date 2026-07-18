import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getAllRoadmapsWithProgress } from "@/services/learning-service";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roadmaps = await getAllRoadmapsWithProgress(user.id);
    return NextResponse.json({ roadmaps: JSON.parse(JSON.stringify(roadmaps)) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
