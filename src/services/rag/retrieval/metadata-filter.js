export function buildMetadataFilter({ userId, resourceId, lessonId }) {
  const must = [{ key: "userId", match: { value: userId } }];
  if (resourceId) must.push({ key: "resourceId", match: { value: resourceId.toString() } });
  if (lessonId) must.push({ key: "lessonId", match: { value: lessonId.toString() } });
  return { must };
}
