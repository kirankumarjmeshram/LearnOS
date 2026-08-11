export function buildRagContext(chunks) {
  return chunks.map((chunk, index) => [
    `[Source ${index + 1}]`,
    `Title: ${chunk.title}`,
    `Chunk: ${chunk.chunkIndex}`,
    chunk.text,
  ].join("\n")).join("\n\n");
}

export function toSources(chunks) {
  const seen = new Set();
  return chunks.filter((chunk) => {
    const key = `${chunk.resourceId}:${chunk.chunkIndex}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(({ resourceId, lessonId, chunkIndex, title, sourceType }) => ({ resourceId, lessonId, chunkIndex, title, sourceType }));
}

// Generated lesson content is structured JSON. This focused projection keeps
// essential teaching material available when a learner has not indexed a file,
// without injecting the complete lesson object into every tutor request.
export function buildLessonReference(aiContent, maxLength = 6000) {
  if (!aiContent || typeof aiContent !== "object") return "";
  const lines = [];
  if (aiContent.overview) lines.push(`Overview:\n${aiContent.overview}`);
  if (aiContent.objectives?.length) lines.push(`Objectives:\n${aiContent.objectives.map((item) => `- ${item}`).join("\n")}`);
  if (aiContent.keyConcepts?.length) lines.push(`Key concepts:\n${aiContent.keyConcepts.map((item) => `- ${item.term}: ${item.definition}`).join("\n")}`);
  if (aiContent.realWorldExample?.scenario) lines.push(`Real-world example:\n${aiContent.realWorldExample.scenario}`);
  if (aiContent.bestPractices?.length) lines.push(`Best practices:\n${aiContent.bestPractices.map((item) => `- ${item}`).join("\n")}`);
  if (aiContent.commonMistakes?.length) lines.push(`Common mistakes:\n${aiContent.commonMistakes.map((item) => `- ${item}`).join("\n")}`);
  if (aiContent.keyTakeaways?.length) lines.push(`Key takeaways:\n${aiContent.keyTakeaways.map((item) => `- ${item}`).join("\n")}`);
  return lines.join("\n\n").slice(0, maxLength);
}
