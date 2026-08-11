import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { queryRag } from "@/services/rag/rag-service";
import { toSafeRagError } from "@/services/rag/rag-types";

export const runtime = "nodejs";

const schema = z.object({
  question: z.string().trim().min(1).max(4000),
  resourceId: z.string().min(1).optional(),
  lessonId: z.string().min(1).optional(),
});

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  try {
    const body = schema.parse(await request.json());
    return NextResponse.json(await queryRag({ userId, ...body }));
  } catch (error) {
    const safeError = toSafeRagError(error);
    return NextResponse.json({ error: safeError.message, code: safeError.code }, { status: safeError.status });
  }
}
