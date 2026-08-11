import "server-only";

import { z } from "zod";

const schema = z.object({
  QDRANT_URL: z.string().url().default("http://localhost:6333"),
  QDRANT_API_KEY: z.string().optional().default(""),
  QDRANT_COLLECTION: z.string().min(1).default("learnos_document_chunks"),
  GEMINI_EMBEDDING_MODEL: z.string().min(1).default("gemini-embedding-001"),
  RAG_EMBEDDING_DIMENSIONS: z.coerce.number().int().positive().default(768),
  RAG_TOP_K: z.coerce.number().int().min(1).max(20).default(5),
  RAG_CHUNK_SIZE: z.coerce.number().int().min(300).max(4000).default(1200),
  RAG_CHUNK_OVERLAP: z.coerce.number().int().min(0).max(1000).default(200),
});

export function getRagConfig() {
  const config = schema.safeParse(process.env);
  if (!config.success) {
    throw new Error(`Invalid RAG configuration: ${config.error.issues.map((issue) => issue.message).join(", ")}`);
  }
  if (config.data.RAG_CHUNK_OVERLAP >= config.data.RAG_CHUNK_SIZE) {
    throw new Error("RAG_CHUNK_OVERLAP must be smaller than RAG_CHUNK_SIZE.");
  }
  return config.data;
}
