"use client";

import { Check, LoaderCircle, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function LessonNotes({ lessonId, initialContent }) {
  const [content, setContent] = useState(initialContent ?? "");
  const [status, setStatus] = useState("saved"); // "saved" | "pending" | "saving" | "error"
  const timerRef = useRef(null);

  const save = async (nextContent) => {
    setStatus("saving");
    try {
      const response = await fetch(`/api/lessons/${lessonId}/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setStatus("saved");
    } catch (error) {
      setStatus("error");
      toast.error(error.message ?? "We could not save your note.");
    }
  };

  const onChange = (event) => {
    const nextContent = event.target.value;
    setContent(nextContent);
    setStatus("pending");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => save(nextContent), 750);
  };

  const statusIcon =
    status === "saving" ? (
      <LoaderCircle className="size-3.5 animate-spin" />
    ) : status === "saved" ? (
      <Check className="size-3.5 text-emerald-600" />
    ) : (
      <Save className="size-3.5" />
    );

  const statusText =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved"
        : status === "error"
          ? "Error — edit to retry"
          : "Unsaved";

  return (
    <section className="rounded-2xl border bg-[var(--card)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Notes</h3>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            Supports Markdown, code blocks, and task lists.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
          {statusIcon}
          {statusText}
        </span>
      </div>

      <textarea
        value={content}
        onChange={onChange}
        placeholder={`# My Notes\n\n- [ ] Key idea\n\n\`\`\`js\nconst example = true;\n\`\`\``}
        className="mt-4 min-h-48 w-full rounded-xl border bg-transparent p-4 font-mono text-sm leading-6 outline-none transition-shadow focus:ring-2 focus:ring-[var(--ring)]"
        aria-label="Lesson notes editor"
      />

      {/* Live preview */}
      <div className="mt-4 rounded-xl border bg-[var(--background)] p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          Preview
        </p>
        {content ? (
          <article className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-xs text-[var(--muted-foreground)]">
            Start typing to preview your notes here.
          </p>
        )}
      </div>
    </section>
  );
}
