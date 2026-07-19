"use client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Maximize, X } from "lucide-react";

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  useMaxWidth: true, // ensure it scales
  suppressErrorRendering: true, // Prevent mermaid from appending error SVGs to the DOM
  themeVariables: {
    fontFamily: "inherit",
    primaryColor: "#2563eb",
    primaryTextColor: "#fff",
    primaryBorderColor: "#1d4ed8",
    lineColor: "#64748b",
    secondaryColor: "#1e293b",
    tertiaryColor: "#0f172a"
  }
});

export default function MermaidRenderer({ code }) {
  const ref = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) return;
    
    // Sometimes the AI returns the diagram wrapped in markdown backticks
    let cleanCode = code.trim();
    if (cleanCode.startsWith("```mermaid")) {
      cleanCode = cleanCode.replace(/^```mermaid\n?/, "").replace(/```$/, "").trim();
    } else if (cleanCode.startsWith("```")) {
      cleanCode = cleanCode.replace(/^```\n?/, "").replace(/```$/, "").trim();
    }

    const id = `mermaid-${Math.random().toString(36).substring(7)}`;
    mermaid.render(id, cleanCode).then(({ svg }) => {
      // Strip max-width from the svg directly so it flexes properly if needed, though useMaxWidth helps
      setSvgContent(svg);
      setError(false);
    }).catch(e => {
      console.warn("Mermaid rendering failed:", e);
      setError(true);
    });
  }, [code]);

  if (error) {
    return <div className="text-red-500 text-xs font-mono p-4 border border-red-500/20 rounded-lg bg-red-500/10">Failed to render diagram.</div>;
  }

  return (
    <>
      {/* Inline Viewer */}
      <div className="relative group overflow-hidden rounded-xl border border-[var(--border)] bg-zinc-950/50">
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg bg-black/50 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100 backdrop-blur-sm"
          title="Fullscreen"
        >
          <Maximize className="size-4" />
        </button>
        <div 
          className="flex justify-center overflow-x-auto py-8 px-4"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center justify-end p-4 border-b border-zinc-800">
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
            >
              Close <X className="size-4" />
            </button>
          </div>
          <div 
            className="flex-1 flex items-center justify-center p-8 overflow-auto [&>svg]:w-full [&>svg]:max-w-5xl [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )}
    </>
  );
}
