import "server-only";

import { QdrantClient } from "@qdrant/js-client-rest";
import { getRagConfig } from "@/services/rag/config/rag-config";

let client;

export function getQdrantClient() {
  if (!client) {
    const config = getRagConfig();
    client = new QdrantClient({ url: config.QDRANT_URL, apiKey: config.QDRANT_API_KEY || undefined });
  }
  return client;
}
