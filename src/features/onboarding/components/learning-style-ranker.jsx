"use client";

import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";

export function LearningStyleRanker({ ranking = [], onChange }) {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;
    
    const updated = [...ranking];
    const [removed] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, removed);
    onChange(updated);
  };

  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ranking.length) return;
    
    const updated = [...ranking];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted-foreground)]">
        Drag and drop items to prioritize, or use the up/down arrows to reorder. The top items will heavily influence your lesson style and recommended resources.
      </p>
      
      <div className="space-y-2">
        {ranking.map((style, idx) => (
          <div
            key={style}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, idx)}
            className="flex items-center justify-between rounded-xl border bg-[var(--card)] p-4 shadow-sm hover:border-[var(--primary)] transition-all cursor-grab active:cursor-grabbing group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[var(--primary)] w-4">
                {idx + 1}
              </span>
              <GripVertical className="size-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]" />
              <span className="text-sm font-medium">{style}</span>
            </div>
            
            {/* Buttons for Accessibility / Touch screens */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(idx, -1)}
                disabled={idx === 0}
                className="p-1 rounded hover:bg-[var(--secondary)] disabled:opacity-30 disabled:pointer-events-none"
                title="Move up"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(idx, 1)}
                disabled={idx === ranking.length - 1}
                className="p-1 rounded hover:bg-[var(--secondary)] disabled:opacity-30 disabled:pointer-events-none"
                title="Move down"
              >
                <ArrowDown className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
