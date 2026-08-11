import "server-only";

import { randomUUID } from "crypto";
import { getRagConfig } from "@/services/rag/config/rag-config";
import { getQdrantClient } from "@/services/rag/vector-store/qdrant-client";

let initialized = false;

export async function ensureRagCollection() {
  if (initialized) return;
  const client = getQdrantClient();
  const config = getRagConfig();
  try {
    await client.getCollection(config.QDRANT_COLLECTION);
  } catch {
    await client.createCollection(config.QDRANT_COLLECTION, {
      vectors: { size: config.RAG_EMBEDDING_DIMENSIONS, distance: "Cosine" },
    });
    await Promise.all(["userId", "resourceId", "lessonId"].map((field_name) => client.createPayloadIndex(config.QDRANT_COLLECTION, { field_name, field_schema: "keyword" })));
  }
  initialized = true;
}

export async function upsertResourceChunks(points) {
  await ensureRagCollection();
  const { QDRANT_COLLECTION } = getRagConfig();
  await getQdrantClient().upsert(QDRANT_COLLECTION, {
    wait: true,
    points: points.map(({ vector, payload }) => ({ id: randomUUID(), vector, payload })),
  });
}

export async function deleteResourceVectors(userId, resourceId) {
  await ensureRagCollection();
  const { QDRANT_COLLECTION } = getRagConfig();
  await getQdrantClient().delete(QDRANT_COLLECTION, {
    wait: true,
    points: { filter: { must: [{ key: "userId", match: { value: userId } }, { key: "resourceId", match: { value: resourceId.toString() } }] } },
  });
}

export async function searchResourceChunks(vector, filter) {
  await ensureRagCollection();
  const config = getRagConfig();
  return getQdrantClient().search(config.QDRANT_COLLECTION, {
    vector,
    limit: config.RAG_TOP_K,
    filter,
    with_payload: true,
  });
}
