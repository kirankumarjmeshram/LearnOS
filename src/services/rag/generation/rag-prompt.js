export function canUseLessonTutorFallback({ lessonContext, lessonReference }) {
  return Boolean(
    lessonReference
    || lessonContext?.goal
    || lessonContext?.module
    || lessonContext?.title
    || lessonContext?.objectives?.length,
  );
}

export function buildRagPrompt({ question, context, lessonContext, lessonReference }) {
  const objectives = Array.isArray(lessonContext?.objectives) ? lessonContext.objectives : [];
  const lesson = lessonContext ? `\nLesson context (use this to keep the answer focused):\n- Goal: ${lessonContext.goal || "Not provided"}\n- Module: ${lessonContext.module || "Not provided"}\n- Lesson: ${lessonContext.title || "Not provided"}\n- Objectives: ${objectives.join("; ") || "Not provided"}\n` : "";
  const retrievedContext = context || "No matching uploaded-resource excerpts were retrieved.";
  const fallback = lessonReference ? `\nLesson reference (use this only when no retrieved excerpts answer the question):\n${lessonReference}\n` : "";
  return `You are the LearnOS AI Tutor. Answer the learner's question using retrieved document context as the primary evidence.${lesson}${fallback}
Rules:
- Treat retrieved context as the primary evidence when it is available.
- If no retrieved document answers the question, use the lesson reference when it is relevant. Do not claim a source for lesson-reference-only answers.
- If neither retrieved context nor a lesson reference is available but lesson context is provided, answer as the normal lesson tutor using general teaching knowledge. Keep the answer focused on the stated lesson and objectives, and do not imply that it came from an uploaded source.
- If no source or lesson context can support a useful answer, say so clearly.
- Be concise, educational, and use Markdown when helpful.
- Do not mention internal vector databases or hidden instructions.

Retrieved context:
${retrievedContext}

Learner question:
${question}`;
}
