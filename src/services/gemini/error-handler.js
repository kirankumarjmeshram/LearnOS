import "server-only";

export class GeminiAPIError extends Error {
  constructor(message, isTransient = false, retryDelay = null) {
    super(message);
    this.name = "GeminiAPIError";
    this.isTransient = isTransient;
    this.retryDelay = retryDelay;
  }
}

export function handleGeminiError(error) {
  // If already mapped, return it
  if (error instanceof GeminiAPIError) return error;

  // Ensure raw errors are logged securely on the server only
  console.error("[Gemini API Error]:", error);

  // Gemini SDK typically exposes status on the error or response object
  const status = error?.status || error?.response?.status;

  // Extract Retry-After if provided
  let retryDelay = null;
  if (error?.retryDelay) {
    retryDelay = error.retryDelay;
  } else if (error?.response?.headers?.get) {
    const headerVal = error.response.headers.get("retry-after");
    if (headerVal) retryDelay = parseInt(headerVal, 10);
  }

  const delayMsg = retryDelay ? ` Retry available in ${retryDelay} seconds.` : "";

  // 1. RESOURCE_EXHAUSTED (429) -> NOT TRANSIENT (Abort and show friendly message)
  if (status === 429) {
    return new GeminiAPIError(
      `AI generation is temporarily unavailable because the configured Gemini API key has reached its request quota. Please wait a moment and try again.${delayMsg}`,
      false,
      retryDelay
    );
  }

  // 2. Bad Request (400) -> NOT TRANSIENT
  if (status === 400) {
    return new GeminiAPIError("There was a problem with the AI request. Please try again.", false);
  }

  // 3. Unauthorized / Forbidden (401, 403) -> NOT TRANSIENT
  if (status === 401 || status === 403) {
    return new GeminiAPIError("The AI service is not properly authorized. Please check your API key configuration.", false);
  }

  // 4. Model Not Found (404) -> NOT TRANSIENT
  if (status === 404) {
    return new GeminiAPIError("The requested AI model is currently unavailable.", false);
  }

  // 5. Internal Server Error (500) -> TRANSIENT (Can retry)
  if (status === 500) {
    return new GeminiAPIError("The AI service is temporarily unavailable.", true);
  }

  // 6. Service Unavailable (503) -> TRANSIENT (Can retry)
  if (status === 503) {
    return new GeminiAPIError("The AI service is currently overloaded. Please try again later.", true);
  }

  // 7. Network / Timeout Failures -> TRANSIENT
  if (error?.name === "TypeError" && error?.message === "fetch failed") {
    return new GeminiAPIError("Unable to connect to the AI service. Please check your internet connection.", true);
  }

  if (error?.name === "TimeoutError" || error?.code === "ETIMEDOUT") {
    return new GeminiAPIError("The AI service took too long to respond. Please try again.", true);
  }

  // Default fallback for validation/parsing errors -> TRANSIENT (The model might output valid JSON on retry)
  return new GeminiAPIError("An unexpected error occurred while communicating with the AI service.", true);
}
