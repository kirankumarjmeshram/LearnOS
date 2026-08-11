export function assertEmbeddingVector(vector, expectedDimensions) {
  if (!Array.isArray(vector) || !vector.length || vector.some((value) => !Number.isFinite(value))) {
    throw new Error("The embedding provider returned an invalid vector.");
  }
  if (vector.length !== expectedDimensions) {
    throw new Error(`Embedding dimension mismatch: expected ${expectedDimensions}, received ${vector.length}.`);
  }
  return vector;
}

export function normalizeEmbeddingVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value ** 2, 0));
  if (!magnitude) throw new Error("The embedding provider returned a zero-length vector.");
  return vector.map((value) => value / magnitude);
}
