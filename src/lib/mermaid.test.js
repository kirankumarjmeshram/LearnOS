import mermaid from "mermaid";
import { describe, expect, it } from "vitest";

import { normalizeMermaidCode } from "./mermaid";

describe("normalizeMermaidCode", () => {
  it("keeps raw Mermaid source intact", () => {
    const source = "flowchart TD\n  A[Start] --> B[Finish]";

    expect(normalizeMermaidCode(source)).toBe(source);
  });

  it("extracts a Mermaid fence anywhere in model output", () => {
    const source = "Here is the diagram:\n```MERMAID\nflowchart TD\n  A --> B\n```\n";

    expect(normalizeMermaidCode(source)).toBe("flowchart TD\n  A --> B");
  });

  it("removes a byte-order mark and an unlabelled fence", () => {
    const source = "\uFEFF```\nsequenceDiagram\n  Learner->>Tutor: Explain this\n```";

    expect(normalizeMermaidCode(source)).toBe("sequenceDiagram\n  Learner->>Tutor: Explain this");
  });
});

describe("Mermaid syntax validation", () => {
  it("accepts normalized valid diagram source", async () => {
    await expect(
      mermaid.parse(normalizeMermaidCode("```mermaid\nflowchart TD\n  A[Document] --> B[Answer]\n```"), {
        suppressErrors: true,
      }),
    ).resolves.toBeDefined();
  });

  it("returns false for malformed diagram source", async () => {
    await expect(
      mermaid.parse("flowchart TD\n  A -->", { suppressErrors: true }),
    ).resolves.toBe(false);
  });
});
