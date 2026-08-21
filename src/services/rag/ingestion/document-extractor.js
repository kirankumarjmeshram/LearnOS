import "server-only";

import { readFile } from "fs/promises";
import { extname } from "path";
import mammoth from "mammoth";
// The package root is a CLI-style wrapper that reads a sample fixture when
// bundled by Next.js. Importing the parser implementation avoids that side effect.
import pdf from "pdf-parse/lib/pdf-parse.js";

import { RagError } from "../rag-types";

const supportedExtensions = new Set([".pdf", ".docx", ".txt", ".md", ".markdown"]);

export function isSupportedDocumentPath(filePath) {
  return supportedExtensions.has(extname(filePath || "").toLowerCase());
}

export async function extractDocumentText(filePath) {
  const extension = extname(filePath || "").toLowerCase();
  if (!supportedExtensions.has(extension)) {
    throw new RagError("Only PDF, DOCX, TXT, and Markdown files can be processed for AI.", { code: "UNSUPPORTED_DOCUMENT", status: 400 });
  }

  let buffer;
  try {
    buffer = await readFile(filePath);
  } catch (error) {
    throw new RagError("The uploaded document could not be found.", { code: "DOCUMENT_NOT_FOUND", status: 404, cause: error });
  }

  try {
    if (extension === ".pdf") return (await pdf(buffer)).text;
    if (extension === ".docx") return (await mammoth.extractRawText({ buffer })).value;
    return buffer.toString("utf8");
  } catch (error) {
    throw new RagError("We could not extract readable text from this document.", { code: "EXTRACTION_FAILED", status: 422, cause: error });
  }
}
