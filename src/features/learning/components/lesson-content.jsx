"use client";

import { memo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  ExternalLink,
  FileText,
  Lightbulb,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

// ─── Custom markdown components for better typography ─────────────────────────

const markdownComponents = {
  // Headings
  h1: ({ children }) => (
    <h2 className="mb-3 mt-6 text-xl font-bold leading-snug first:mt-0">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="mb-2 mt-5 text-base font-bold leading-snug first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mb-2 mt-4 text-sm font-bold leading-snug first:mt-0">{children}</h4>
  ),
  // Paragraphs
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-7 text-[var(--muted-foreground)] last:mb-0">{children}</p>
  ),
  // Lists
  ul: ({ children }) => (
    <ul className="mb-3 space-y-1.5 text-sm text-[var(--muted-foreground)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-sm text-[var(--muted-foreground)]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2 leading-6">
      <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--primary)]" />
      <span>{children}</span>
    </li>
  ),
  // Code
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded bg-[var(--muted)] px-1 py-0.5 font-mono text-xs text-[var(--foreground)]">
        {children}
      </code>
    ) : (
      <code className="block">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-xl border bg-zinc-950 p-4 font-mono text-xs leading-5 text-zinc-100 dark:bg-zinc-900">
      {children}
    </pre>
  ),
  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-[var(--primary)] pl-4 text-sm italic text-[var(--muted-foreground)]">
      {children}
    </blockquote>
  ),
  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
    >
      {children}
    </a>
  ),
  // Tables
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border">
      <table className="min-w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[var(--muted)]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t px-3 py-2 text-[var(--muted-foreground)]">{children}</td>
  ),
};

// ─── Collapsible section wrapper ──────────────────────────────────────────────

const CollapsibleSection = memo(function CollapsibleSection({
  title,
  icon: Icon,
  iconClass,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border bg-[var(--card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-[var(--muted)]/30"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn("size-4", iconClass)} />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[var(--muted-foreground)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="border-t px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
});

// ─── Main LessonContent component ────────────────────────────────────────────

export const LessonContent = memo(function LessonContent({ content }) {
  if (!content) return null;

  return (
    <div className="space-y-4">
      
      {/* Overview — always visible, documentation-style intro */}
      {content.overview && (
        <div>
          <h2 className="mb-3 text-lg font-bold">Lesson Overview</h2>
          <div className="text-sm leading-7 text-[var(--muted-foreground)]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content.overview}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Key Concepts — open by default */}
      {content.keyConcepts?.length > 0 && (
        <CollapsibleSection
          title="Key Concepts"
          icon={BookOpen}
          iconClass="text-[var(--primary)]"
          defaultOpen
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {content.keyConcepts.map((concept, i) => (
              <div
                key={i}
                className="rounded-lg border bg-[var(--secondary)]/30 p-3.5"
              >
                <p className="text-xs font-bold text-[var(--primary)]">
                  {concept.term}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                  {concept.definition}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Code Examples — open by default */}
      {content.codeExamples?.length > 0 && (
        <CollapsibleSection
          title="Code Examples"
          icon={Code2}
          iconClass="text-[var(--primary)]"
          defaultOpen
        >
          <div className="space-y-5">
            {content.codeExamples.map((ex, i) => (
              <div key={i}>
                <p className="mb-2 text-xs font-semibold">{ex.title}</p>
                <pre className="overflow-x-auto rounded-xl border bg-zinc-950 p-4 font-mono text-xs leading-5 text-zinc-100 dark:bg-zinc-900">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Best Practices — collapsed by default to keep page scannable */}
      {content.bestPractices?.length > 0 && (
        <CollapsibleSection
          title="Best Practices"
          icon={Lightbulb}
          iconClass="text-emerald-600"
        >
          <ul className="space-y-2">
            {content.bestPractices.map((practice, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs leading-5 text-[var(--muted-foreground)]"
              >
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                {practice}
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {/* Common Mistakes — collapsed by default */}
      {content.commonMistakes?.length > 0 && (
        <CollapsibleSection
          title="Common Mistakes"
          icon={AlertTriangle}
          iconClass="text-amber-500"
        >
          <ul className="space-y-2">
            {content.commonMistakes.map((mistake, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs leading-5 text-[var(--muted-foreground)]"
              >
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                {mistake}
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {/* Official Documentation — open by default, useful reference links */}
      {content.officialDocs?.length > 0 && (
        <CollapsibleSection
          title="Official Documentation"
          icon={FileText}
          iconClass="text-[var(--primary)]"
          defaultOpen
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {content.officialDocs.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-colors hover:border-[var(--primary)] hover:bg-[var(--secondary)]/20"
              >
                <FileText className="size-3.5 shrink-0 text-[var(--primary)]" />
                <span className="flex-1 truncate font-medium group-hover:text-[var(--primary)]">
                  {doc.title}
                </span>
                <ExternalLink className="size-3 shrink-0 text-[var(--muted-foreground)]" />
              </a>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Summary — always visible, acts as a takeaway callout */}
      {content.summary && (
        <div className="rounded-xl border-l-4 border-[var(--primary)] bg-[var(--secondary)]/30 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Summary
          </p>
          <div className="text-sm leading-7 text-[var(--muted-foreground)]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content.summary}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
});
