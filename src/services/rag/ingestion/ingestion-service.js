import "server-only";

import { getRagConfig } from "@/services/rag/config/rag-config";
import { embedDocument } from "@/services/rag/embeddings/gemini-embedding-service";
import { extractDocumentText } from "@/services/rag/ingestion/document-extractor";
import { chunkText } from "@/services/rag/ingestion/text-chunker";
import { normalizeText } from "@/services/rag/ingestion/text-normalizer";
import { RagError } from "@/services/rag/rag-types";
import { toVectorPayload } from "@/services/rag/vector-store/vector-types";
import { deleteResourceVectors, upsertResourceChunks } from "@/services/rag/vector-store/qdrant-repository";

export async function ingestResourceDocument({ userId, resource, filePath }) {
  const extractionStartedAt = performance.now();
  const extractedText = await extractDocumentText(filePath);
  const normalizedText = normalizeText(extractedText);
  if (!normalizedText) {
    throw new RagError("This document does not contain readable text.", { code: "EMPTY_DOCUMENT", status: 422 });
  }

  const { RAG_CHUNK_SIZE, RAG_CHUNK_OVERLAP } = getRagConfig();
  const chunks = chunkText(normalizedText, { chunkSize: RAG_CHUNK_SIZE, chunkOverlap: RAG_CHUNK_OVERLAP });
  if (!chunks.length) {
    throw new RagError("This document did not produce usable learning chunks.", { code: "EMPTY_CHUNKS", status: 422 });
  }

  const embeddingStartedAt = performance.now();
  const vectors = [];
  for (const chunk of chunks) vectors.push(await embedDocument(chunk));

  // Reprocessing first removes all old vectors. A document is therefore
  // represented by exactly one current set of chunks in the vector store.
  const qdrantStartedAt = performance.now();
  await deleteResourceVectors(userId, resource._id);
  await upsertResourceChunks(chunks.map((chunk, chunkIndex) => ({
    vector: vectors[chunkIndex],
    payload: toVectorPayload({ userId, resource, chunk, chunkIndex }),
  })));

  return {
    chunkCount: chunks.length,
    timings: {
      extractionMs: Math.round(embeddingStartedAt - extractionStartedAt),
      embeddingMs: Math.round(qdrantStartedAt - embeddingStartedAt),
      qdrantMs: Math.round(performance.now() - qdrantStartedAt),
    },
  };
}
