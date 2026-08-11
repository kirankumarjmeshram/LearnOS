export function toVectorPayload({ userId, resource, chunk, chunkIndex }) {
  return {
    userId,
    resourceId: resource._id.toString(),
    lessonId: resource.lessonId?.toString() || null,
    chunkIndex,
    title: resource.title,
    sourceType: resource.type,
    text: chunk,
  };
}
