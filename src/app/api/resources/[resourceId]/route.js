import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteUserResource, updateUserResource } from "@/services/resources/resource-service";

const resourceSchema = z.object({
  title: z.string().min(1, "A resource title is required.").max(120),
  type: z.enum(["youtube", "documentation", "website", "pdf", "image", "drive", "github", "other"]),
  url: z.string().url("Enter a valid resource URL."),
  description: z.string().max(500).optional().default(""),
});

export async function PUT(request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { resourceId } = await params;
    const resource = resourceSchema.parse(await request.json());
    const saved = await updateUserResource(userId, resourceId, resource);
    return NextResponse.json({ resource: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not update this resource." }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { resourceId } = await params;
    await deleteUserResource(userId, resourceId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not delete this resource." }, { status: 404 });
  }
}
