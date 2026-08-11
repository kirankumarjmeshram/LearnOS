import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalResource } from "@/models/global-resource";
import { removeOwnedResourceVectors } from "@/services/rag/rag-service";

export const runtime = "nodejs";

export async function PUT(request, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();
    const existingResource = await GlobalResource.findOne({ _id: id, clerkId: userId });
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found or unauthorized" }, { status: 404 });
    }
    const needsReprocessing = (body.filePath && body.filePath !== existingResource.filePath) || (body.type && body.type !== existingResource.type);
    if (needsReprocessing) await removeOwnedResourceVectors(userId, existingResource);
    
    const updatedResource = await GlobalResource.findOneAndUpdate(
      { _id: id, clerkId: userId },
      { $set: { ...body, ...(needsReprocessing && { processedStatus: "pending", processingError: "", processedAt: null }) } },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!updatedResource) {
      return NextResponse.json({ error: "Resource not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ resource: updatedResource });
  } catch (error) {
    console.error("PUT GlobalResource Error:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();
    
    // Primarily used for toggling isFavorite
    const updatedResource = await GlobalResource.findOneAndUpdate(
      { _id: id, clerkId: userId },
      { $set: body },
      { returnDocument: "after" }
    ).lean();

    if (!updatedResource) {
      return NextResponse.json({ error: "Resource not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ resource: updatedResource });
  } catch (error) {
    console.error("PATCH GlobalResource Error:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const resource = await GlobalResource.findOne({ _id: id, clerkId: userId });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found or unauthorized" }, { status: 404 });
    }
    await removeOwnedResourceVectors(userId, resource);
    
    const result = await GlobalResource.deleteOne({ _id: id, clerkId: userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Resource not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE GlobalResource Error:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
