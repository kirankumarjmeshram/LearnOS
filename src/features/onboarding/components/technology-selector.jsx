"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { TECHNOLOGY_CATALOG } from "@/constants/technology-catalog";

function getCatalogForRole(goal) {
  const cleanGoal = goal?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
  if (cleanGoal.includes("frontend")) return TECHNOLOGY_CATALOG.frontend;
  if (cleanGoal.includes("backend")) return TECHNOLOGY_CATALOG.backend;
  if (cleanGoal.includes("fullstack") || cleanGoal.includes("software") || cleanGoal.includes("web")) return TECHNOLOGY_CATALOG.fullstack;
  if (cleanGoal.includes("ai") || cleanGoal.includes("machine") || cleanGoal.includes("ml")) return TECHNOLOGY_CATALOG.ai;
  if (cleanGoal.includes("data")) return TECHNOLOGY_CATALOG.data;
  if (cleanGoal.includes("devops")) return TECHNOLOGY_CATALOG.devops;
  if (cleanGoal.includes("cloud")) return TECHNOLOGY_CATALOG.cloud;
  if (cleanGoal.includes("cyber") || cleanGoal.includes("security")) return TECHNOLOGY_CATALOG.cybersecurity;
  if (cleanGoal.includes("mobile") || cleanGoal.includes("ios") || cleanGoal.includes("android")) return TECHNOLOGY_CATALOG.mobile;
  if (cleanGoal.includes("product")) return TECHNOLOGY_CATALOG.productmanager;
  if (cleanGoal.includes("design") || cleanGoal.includes("ui") || cleanGoal.includes("ux")) return TECHNOLOGY_CATALOG.uiux;
  
  return TECHNOLOGY_CATALOG.fullstack;
}

export function TechnologySelector({
  careerGoal,
  selectedTechnologies = [],
  onChangeSelected,
  customTechnologies = [],
  onChangeCustom,
}) {
  const catalog = useMemo(() => getCatalogForRole(careerGoal), [careerGoal]);
  const categories = useMemo(() => Object.keys(catalog.categories), [catalog]);
  
  const [activeTab, setActiveTab] = useState(categories[0] || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [editingCustomIndex, setEditingCustomIndex] = useState(null);
  const [editingCustomValue, setEditingCustomValue] = useState("");

  const toggleCatalogTech = (tech) => {
    if (selectedTechnologies.includes(tech)) {
      onChangeSelected(selectedTechnologies.filter((t) => t !== tech));
    } else {
      onChangeSelected([...selectedTechnologies, tech]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (!clean) return;
    if (!customTechnologies.includes(clean) && !selectedTechnologies.includes(clean)) {
      onChangeCustom([...customTechnologies, clean]);
    }
    setCustomInput("");
  };

  const handleRemoveCustom = (tech) => {
    onChangeCustom(customTechnologies.filter((t) => t !== tech));
  };

  const startEditCustom = (index, value) => {
    setEditingCustomIndex(index);
    setEditingCustomValue(value);
  };

  const handleSaveEditCustom = (index) => {
    const clean = editingCustomValue.trim();
    if (!clean) {
      handleRemoveCustom(customTechnologies[index]);
    } else {
      const updated = [...customTechnologies];
      updated[index] = clean;
      onChangeCustom(updated);
    }
    setEditingCustomIndex(null);
    setEditingCustomValue("");
  };

  // Filter tech within active category based on search query
  const filteredCategoryTechs = useMemo(() => {
    const techs = catalog.categories[activeTab] || [];
    if (!searchQuery.trim()) return techs;
    return techs.filter((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [catalog, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Tabs */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 rounded-xl border bg-transparent px-4 py-2.5">
          <Search className="size-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technologies..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </label>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 border-b pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveTab(cat);
                setSearchQuery("");
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === cat
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of technologies in active tab */}
      <div>
        {filteredCategoryTechs.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filteredCategoryTechs.map((tech) => {
              const active = selectedTechnologies.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleCatalogTech(tech)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                    active
                      ? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)] font-semibold"
                      : "hover:border-[var(--primary)] bg-[var(--card)]"
                  }`}
                >
                  <span>{tech}</span>
                  {active && <span className="text-xs text-[var(--primary)] font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xs text-[var(--muted-foreground)] py-4">
            No technologies found.
          </p>
        )}
      </div>

      {/* Selected Technologies Panel */}
      {(selectedTechnologies.length > 0 || customTechnologies.length > 0) && (
        <div className="rounded-2xl border bg-[var(--secondary)]/30 p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Selected Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Catalog technologies */}
            {selectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-[var(--primary-foreground)]"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => toggleCatalogTech(tech)}
                  className="rounded-full hover:bg-black/10 p-0.5"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}

            {/* Custom technologies */}
            {customTechnologies.map((tech, idx) => {
              const isEditing = editingCustomIndex === idx;
              return isEditing ? (
                <div key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-xs">
                  <input
                    type="text"
                    value={editingCustomValue}
                    onChange={(e) => setEditingCustomValue(e.target.value)}
                    onBlur={() => handleSaveEditCustom(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEditCustom(idx);
                      if (e.key === "Escape") setEditingCustomIndex(null);
                    }}
                    autoFocus
                    className="bg-transparent outline-none border-b border-[var(--primary)] w-20 text-xs py-0.5 text-amber-900 dark:text-amber-200"
                  />
                </div>
              ) : (
                <span
                  key={tech}
                  onDoubleClick={() => startEditCustom(idx, tech)}
                  title="Double click to edit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200 cursor-pointer border border-amber-300 dark:border-amber-900"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustom(tech)}
                    className="rounded-full hover:bg-black/10 p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)]">
            * Double click on any custom technology chip to edit it.
          </p>
        </div>
      )}

      {/* Add Custom Technology input */}
      <form onSubmit={handleAddCustom} className="border-t pt-4 space-y-2">
        <p className="text-xs font-medium text-[var(--muted-foreground)]">
          Can&apos;t find your technology? Add it below:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Drizzle ORM, tRPC, SolidJS"
            className="flex-1 rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90"
          >
            <Plus className="size-3.5" />
            Add Technology
          </button>
        </div>
      </form>
    </div>
  );
}
