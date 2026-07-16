"use client";

import { Check, LoaderCircle, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function LessonNotes({ lessonId, initialContent }) {
  const [content, setContent] = useState(initialContent || "");
  const [status, setStatus] = useState("saved");
  const timerRef = useRef(null);
  const save = async (nextContent) => { setStatus("saving"); try { const response = await fetch(`/api/lessons/${lessonId}/note`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: nextContent }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setStatus("saved"); } catch (error) { setStatus("error"); toast.error(error.message || "We could not save your note."); } };
  const onChange = (event) => { const nextContent = event.target.value; setContent(nextContent); setStatus("pending"); window.clearTimeout(timerRef.current); timerRef.current = window.setTimeout(() => save(nextContent), 750); };
  return <section className="rounded-2xl border bg-[var(--card)] p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Notes</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Markdown, code blocks, checklists, and image URLs are supported.</p></div><span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">{status === "saving" ? <LoaderCircle className="size-3.5 animate-spin" /> : status === "saved" ? <Check className="size-3.5 text-emerald-600" /> : <Save className="size-3.5" />}{status === "saving" ? "Saving" : status === "saved" ? "Saved" : status === "error" ? "Retry by editing" : "Unsaved"}</span></div><textarea value={content} onChange={onChange} placeholder="# Notes\n\n- [ ] Key idea\n\n```js\nconst example = true;\n```" className="mt-5 min-h-52 w-full rounded-xl border bg-transparent p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /><div className="mt-5 rounded-xl border bg-[var(--background)] p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Preview</p>{content ? <article className="prose max-w-none dark:prose-invert"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></article> : <p className="text-sm text-[var(--muted-foreground)]">No notes yet. Start writing to save a note for this lesson.</p>}</div></section>;
}
