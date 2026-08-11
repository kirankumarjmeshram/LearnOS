export class RagError extends Error {
  constructor(message, { code = "RAG_ERROR", status = 500, cause } = {}) {
    super(message, { cause });
    this.name = "RagError";
    this.code = code;
    this.status = status;
  }
}

export function toSafeRagError(error) {
  if (error instanceof RagError) return error;
  console.error("[RAG]", error);
  return new RagError("We could not process this document right now.", { code: "RAG_PROCESSING_FAILED" });
}
