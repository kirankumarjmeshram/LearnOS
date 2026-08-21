import "server-only";

import { QdrantClient } from "@qdrant/js-client-rest";
import { getRagConfig } from "@/services/rag/config/rag-config";

let client;

function shouldSendApiKey(url) {
  try {
    const parsed = new URL(url);
    const isLocalHttp = parsed.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
    return !isLocalHttp;
  } catch {
    return true;
  }
}

export function getQdrantClient() {
  if (!client) {
    const config = getRagConfig();
    // A cloud API key is not needed by the local development container and
    // should not be sent over an unsecured localhost HTTP connection.
    const apiKey = shouldSendApiKey(config.QDRANT_URL) ? config.QDRANT_API_KEY || undefined : undefined;
    client = new QdrantClient({ url: config.QDRANT_URL, apiKey });
  }
  return client;
}
