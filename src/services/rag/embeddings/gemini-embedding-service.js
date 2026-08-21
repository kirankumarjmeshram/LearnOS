import "server-only";

import { getGeminiClient } from "@/services/gemini/client";
import { getRagConfig } from "@/services/rag/config/rag-config";
import { assertEmbeddingVector, normalizeEmbeddingVector } from "@/services/rag/embeddings/embedding-provider";

async function embed(text, taskType) {
  const config = getRagConfig();
  const response = await getGeminiClient().models.embedContent({
    model: config.GEMINI_EMBEDDING_MODEL,
    contents: text,
    config: { taskType, outputDimensionality: config.RAG_EMBEDDING_DIMENSIONS },
  });
  const vector = assertEmbeddingVector(response.embeddings?.[0]?.values, config.RAG_EMBEDDING_DIMENSIONS);
  // gemini-embedding-001 does not normalize reduced-dimension vectors. Keep
  // document and query vectors on the same unit-length scale for cosine search.
  return normalizeEmbeddingVector(vector);
}

export function embedDocument(text) {
  return embed(text, "RETRIEVAL_DOCUMENT");
}

// Convert the query into the same vector space used when indexing document
// chunks so Qdrant can return semantically related passages.
export function embedQuery(text) {
  return embed(text, "RETRIEVAL_QUERY");
}
