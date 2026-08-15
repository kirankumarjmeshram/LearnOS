/**
 * Returns Mermaid source without the formatting that language models commonly
 * add around a diagram. The result is intentionally not repaired beyond its
 * wrapper: Mermaid remains the source of truth for syntax validation.
 */
export function normalizeMermaidCode(value) {
  if (typeof value !== "string") return "";

  let code = value.replace(/^\uFEFF/, "").trim();
  const mermaidFence = code.match(/```mermaid[ \t]*\r?\n([\s\S]*?)```/i);

  if (mermaidFence) {
    code = mermaidFence[1];
  } else {
    const unlabelledFence = code.match(/^```[ \t]*\r?\n([\s\S]*?)\r?\n?```$/);
    if (unlabelledFence) code = unlabelledFence[1];
  }

  return code.replace(/^mermaid[ \t]*\r?\n/i, "").trim();
}
