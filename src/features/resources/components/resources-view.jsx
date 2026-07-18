"use client";

import { useState, useMemo } from "react";
import { 
  BookOpen, FileText, GitBranch, Image as ImageIcon, Link2, 
  Plus, Search, Video, Star, Pencil, Trash2, 
  ExternalLink, ChevronRight, ChevronDown, LayoutGrid, ListTree
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const resourceTypes = [
  "youtube", "documentation", "blog", "github", 
  "pdf", "docx", "pptx", "image", "markdown", "text", "website", "other"
];

const iconByType = {
  youtube: Video, documentation: BookOpen, blog: FileText, github: GitBranch,
  pdf: FileText, docx: FileText, pptx: FileText, image: ImageIcon,
  markdown: FileText, text: FileText, website: Link2, other: Link2,
};

const initialForm = {
  title: "", type: "website", url: "", technology: "",
  tags: "", notes: "", visibility: "global",
};

// --- Helper Components ---

function Collapsible({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left font-bold text-sm hover:text-[var(--primary)] transition-colors py-2"
      >
        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        {title}
      </button>
      {isOpen && <div className="pl-6 border-l border-[var(--border)] ml-2 mt-2">{children}</div>}
    </div>
  );
}

function ResourceCard({ resource, onEdit, onDelete, onToggleFavorite }) {
  const Icon = iconByType[resource.type] || Link2;
  const linkHref = resource.filePath || resource.url || "#";
  const dateStr = resource.createdAt ? formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true }) : "recently";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--primary)] hover:shadow-sm transition-all h-full">
      <div className="flex items-start justify-between gap-4 min-h-0">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
          <Icon className="size-5" />
        </span>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onToggleFavorite(resource)} className="p-1.5 rounded-md hover:bg-[var(--muted)]">
            <Star className={cn("size-4", resource.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--muted-foreground)]")} />
          </button>
          <button onClick={() => onEdit(resource)} className="p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <Pencil className="size-4" />
          </button>
          <button onClick={() => onDelete(resource._id)} className="p-1.5 rounded-md hover:bg-red-50 text-[var(--muted-foreground)] hover:text-red-600 dark:hover:bg-red-950/30">
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="sm:hidden flex gap-1.5">
          <button onClick={() => onToggleFavorite(resource)} className="p-1">
            <Star className={cn("size-4", resource.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--muted-foreground)]")} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 flex flex-col">
        <a href={linkHref} target="_blank" rel="noreferrer" className="font-bold text-sm leading-tight line-clamp-2 hover:text-[var(--primary)] transition-colors inline-flex items-start gap-1.5">
          {resource.title}
          <ExternalLink className="size-3.5 text-[var(--muted-foreground)] shrink-0 mt-0.5" />
        </a>
        
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold capitalize">
          <span className="text-[var(--primary)]">{resource.technology}</span>
          <span className="text-[var(--muted-foreground)]">•</span>
          <span className="text-[var(--muted-foreground)]">{resource.type}</span>
          {resource.status && (
            <>
              <span className="text-[var(--muted-foreground)]">•</span>
              <span className={cn(
                resource.status === "completed" ? "text-emerald-500" :
                resource.status === "reading" ? "text-amber-500" :
                "text-[var(--muted-foreground)]"
              )}>{resource.status}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex-1 rounded-xl bg-[var(--muted)]/50 p-3 text-[10px] space-y-1.5">
          {resource.roadmapTitle ? (
            <>
              <p className="font-semibold text-[var(--foreground)] truncate">Added from: <span className="text-[var(--muted-foreground)] font-medium">{resource.roadmapTitle}</span></p>
              {resource.phaseTitle && <p className="font-semibold text-[var(--foreground)] truncate">Module: <span className="text-[var(--muted-foreground)] font-medium">{resource.phaseTitle}</span></p>}
              {resource.lessonTitle && <p className="font-semibold text-[var(--foreground)] truncate">Lesson: <span className="text-[var(--muted-foreground)] font-medium">{resource.lessonTitle}</span></p>}
            </>
          ) : (
            <p className="font-semibold text-[var(--foreground)] truncate">Added from: <span className="text-[var(--muted-foreground)] font-medium capitalize">{resource.savedFrom?.replace('_', ' ') || "General"}</span></p>
          )}
          <p className="font-semibold text-[var(--foreground)] pt-1 border-t border-[var(--border)] mt-1 truncate">Added: <span className="text-[var(--muted-foreground)] font-medium">{dateStr}</span></p>
        </div>
        
        {resource.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-flex rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--secondary-foreground)]">
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="inline-flex rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--secondary-foreground)]">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {resource.notes && (
          <p className="mt-3 text-xs text-[var(--muted-foreground)] line-clamp-2">
            {resource.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Main View ---

export function ResourcesView({ initialResources }) {
  const [resources, setResources] = useState(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterFav, setFilterFav] = useState(false);
  const [viewMode, setViewMode] = useState("tree"); // "tree" | "grid"

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("url");

  // Filtering
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      if (filterFav && !res.isFavorite) return false;
      if (filterType !== "all" && res.type !== filterType) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(query) ||
          res.technology?.toLowerCase().includes(query) ||
          res.roadmapTitle?.toLowerCase().includes(query) ||
          res.phaseTitle?.toLowerCase().includes(query) ||
          res.lessonTitle?.toLowerCase().includes(query) ||
          res.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          res.notes?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [resources, searchQuery, filterType, filterFav]);

  // Grouping for Tree View
  const groupedResources = useMemo(() => {
    const general = [];
    const roadmaps = {}; // structure: { roadmapTitle: { resources: [], phases: { phaseTitle: { resources: [], lessons: { lessonTitle: [] } } } } }

    filteredResources.forEach(res => {
      if (!res.roadmapTitle) {
        general.push(res);
        return;
      }
      
      if (!roadmaps[res.roadmapTitle]) {
        roadmaps[res.roadmapTitle] = { resources: [], phases: {} };
      }
      const rm = roadmaps[res.roadmapTitle];
      
      if (!res.phaseTitle) {
        rm.resources.push(res);
        return;
      }
      
      if (!rm.phases[res.phaseTitle]) {
        rm.phases[res.phaseTitle] = { resources: [], lessons: {} };
      }
      const ph = rm.phases[res.phaseTitle];
      
      if (!res.lessonTitle) {
        ph.resources.push(res);
        return;
      }
      
      if (!ph.lessons[res.lessonTitle]) {
        ph.lessons[res.lessonTitle] = [];
      }
      ph.lessons[res.lessonTitle].push(res);
    });

    return { roadmaps, general };
  }, [filteredResources]);

  // --- Handlers ---
  
  const resetForm = () => {
    setForm(initialForm); setEditingId(null); setFile(null); setUploadType("url"); setIsModalOpen(false);
  };

  const handleEdit = (resource) => {
    setForm({
      title: resource.title, type: resource.type, url: resource.url || "",
      technology: resource.technology || "", tags: resource.tags ? resource.tags.join(", ") : "",
      notes: resource.notes || "", visibility: resource.visibility || "global",
    });
    setUploadType(resource.filePath ? "file" : "url");
    setEditingId(resource._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      const res = await fetch(`/api/resources/global/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setResources(prev => prev.filter(r => r._id !== id));
      toast.success("Resource deleted");
    } catch (error) { toast.error("Could not delete resource"); }
  };

  const toggleFavorite = async (resource) => {
    try {
      const res = await fetch(`/api/resources/global/${resource._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !resource.isFavorite }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const { resource: updated } = await res.json();
      setResources(prev => prev.map(r => r._id === updated._id ? { ...r, isFavorite: updated.isFavorite } : r));
    } catch (error) { toast.error("Could not update favorite status"); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.technology) return toast.error("Title and Technology are required");
    
    setIsUploading(true);
    let filePath = editingId ? resources.find(r => r._id === editingId)?.filePath : "";
    let url = form.url;

    if (uploadType === "file" && file) {
      try {
        const formData = new FormData(); formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json(); filePath = data.url; url = "";
      } catch (error) {
        toast.error("File upload failed"); setIsUploading(false); return;
      }
    }

    const tagsArray = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const payload = {
      title: form.title, type: form.type, url, filePath, technology: form.technology,
      tags: tagsArray, notes: form.notes, visibility: form.visibility,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/resources/global/${editingId}` : "/api/resources/global";
      
      const res = await fetch(endpoint, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      const { resource } = await res.json();
      setResources(prev => editingId ? prev.map(r => r._id === resource._id ? {...r, ...resource} : r) : [resource, ...prev]);
      toast.success(`Resource ${editingId ? "updated" : "created"}`);
      resetForm();
    } catch (error) { toast.error(`Failed to save resource`); } finally { setIsUploading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">Library</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">My Resources</h1>
          <p className="mt-3 text-sm font-medium text-[var(--muted-foreground)]">
            Your personal knowledge base.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
            <button
              onClick={() => setViewMode("tree")}
              className={cn("rounded-md p-2 transition-colors", viewMode === "tree" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}
            >
              <ListTree className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn("rounded-md p-2 transition-colors", viewMode === "grid" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" />
            Add Resource
          </button>
        </div>
      </section>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, tech, module, lesson, or tags..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)] capitalize"
        >
          <option value="all">All Types</option>
          {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          onClick={() => setFilterFav(!filterFav)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-colors",
            filterFav ? "bg-amber-100 dark:bg-amber-950/30 border-amber-500/50 text-amber-600 dark:text-amber-500" : "bg-[var(--card)] border-[var(--border)] hover:bg-[var(--muted)]"
          )}
        >
          <Star className={cn("size-4", filterFav && "fill-current")} />
          Favorites
        </button>
      </div>

      {/* Resource View */}
      {filteredResources.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          <BookOpen className="mx-auto size-10 text-[var(--muted-foreground)] opacity-50" />
          <h3 className="mt-4 font-bold text-lg">No resources found</h3>
          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)] max-w-md mx-auto">
            Get started by adding your first study resource, or try adjusting your search filters.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // --- GRID VIEW ---
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => (
            <ResourceCard 
              key={resource._id} 
              resource={resource} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onToggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
      ) : (
        // --- TREE VIEW ---
        <div className="space-y-6">
          {Object.entries(groupedResources.roadmaps).map(([roadmapTitle, roadmapData]) => (
            <div key={roadmapTitle} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="bg-[var(--muted)]/50 p-4 border-b border-[var(--border)]">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <BookOpen className="size-4 text-[var(--primary)]" />
                  {roadmapTitle}
                </h2>
              </div>
              <div className="p-4">
                {/* Roadmap level resources */}
                {roadmapData.resources.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                    {roadmapData.resources.map(res => (
                      <ResourceCard key={res._id} resource={res} onEdit={handleEdit} onDelete={handleDelete} onToggleFavorite={toggleFavorite} />
                    ))}
                  </div>
                )}
                
                {/* Modules (Phases) */}
                {Object.entries(roadmapData.phases).map(([phaseTitle, phaseData]) => (
                  <Collapsible key={phaseTitle} title={phaseTitle}>
                    {/* Phase level resources */}
                    {phaseData.resources.length > 0 && (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
                        {phaseData.resources.map(res => (
                          <ResourceCard key={res._id} resource={res} onEdit={handleEdit} onDelete={handleDelete} onToggleFavorite={toggleFavorite} />
                        ))}
                      </div>
                    )}
                    
                    {/* Lessons */}
                    {Object.entries(phaseData.lessons).map(([lessonTitle, resources]) => (
                      <Collapsible key={lessonTitle} title={lessonTitle} defaultOpen={false}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
                          {resources.map(res => (
                            <ResourceCard key={res._id} resource={res} onEdit={handleEdit} onDelete={handleDelete} onToggleFavorite={toggleFavorite} />
                          ))}
                        </div>
                      </Collapsible>
                    ))}
                  </Collapsible>
                ))}
              </div>
            </div>
          ))}

          {/* General Resources */}
          {groupedResources.general.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="bg-[var(--muted)]/50 p-4 border-b border-[var(--border)]">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Link2 className="size-4 text-[var(--primary)]" />
                  General Resources
                </h2>
              </div>
              <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedResources.general.map(res => (
                  <ResourceCard key={res._id} resource={res} onEdit={handleEdit} onDelete={handleDelete} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--card)] p-6 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editingId ? "Edit Resource" : "Add Resource"}</h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
                <span className="text-[var(--muted-foreground)] text-xs font-bold uppercase">Cancel</span>
              </button>
            </div>

            <div className="flex gap-4 border-b border-[var(--border)] mb-6">
              <button
                type="button"
                onClick={() => setUploadType("url")}
                className={cn("text-xs font-bold pb-2 border-b-2 uppercase tracking-wider transition-colors", uploadType === "url" ? "border-[var(--primary)] text-[var(--foreground)]" : "border-transparent text-[var(--muted-foreground)]")}
              >
                Link URL
              </button>
              <button
                type="button"
                onClick={() => setUploadType("file")}
                className={cn("text-xs font-bold pb-2 border-b-2 uppercase tracking-wider transition-colors", uploadType === "file" ? "border-[var(--primary)] text-[var(--foreground)]" : "border-transparent text-[var(--muted-foreground)]")}
              >
                Upload File
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Type *</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)] capitalize">
                  {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Technology *</label>
                <input required value={form.technology} onChange={e => setForm({...form, technology: e.target.value})} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              {uploadType === "url" ? (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">URL *</label>
                  <input required={uploadType === "url"} type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]" />
                </div>
              ) : (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">File {!editingId && "*"}</label>
                  <input type="file" required={!editingId && uploadType === "file"} onChange={e => setFile(e.target.files?.[0])} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold" />
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Notes</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 mt-2 border-t border-[var(--border)] pt-5">
                <button type="submit" disabled={isUploading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--primary-foreground)] disabled:opacity-70">
                  {isUploading ? "Saving..." : "Save Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
