"use client";

import { useState } from "react";
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

function Section({ title, icon: Icon, iconClass, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border bg-[var(--card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("size-5", iconClass)} />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ChevronDown
          className={cn("size-5 shrink-0 text-[var(--muted-foreground)] transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="border-t px-6 pb-6 pt-5">{children}</div>}
    </div>
  );
}

export function LessonContent({ content }) {
  if (!content) return null;

  return (
    <div className="space-y-4">
      {/* Overview — always visible */}
      {content.overview && (
        <section className="rounded-2xl border bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="prose prose-sm mt-4 max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.overview}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Key Concepts */}
      {content.keyConcepts?.length > 0 && (
        <Section
          title="Key Concepts"
          icon={BookOpen}
          iconClass="text-[var(--primary)]"
          defaultOpen
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {content.keyConcepts.map((concept, i) => (
              <div key={i} className="rounded-xl border bg-[var(--secondary)]/40 p-4">
                <p className="font-semibold text-[var(--primary)]">{concept.term}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                  {concept.definition}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Code Examples */}
      {content.codeExamples?.length > 0 && (
        <Section
          title="Code Examples"
          icon={Code2}
          iconClass="text-[var(--primary)]"
          defaultOpen
        >
          <div className="space-y-5">
            {content.codeExamples.map((example, i) => (
              <div key={i}>
                <p className="mb-2 text-sm font-semibold">{example.title}</p>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {`\`\`\`${example.language || ""}\n${example.code}\n\`\`\``}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Best Practices */}
      {content.bestPractices?.length > 0 && (
        <Section title="Best Practices" icon={Lightbulb} iconClass="text-emerald-600">
          <ul className="space-y-2">
            {content.bestPractices.map((practice, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                {practice}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Common Mistakes */}
      {content.commonMistakes?.length > 0 && (
        <Section title="Common Mistakes" icon={AlertTriangle} iconClass="text-amber-500">
          <ul className="space-y-2">
            {content.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                {mistake}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Official Docs */}
      {content.officialDocs?.length > 0 && (
        <Section title="Official Documentation" icon={FileText} iconClass="text-[var(--primary)]" defaultOpen>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.officialDocs.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-xl border p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--secondary)]/30"
              >
                <FileText className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-[var(--primary)]">
                    {doc.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
                    {doc.url}
                  </p>
                </div>
                <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-[var(--muted-foreground)]" />
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Summary — always visible */}
      {content.summary && (
        <section className="rounded-2xl border bg-[var(--secondary)]/40 p-6">
          <h3 className="font-semibold">Summary</h3>
          <div className="prose prose-sm mt-3 max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.summary}</ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
