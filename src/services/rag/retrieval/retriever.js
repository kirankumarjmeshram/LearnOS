import "server-only";

import { embedQuery } from "@/services/rag/embeddings/gemini-embedding-service";
import { buildMetadataFilter } from "@/services/rag/retrieval/metadata-filter";
import { toRetrievalResult } from "@/services/rag/retrieval/retrieval-types";
import { searchResourceChunks } from "@/services/rag/vector-store/qdrant-repository";

export async function retrieveRelevantChunks({ question, userId, resourceId, lessonId }) {
  const vector = await embedQuery(question);
  const results = await searchResourceChunks(vector, buildMetadataFilter({ userId, resourceId, lessonId }));
  return results.map(toRetrievalResult).filter((result) => result.text);
}
