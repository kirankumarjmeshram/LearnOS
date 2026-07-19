"use client";

import React, { memo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import remarkGfm from "remark-gfm";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  ExternalLink,
  FileText,
  Lightbulb,
  Info,
  Briefcase,
  FlaskConical,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Lazy Loaded Heavy Dependencies ─────────────────────────────────────────
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="h-20 w-full animate-pulse rounded-xl bg-[var(--muted)]/50" />
});

const MermaidRenderer = dynamic(() => import("./mermaid-renderer"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse rounded-xl bg-[var(--muted)]/50" />
});

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter").then(mod => mod.Prism), {
  ssr: false,
  loading: () => null // Handled manually by CodeBlock wrapper
});

// ─── Error Boundary ─────────────────────────────────────────────────────────
class BlockErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-500">
          We encountered an issue rendering this specific block. The rest of the lesson is unaffected.
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Markdown Configuration ──────────────────────────────────────────────────
// Premium typography for long-form reading
const markdownComponents = {
  h1: ({ children }) => <h2 className="mb-6 mt-10 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{children}</h2>,
  h2: ({ children }) => <h3 className="mb-4 mt-8 text-2xl font-bold tracking-tight text-[var(--foreground)]">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-3 mt-6 text-xl font-bold text-[var(--foreground)]">{children}</h4>,
  p: ({ children }) => <p className="mb-6 text-base leading-8 text-[var(--muted-foreground)]">{children}</p>,
  ul: ({ children }) => <ul className="mb-6 space-y-2 text-base text-[var(--muted-foreground)]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6 text-base text-[var(--muted-foreground)]">{children}</ol>,
  li: ({ children }) => (
    <li className="flex items-start gap-3 leading-8">
      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded-md bg-[var(--muted)] px-1.5 py-0.5 font-mono text-sm font-semibold text-[var(--foreground)]">{children}</code>
    ) : (
      <code className="block">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="my-8 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 font-mono text-sm leading-6 text-zinc-100">{children}</pre>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[var(--primary)] hover:underline underline-offset-4">{children}</a>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <table className="min-w-full text-sm divide-y divide-[var(--border)]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[var(--muted)]/50">{children}</thead>,
  th: ({ children }) => <th className="px-5 py-4 text-left font-bold text-[var(--foreground)] uppercase tracking-wider text-xs">{children}</th>,
  tbody: ({ children }) => <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">{children}</tbody>,
  td: ({ children }) => <td className="px-5 py-4 text-[var(--muted-foreground)] leading-relaxed">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-[var(--primary)] bg-[var(--primary)]/5 px-6 py-4 italic text-[var(--muted-foreground)] rounded-r-xl">
      {children}
    </blockquote>
  )
};

// ─── Collapsible Section ─────────────────────────────────────────────────────
const CollapsibleSection = memo(function CollapsibleSection({ title, icon: Icon, iconClass, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left hover:bg-[var(--muted)]/50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className={cn("size-5", iconClass)} />}
          <span className="text-lg font-bold">{title}</span>
        </div>
        <ChevronDown className={cn("size-5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-[var(--border)] px-6 pb-6 pt-5 animate-in slide-in-from-top-2 fade-in duration-200">{children}</div>}
    </div>
  );
});

