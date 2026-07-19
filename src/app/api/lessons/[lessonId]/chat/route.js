import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { askAiTutor } from "@/services/ai/lesson-chat-service";

export async function POST(req, props) {
  const params = await props.params;
  const lessonId = params.lessonId;
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userMessage } = await req.json();

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const responseText = await askAiTutor(user.id, lessonId, userMessage);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("[LessonChat API Error]:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
