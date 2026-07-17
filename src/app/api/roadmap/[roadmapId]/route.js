import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { updateRoadmapStatus } from "@/services/roadmap-service";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["active", "archived", "completed"]),
});

export async function PATCH(request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { roadmapId } = await params;
    const body = patchSchema.parse(await request.json());
    const roadmap = await updateRoadmapStatus(userId, roadmapId, body.status);
    return NextResponse.json({ roadmap });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update roadmap." },
      { status: 400 },
    );
  }
}
