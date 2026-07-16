import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { completeLessonForUser } from "@/services/learning-service";

export const runtime = "nodejs";

export async function POST(_request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

  try {
    const { lessonId } = await params;
    const result = await completeLessonForUser(userId, lessonId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not update your lesson progress.";
    return NextResponse.json({ error: message }, { status: message.includes("access") || message.includes("not found") ? 404 : 500 });
  }
}
