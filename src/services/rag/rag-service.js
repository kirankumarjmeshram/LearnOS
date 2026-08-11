import "server-only";

import { existsSync } from "fs";
import { resolve, sep } from "path";

import { connectToDatabase } from "@/lib/mongodb";
import { GlobalResource } from "@/models/global-resource";
import { Lesson } from "@/models/lesson";
import { Roadmap } from "@/models/roadmap";
import { generateGroundedAnswer } from "@/services/rag/generation/rag-generation-service";
import { isSupportedDocumentPath } from "@/services/rag/ingestion/document-extractor";
import { ingestResourceDocument } from "@/services/rag/ingestion/ingestion-service";
import { retrieveRelevantChunks } from "@/services/rag/retrieval/retriever";
import { RagError, toSafeRagError } from "@/services/rag/rag-types";
import { deleteResourceVectors } from "@/services/rag/vector-store/qdrant-repository";

function resolveUploadPath(filePath) {
  if (!filePath?.startsWith("/uploads/")) {
    throw new RagError("Only files uploaded to LearnOS can be processed for AI.", { code: "INVALID_DOCUMENT_LOCATION", status: 400 });
  }
  const uploadRoot = resolve(process.cwd(), "public", "uploads");
  const resolvedPath = resolve(process.cwd(), "public", filePath.slice(1));
  if (!resolvedPath.startsWith(`${uploadRoot}${sep}`)) {
    throw new RagError("The uploaded document location is invalid.", { code: "INVALID_DOCUMENT_LOCATION", status: 400 });
  }
  return resolvedPath;
}

export async function getOwnedResource(userId, resourceId) {
  await connectToDatabase();
  const resource = await GlobalResource.findOne({ _id: resourceId, clerkId: userId });
  if (!resource) throw new RagError("Resource not found or access denied.", { code: "RESOURCE_NOT_FOUND", status: 404 });
  return resource;
}

export async function assertOwnedLesson(userId, lessonId) {
  await connectToDatabase();
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new RagError("Lesson not found.", { code: "LESSON_NOT_FOUND", status: 404 });
  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId: userId }).lean();
  if (!roadmap) throw new RagError("Lesson not found or access denied.", { code: "LESSON_NOT_FOUND", status: 404 });
  return { lesson, roadmap };
}

export async function ingestOwnedResource(userId, resourceId) {
  const resource = await getOwnedResource(userId, resourceId);
  const filePath = resolveUploadPath(resource.filePath);
  if (!isSupportedDocumentPath(filePath)) {
    throw new RagError("Only PDF, DOCX, TXT, and Markdown files are supported for AI processing.", { code: "UNSUPPORTED_DOCUMENT", status: 400 });
  }
  if (!existsSync(filePath)) {
    throw new RagError("The uploaded document could not be found.", { code: "DOCUMENT_NOT_FOUND", status: 404 });
  }

  resource.processedStatus = "processing";
  resource.processingError = "";
  resource.processingStartedAt = new Date();
  await resource.save();

  try {
    const result = await ingestResourceDocument({ userId, resource, filePath });
    resource.processedStatus = "processed";
    resource.processingError = "";
    resource.processedAt = new Date();
    await resource.save();
    return { resource, ...result };
  } catch (error) {
    const safeError = toSafeRagError(error);
    resource.processedStatus = "failed";
    resource.processingError = safeError.message.slice(0, 240);
    await resource.save();
    throw safeError;
  }
}

export async function removeOwnedResourceVectors(userId, resource) {
  if (resource?.processedStatus === "processed") {
    await deleteResourceVectors(userId, resource._id);
  }
}

export async function queryRag({ userId, question, resourceId, lessonId, lessonContext }) {
  if (!question?.trim()) throw new RagError("A question is required.", { code: "INVALID_QUESTION", status: 400 });
  if (resourceId) await getOwnedResource(userId, resourceId);
  if (lessonId) await assertOwnedLesson(userId, lessonId);

  const retrievalStartedAt = performance.now();
  const retrievedChunks = await retrieveRelevantChunks({ question: question.trim(), userId, resourceId, lessonId });
  const generationStartedAt = performance.now();
  const result = await generateGroundedAnswer({ question: question.trim(), chunks: retrievedChunks, lessonContext });
  return {
    ...result,
    timings: {
      retrievalMs: Math.round(generationStartedAt - retrievalStartedAt),
      generationMs: Math.round(performance.now() - generationStartedAt),
    },
  };
}
