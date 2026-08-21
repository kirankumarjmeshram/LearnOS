function splitLongText(text, size) {
  if (text.length <= size) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const pieces = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = `${current}${current ? " " : ""}${sentence.trim()}`;
    if (candidate.length <= size) {
      current = candidate;
    } else {
      if (current) pieces.push(current);
      if (sentence.length <= size) current = sentence.trim();
      else {
        for (let start = 0; start < sentence.length; start += size) {
          pieces.push(sentence.slice(start, start + size).trim());
        }
        current = "";
      }
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

// Fixed-size chunks are predictable, while paragraph and sentence boundaries
// keep the excerpts readable when they are shown to Gemini and the learner.
export function chunkText(text, { chunkSize, chunkOverlap }) {
  if (!text) return [];
  const units = text.split(/\n{2,}/).flatMap((paragraph) => splitLongText(paragraph.trim(), chunkSize));
  const chunks = [];
  let current = "";

  for (const unit of units) {
    const candidate = `${current}${current ? "\n\n" : ""}${unit}`;
    if (candidate.length <= chunkSize) {
      current = candidate;
      continue;
    }
    if (current) {
      chunks.push(current);
      const overlap = current.slice(Math.max(0, current.length - chunkOverlap)).trim();
      current = `${overlap}${overlap ? "\n\n" : ""}${unit}`;
    } else {
      chunks.push(unit);
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((chunk) => chunk.length >= 40);
}