// ─── Interactive Knowledge Check ─────────────────────────────────────────────
function KnowledgeCheck({ qc, index }) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
      <h4 className="text-base font-bold text-[var(--foreground)] mb-5 flex gap-2">
        <span className="text-[var(--primary)]">Q{index + 1}.</span> {qc.question}
      </h4>
      <div className="space-y-3 mb-6">
        {qc.options.map((opt, i) => {
          const isCorrect = revealed && opt === qc.answer;
          const isWrong = revealed && selected === opt && opt !== qc.answer;
          return (
            <button
              key={i}
              onClick={() => { if (!revealed) setSelected(opt); }}
              disabled={revealed}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all",
                !revealed && selected === opt ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]" : "border-[var(--border)] hover:bg-[var(--muted)]/50 text-[var(--muted-foreground)]",
                isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold",
                isWrong && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          disabled={!selected}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-[var(--primary-foreground)] disabled:opacity-50 transition-opacity hover:opacity-90"
        >
          Reveal Answer
        </button>
      ) : (
        <div className="rounded-xl bg-[var(--muted)]/50 p-5 text-sm mt-4 animate-in fade-in duration-300 border border-[var(--border)]">
          <p className="font-bold mb-2 flex items-center gap-2">
            <Info className="size-4 text-[var(--primary)]" />
            Explanation
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">{qc.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Code Block (Lazy Highlighter) ───────────────────────────────────────────
function CodeBlock({ code, language, title }) {
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3">
      {title && <h4 className="font-bold text-sm text-[var(--foreground)]">{title}</h4>}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="absolute right-4 top-3 rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 z-10">
          {language || "Code"}
        </div>
        
        {/* Render plain pre initially, then swap to highlighter when mounted on client */}
        <div className="p-6 pt-12 text-sm leading-6">
          {!mounted ? (
            <pre className="font-mono text-zinc-100 overflow-x-auto">
              <code>{code}</code>
            </pre>
          ) : (
            <React.Suspense fallback={
              <pre className="font-mono text-zinc-100 overflow-x-auto"><code>{code}</code></pre>
            }>
              <SyntaxHighlighter
                language={language?.toLowerCase() || "javascript"}
                useInlineStyles={false}
                PreTag="div"
                CodeTag="code"
                className="!bg-transparent !p-0 !m-0 overflow-x-auto font-mono text-zinc-100 syntax-theme"
              >
                {code}
              </SyntaxHighlighter>
            </React.Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Lesson Component ───────────────────────────────────────────────────
export const LessonContent = memo(function LessonContent({ content }) {
  if (!content) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="mx-auto max-w-3xl space-y-12 pb-20"
    >
      
      {content.overview && (
        <motion.div variants={itemVariants}>
          <BlockErrorBoundary>
            <div className="prose prose-base dark:prose-invert max-w-none">
              <h2 className="text-3xl font-extrabold tracking-tight mb-6">Lesson Overview</h2>
              <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                {content.overview}
              </ReactMarkdown>
            </div>
          </BlockErrorBoundary>
        </motion.div>
      )}

      {/* Visual Callouts */}
      {content.visualCallouts?.map((callout, i) => {
        const styles = {
          info: "border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300",
          warning: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
          tip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
        };
        const icons = { info: Info, warning: AlertTriangle, tip: Lightbulb };
        const Icon = icons[callout.type] || Info;
        return (
          <div key={i} className={cn("flex gap-4 rounded-2xl border p-6 shadow-sm", styles[callout.type])}>
            <Icon className="size-6 shrink-0 mt-0.5" />
            <p className="text-base font-medium leading-relaxed">{callout.content}</p>
          </div>
        );
      })}

      {content.realWorldExample && (
        <motion.div variants={itemVariants}>
          <BlockErrorBoundary>
            <div className="rounded-2xl border-l-4 border-l-[var(--primary)] border-y border-r border-y-[var(--border)] border-r-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-[var(--primary)]">
                <Briefcase className="size-6" />
                <h3 className="text-xl font-bold">{content.realWorldExample.title}</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Scenario</h4>
                  <p className="text-base leading-relaxed text-[var(--foreground)]">{content.realWorldExample.scenario}</p>
                </div>
                <div className="rounded-xl bg-[var(--muted)]/50 p-6 border border-[var(--border)]">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-2">In The Industry</h4>
                  <p className="text-base leading-relaxed text-[var(--muted-foreground)]">{content.realWorldExample.example}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Why It Matters</h4>
                  <p className="text-base leading-relaxed text-[var(--foreground)]">{content.realWorldExample.importance}</p>
                </div>
              </div>
            </div>
          </BlockErrorBoundary>
        </motion.div>
      )}

      {content.mermaidDiagrams?.map((diagram, i) => (
        <motion.div key={i} variants={itemVariants}>
          <BlockErrorBoundary>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">{diagram.title}</h3>
              <MermaidRenderer code={diagram.code} />
            </div>
          </BlockErrorBoundary>
        </motion.div>
      ))}

      {/* Comparison Tables */}
      {content.comparisonTables?.map((table, i) => (
        <motion.div key={i} variants={itemVariants}>
          <BlockErrorBoundary>
            <div className="space-y-6">
              <h3 className="text-xl font-bold">{table.title}</h3>
              <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                {table.markdown}
              </ReactMarkdown>
            </div>
          </BlockErrorBoundary>
        </motion.div>
      ))}

      {content.keyConcepts?.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Key Concepts" icon={BookOpen} iconClass="text-[var(--primary)]" defaultOpen>
            <div className="grid gap-5 sm:grid-cols-2">
              {content.keyConcepts.map((concept, i) => (
                <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-base font-extrabold text-[var(--primary)] mb-3">{concept.term}</p>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{concept.definition}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Code Examples */}
      {content.codeExamples?.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title={`Code Examples (${content.codeExamples.length})`} icon={Code2} iconClass="text-indigo-500" defaultOpen={false}>
            <div className="space-y-8">
              {content.codeExamples.map((ex, i) => (
                <BlockErrorBoundary key={i}>
                  <CodeBlock code={ex.code} language={ex.language} title={ex.title} />
                </BlockErrorBoundary>
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
      )}

      {content.handsOnLabs?.map((lab, i) => (
        <motion.div key={i} variants={itemVariants}>
          <CollapsibleSection title={`Lab: ${lab.title}`} icon={FlaskConical} iconClass="text-purple-500">
            <ol className="list-decimal space-y-5 pl-6">
              {lab.steps.map((step, idx) => (
                <li key={idx} className="text-base leading-relaxed text-[var(--foreground)] marker:text-[var(--primary)] marker:font-bold">
                  {step}
                </li>
              ))}
            </ol>
          </CollapsibleSection>
        </motion.div>
      ))}

      {/* Knowledge Checks */}
      {content.knowledgeChecks?.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Knowledge Checks" icon={CheckCircle2} iconClass="text-emerald-500" defaultOpen={true}>
            <div className="space-y-8">
              {content.knowledgeChecks.map((qc, i) => (
                <KnowledgeCheck key={i} qc={qc} index={i} />
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Interview Questions */}
      {content.interviewQuestions?.length > 0 && (
        <CollapsibleSection title="Interview Questions" icon={MessageSquare} iconClass="text-blue-500">
          <div className="space-y-5">
            {content.interviewQuestions.map((q, i) => (
              <CollapsibleSection key={i} title={q.question} icon={HelpCircle} iconClass="text-[var(--muted-foreground)]" defaultOpen={false}>
                <div className="rounded-xl bg-[var(--muted)]/50 p-6 text-base leading-relaxed text-[var(--foreground)] border border-[var(--border)]">
                  {q.answer}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Best Practices */}
      {content.bestPractices?.length > 0 && (
        <CollapsibleSection title="Best Practices" icon={Lightbulb} iconClass="text-amber-500">
          <ul className="space-y-4">
            {content.bestPractices.map((practice, i) => (
              <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-[var(--muted-foreground)]">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-500" />
                {practice}
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {/* Official Documentation */}
      {content.officialDocs?.length > 0 && (
        <CollapsibleSection title="Official Documentation" icon={FileText} iconClass="text-[var(--primary)]" defaultOpen>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.officialDocs.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition-all hover:border-[var(--primary)] hover:bg-[var(--secondary)] hover:shadow-sm active:scale-95">
                <FileText className="size-5 shrink-0 text-[var(--primary)]" />
                <span className="flex-1 truncate font-bold group-hover:text-[var(--primary)] transition-colors text-sm">{doc.title}</span>
                <ExternalLink className="size-4 shrink-0 text-[var(--muted-foreground)] opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {content.keyTakeaways?.length > 0 && (
        <motion.div variants={itemVariants}>
          <BlockErrorBoundary>
            <div className="rounded-2xl border-l-4 border-[var(--primary)] bg-[var(--primary)]/5 p-8 shadow-sm">
              <h3 className="mb-5 text-sm font-extrabold uppercase tracking-widest text-[var(--primary)]">Key Takeaways</h3>
              <ul className="space-y-4">
                {content.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-[var(--foreground)] font-medium">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--primary)]" />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </BlockErrorBoundary>
        </motion.div>
      )}

    </motion.div>
  );
});
