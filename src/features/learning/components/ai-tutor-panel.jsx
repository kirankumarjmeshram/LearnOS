"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkles, Send, LoaderCircle, Lightbulb, FileText, Globe, CheckSquare, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

const markdownComponents = {
  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1.5">{children}</h3>,
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-sm text-[var(--muted-foreground)]">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1.5 text-sm text-[var(--muted-foreground)]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1.5 text-sm text-[var(--muted-foreground)]">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[var(--foreground)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ inline, className, children }) => {
    if (inline) {
      return <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--foreground)]">{children}</code>;
    }
    return (
      <div className="mb-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]/50">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--muted)] px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">Code</span>
        </div>
        <div className="overflow-x-auto p-3">
          <code className="font-mono text-xs leading-relaxed text-[var(--foreground)]">{children}</code>
        </div>
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[var(--muted)] text-[var(--foreground)]">{children}</thead>,
  th: ({ children }) => <th className="border-b border-[var(--border)] px-4 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--muted-foreground)]">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-4 border-[var(--primary)] bg-[var(--muted)]/30 px-4 py-2 text-sm italic text-[var(--muted-foreground)]">
      {children}
    </blockquote>
  ),
};

const QUICK_ACTIONS = [
  { icon: Sparkles, label: "Explain Simply", prompt: "Explain this lesson in beginner-friendly language." },
  { icon: FileText, label: "Summarize Lesson", prompt: "Summarize this lesson into concise revision notes." },
  { icon: Globe, label: "Real-world Example", prompt: "Provide practical real-world examples for this lesson." },
  { icon: CheckSquare, label: "Quiz Me", prompt: "Generate five multiple-choice questions based on this lesson." },
  { icon: Briefcase, label: "Interview Questions", prompt: "Generate interview questions with ideal answers based on this lesson." },
];

export function AiTutorPanel({ lessonId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Reset chat if lesson changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
  }, [lessonId]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/lessons/${lessonId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate response");
      }

      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "I couldn't generate a response.\n\nPlease try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[var(--background)] absolute inset-0 z-20">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--background)]/95 px-2 py-2 backdrop-blur">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Learning Hub
        </button>
      </div>

      <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <Sparkles className="size-4 text-[var(--primary)]" /> Ask AI
        </h2>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Initial Greeting */}
        {messages.length === 0 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
              <p className="text-sm font-semibold">👋 Hi! I&apos;m your LearnOS AI Tutor.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => handleSendMessage(action.prompt)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Icon className="size-3.5" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick actions stay at top if there are messages */}
        {messages.length > 0 && (
          <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 gap-2 border-b border-[var(--border)] mb-4 sticky top-0 bg-[var(--background)]/95 backdrop-blur z-10 pt-1">
             {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleSendMessage(action.prompt)}
                    disabled={isLoading}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-[10px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Icon className="size-3" />
                    {action.label}
                  </button>
                );
              })}
          </div>
        )}

        {/* Message History */}
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col max-w-[90%]", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className={cn(
                "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                msg.role === "user" 
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-none" 
                  : msg.role === "error"
                  ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 rounded-bl-none"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-none"
              )}>
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose-ai">
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-bl-none border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm text-[var(--muted-foreground)]">
              <LoaderCircle className="size-4 animate-spin text-[var(--primary)]" />
              <span className="text-xs font-semibold">✨ AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[var(--border)] bg-[var(--background)] p-3">
        <div className="relative flex items-end rounded-xl border border-[var(--border)] bg-[var(--card)] focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder="Ask anything about this lesson..."
            rows={1}
            className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm outline-none"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="mb-1.5 mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 transition-all"
          >
            <Send className="size-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
