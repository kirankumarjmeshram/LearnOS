import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("pdf-parse/lib/pdf-parse.js", () => ({ default: vi.fn() }));
vi.mock("mammoth", () => ({ default: { extractRawText: vi.fn() } }));

import { buildLessonReference, buildRagContext, toSources } from "./generation/context-builder";
import { extractDocumentText, isSupportedDocumentPath } from "./ingestion/document-extractor";
import { chunkText } from "./ingestion/text-chunker";
import { normalizeText } from "./ingestion/text-normalizer";
import { buildMetadataFilter } from "./retrieval/metadata-filter";
import { toVectorPayload } from "./vector-store/vector-types";
import { normalizeEmbeddingVector } from "./embeddings/embedding-provider";

describe("RAG ingestion utilities", () => {
  it("selects only supported document formats", () => {
    expect(isSupportedDocumentPath("/uploads/guide.pdf")).toBe(true);
    expect(isSupportedDocumentPath("/uploads/guide.docx")).toBe(true);
    expect(isSupportedDocumentPath("/uploads/guide.md")).toBe(true);
    expect(isSupportedDocumentPath("/uploads/slides.pptx")).toBe(false);
  });

  it("rejects unsupported files before attempting extraction", async () => {
    await expect(extractDocumentText("/uploads/slides.pptx")).rejects.toMatchObject({ code: "UNSUPPORTED_DOCUMENT", status: 400 });
  });

  it("normalizes excessive whitespace without collapsing paragraphs", () => {
    expect(normalizeText("  First   paragraph. \r\n\r\n\r\n\tSecond paragraph.  ")).toBe("First paragraph.\n\nSecond paragraph.");
  });

  it("creates bounded chunks with an overlap", () => {
    const text = [
      "The first paragraph explains the foundations of retrieval augmented generation in enough detail to occupy useful space.",
      "The second paragraph explains how the same content is represented as embeddings for semantic lookup.",
      "The third paragraph explains why metadata protects each learner's private documents.",
    ].join("\n\n");
    const chunks = chunkText(text, { chunkSize: 150, chunkOverlap: 30 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 180)).toBe(true);
    expect(chunks[1]).toContain(chunks[0].slice(-20).trim());
  });
});

describe("RAG metadata and context", () => {
  it("always creates a user filter and adds optional scopes", () => {
    expect(buildMetadataFilter({ userId: "user-a", resourceId: "resource-1", lessonId: "lesson-1" })).toEqual({
      must: [
        { key: "userId", match: { value: "user-a" } },
        { key: "resourceId", match: { value: "resource-1" } },
        { key: "lessonId", match: { value: "lesson-1" } },
      ],
    });
  });

  it("builds a compact source-labelled context and deduplicated sources", () => {
    const chunks = [
      { resourceId: "resource-1", lessonId: "lesson-1", chunkIndex: 0, title: "RAG guide", sourceType: "pdf", text: "Relevant text." },
      { resourceId: "resource-1", lessonId: "lesson-1", chunkIndex: 0, title: "RAG guide", sourceType: "pdf", text: "Duplicate." },
    ];
    expect(buildRagContext(chunks)).toContain("[Source 1]");
    expect(toSources(chunks)).toEqual([{ resourceId: "resource-1", lessonId: "lesson-1", chunkIndex: 0, title: "RAG guide", sourceType: "pdf" }]);
  });

  it("creates a bounded lesson fallback without serializing the entire lesson object", () => {
    const reference = buildLessonReference({
      overview: "This lesson explains retrieval.",
      objectives: ["Understand vectors"],
      keyConcepts: [{ term: "Embedding", definition: "A numeric representation." }],
      keyTakeaways: ["Use relevant context."],
      ignoredLargeField: "x".repeat(8000),
    });
    expect(reference).toContain("Overview:");
    expect(reference).toContain("Embedding: A numeric representation.");
    expect(reference).not.toContain("ignoredLargeField");
    expect(reference.length).toBeLessThanOrEqual(6000);
  });

  it("keeps private ownership metadata with every indexed chunk", () => {
    expect(toVectorPayload({
      userId: "user-a",
      resource: { _id: "resource-1", lessonId: "lesson-1", title: "Notes", type: "text" },
      chunk: "A private chunk.",
      chunkIndex: 2,
    })).toMatchObject({ userId: "user-a", resourceId: "resource-1", lessonId: "lesson-1", chunkIndex: 2 });
  });

  it("normalizes reduced-dimension embedding vectors", () => {
    expect(normalizeEmbeddingVector([3, 4])).toEqual([0.6, 0.8]);
  });
});
