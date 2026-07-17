import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename while preserving extension
    const originalName = file.name || "uploaded-file";
    const extension = originalName.split(".").pop();
    const uniqueFilename = `${randomUUID()}.${extension}`;
    
    // Save to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    const filePath = join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return the public URL path
    const url = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ url, originalName, size: file.size, type: file.type }, { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
