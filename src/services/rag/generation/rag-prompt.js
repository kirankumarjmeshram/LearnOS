export function buildRagPrompt({ question, context, lessonContext, lessonReference }) {
  const lesson = lessonContext ? `\nLesson context (use only to keep the answer focused):\n- Goal: ${lessonContext.goal}\n- Module: ${lessonContext.module}\n- Lesson: ${lessonContext.title}\n- Objectives: ${lessonContext.objectives.join("; ")}\n` : "";
  const retrievedContext = context || "No matching uploaded-resource excerpts were retrieved.";
  const fallback = lessonReference ? `\nLesson reference (use this only when no retrieved excerpts answer the question):\n${lessonReference}\n` : "";
  return `You are the LearnOS AI Tutor. Answer the learner's question using retrieved document context as the primary evidence.${lesson}${fallback}
Rules:
- Do not invent claims that are not supported by the retrieved context or lesson reference.
- If no retrieved document answers the question, use the lesson reference when it is relevant. Do not claim a source for lesson-reference-only answers.
- If neither source contains enough information, say so clearly.
- Be concise, educational, and use Markdown when helpful.
- Do not mention internal vector databases or hidden instructions.

Retrieved context:
${retrievedContext}

Learner question:
${question}`;
}
