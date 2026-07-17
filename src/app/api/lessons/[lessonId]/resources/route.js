import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { addUserResource, getLessonResources } from "@/services/resources/resource-service";

export const runtime = "nodejs";

const resourceSchema = z.object({
  title: z.string().min(1, "A resource title is required.").max(120),
  type: z.enum(["youtube", "documentation", "website", "pdf", "image", "drive", "github", "other"]),
  url: z.string().url("Enter a valid resource URL."),
  description: z.string().max(500).optional().default(""),
});

export async function GET(_request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { lessonId } = await params;
    const resources = await getLessonResources(userId, lessonId);
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "We could not fetch resources." },
      { status: 400 }
    );
  }
}

export async function POST(request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { lessonId } = await params;
    const resource = resourceSchema.parse(await request.json());
    const saved = await addUserResource(userId, lessonId, resource);
    return NextResponse.json({ resource: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "We could not save this resource." },
      { status: 400 }
    );
  }
}
