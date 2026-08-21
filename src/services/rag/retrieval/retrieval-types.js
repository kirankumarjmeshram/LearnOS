export function toRetrievalResult(result) {
  const payload = result.payload || {};
  return {
    text: payload.text || "",
    score: result.score,
    resourceId: payload.resourceId,
    lessonId: payload.lessonId,
    chunkIndex: payload.chunkIndex,
    title: payload.title,
    sourceType: payload.sourceType,
  };
}
