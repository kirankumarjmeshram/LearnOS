import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { saveLessonNote } from "@/services/resources/resource-service";

const noteSchema = z.object({ content: z.string().max(50000, "Notes must be under 50,000 characters.") });

export async function PUT(request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { lessonId } = await params;
    const { content } = noteSchema.parse(await request.json());
    const note = await saveLessonNote(userId, lessonId, content);
    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not save this note." }, { status: 400 });
  }
}
