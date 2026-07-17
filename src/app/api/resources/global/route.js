import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalResource } from "@/models/global-resource";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const resources = await GlobalResource.find({ clerkId: userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ resources });
  } catch (error) {
    console.error("GET GlobalResource Error:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Create new global resource
    const newResource = await GlobalResource.create({
      ...body,
      clerkId: userId,
    });

    return NextResponse.json({ resource: newResource }, { status: 201 });
  } catch (error) {
    console.error("POST GlobalResource Error:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
