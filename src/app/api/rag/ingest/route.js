import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ingestOwnedResource } from "@/services/rag/rag-service";
import { toSafeRagError } from "@/services/rag/rag-types";

export const runtime = "nodejs";

const schema = z.object({ resourceId: z.string().min(1) });

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const { resourceId } = schema.parse(await request.json());
    const result = await ingestOwnedResource(userId, resourceId);
    return NextResponse.json({ resource: result.resource, chunkCount: result.chunkCount, timings: result.timings });
  } catch (error) {
    const safeError = toSafeRagError(error);
    return NextResponse.json({ error: safeError.message, code: safeError.code }, { status: safeError.status });
  }
}
