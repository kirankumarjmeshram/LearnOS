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
