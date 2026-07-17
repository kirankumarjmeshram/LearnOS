"use client";

import { useState, useMemo } from "react";
import { 
  BookOpen, FileText, GitBranch, Image as ImageIcon, Link2, 
  Plus, Search, Video, Star, MoreVertical, Pencil, Trash2, 
  ExternalLink, Upload
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const resourceTypes = [
  "youtube", "documentation", "blog", "github", 
  "pdf", "docx", "pptx", "image", "markdown", "text", "website", "other"
];

const iconByType = {
  youtube: Video,
  documentation: BookOpen,
  blog: FileText,
  github: GitBranch,
  pdf: FileText,
  docx: FileText,
  pptx: FileText,
  image: ImageIcon,
  markdown: FileText,
  text: FileText,
  website: Link2,
  other: Link2,
};

const initialForm = {
  title: "", type: "youtube", url: "", technology: "",
  tags: "", notes: "", visibility: "roadmap",
};

export function ResourcesView({ initialResources }) {
  const [resources, setResources] = useState(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterFav, setFilterFav] = useState(false);

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
          res.technology.toLowerCase().includes(query) ||
          res.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          res.notes?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [resources, searchQuery, filterType, filterFav]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFile(null);
    setUploadType("url");
    setIsModalOpen(false);
  };

  const handleEdit = (resource) => {
    setForm({
      title: resource.title,
      type: resource.type,
      url: resource.url || "",
      technology: resource.technology,
      tags: resource.tags ? resource.tags.join(", ") : "",
      notes: resource.notes || "",
      visibility: resource.visibility || "roadmap",
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
    } catch (error) {
      toast.error("Could not delete resource");
    }
  };

  const toggleFavorite = async (resource) => {
    try {
      const res = await fetch(`/api/resources/global/${resource._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !resource.isFavorite }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const { resource: updated } = await res.json();
      setResources(prev => prev.map(r => r._id === updated._id ? updated : r));
    } catch (error) {
      toast.error("Could not update favorite status");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.technology) {
      toast.error("Title and Technology are required");
      return;
    }
    
    setIsUploading(true);
    let filePath = editingId ? resources.find(r => r._id === editingId)?.filePath : "";
    let url = form.url;

    if (uploadType === "file" && file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        filePath = data.url;
        url = "";
      } catch (error) {
        toast.error("File upload failed");
        setIsUploading(false);
        return;
      }
    }

    const tagsArray = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const payload = {
      title: form.title,
      type: form.type,
      url,
      filePath,
      technology: form.technology,
      tags: tagsArray,
      notes: form.notes,
      visibility: form.visibility,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/resources/global/${editingId}` : "/api/resources/global";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      const { resource } = await res.json();

      setResources(prev => 
        editingId ? prev.map(r => r._id === resource._id ? resource : r) : [resource, ...prev]
      );
      toast.success(`Resource ${editingId ? "updated" : "created"}`);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editingId ? "update" : "create"} resource`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Library</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">My Resources</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Manage your personal study materials, links, and files.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Resource
        </button>
      </section>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, tech, or tags..."
            className="w-full rounded-xl border bg-[var(--card)] pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border bg-[var(--card)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] capitalize"
        >
          <option value="all">All Types</option>
          {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          onClick={() => setFilterFav(!filterFav)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
            filterFav ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]" : "bg-[var(--card)] hover:bg-[var(--muted)]"
          )}
        >
          <Star className={cn("size-4", filterFav && "fill-[var(--primary)]")} />
          Favorites
        </button>
      </div>

      {/* Resource Grid */}
      {filteredResources.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="mx-auto size-8 text-[var(--muted-foreground)] opacity-50" />
          <h3 className="mt-4 font-semibold text-lg">No resources found</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
            Get started by adding your first study resource, or try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => {
            const Icon = iconByType[resource.type] || Link2;
            const linkHref = resource.filePath || resource.url || "#";
            
            return (
              <div key={resource._id} className="group relative flex flex-col rounded-2xl border bg-[var(--card)] p-5 hover:border-[var(--primary)] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleFavorite(resource)} className="p-1.5 rounded-md hover:bg-[var(--muted)]">
                      <Star className={cn("size-4", resource.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--muted-foreground)]")} />
                    </button>
                    <button onClick={() => handleEdit(resource)} className="p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)]">
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => handleDelete(resource._id)} className="p-1.5 rounded-md hover:bg-red-50 text-[var(--muted-foreground)] hover:text-red-600">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  {/* Mobile always visible */}
                  <div className="sm:hidden flex gap-1.5">
                    <button onClick={() => toggleFavorite(resource)} className="p-1">
                      <Star className={cn("size-4", resource.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--muted-foreground)]")} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <a href={linkHref} target="_blank" rel="noreferrer" className="font-semibold line-clamp-2 hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1.5">
                    {resource.title}
                    <ExternalLink className="size-3.5 text-[var(--muted-foreground)]" />
                  </a>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)] capitalize font-medium">
                    {resource.technology} • {resource.type}
                  </p>
                  
                  {resource.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {resource.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-flex rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--secondary-foreground)]">
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="inline-flex rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--secondary-foreground)]">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {resource.notes && (
                    <p className="mt-3 text-sm text-[var(--muted-foreground)] line-clamp-2">
                      {resource.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">{editingId ? "Edit Resource" : "Add Resource"}</h2>
              <button onClick={resetForm} className="p-1 rounded-md hover:bg-[var(--muted)]">
                <Trash2 className="size-5 hidden" /> {/* spacer */}
                <ExternalLink className="size-5 hidden" />
                <span className="text-[var(--muted-foreground)] text-sm font-semibold">Cancel</span>
              </button>
            </div>

            <div className="flex gap-4 border-b mb-5">
              <button
                type="button"
                onClick={() => setUploadType("url")}
                className={cn("text-sm font-medium pb-2 border-b-2", uploadType === "url" ? "border-[var(--primary)] text-[var(--foreground)]" : "border-transparent text-[var(--muted-foreground)]")}
              >
                Link URL
              </button>
              <button
                type="button"
                onClick={() => setUploadType("file")}
                className={cn("text-sm font-medium pb-2 border-b-2", uploadType === "file" ? "border-[var(--primary)] text-[var(--foreground)]" : "border-transparent text-[var(--muted-foreground)]")}
              >
                Upload File
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Type *</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-xl border bg-[var(--background)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] capitalize">
                  {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Technology *</label>
                <input required value={form.technology} onChange={e => setForm({...form, technology: e.target.value})} className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              {uploadType === "url" ? (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">URL *</label>
                  <input required={uploadType === "url"} type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
                </div>
              ) : (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">File {!editingId && "*"}</label>
                  <input type="file" required={!editingId && uploadType === "file"} onChange={e => setFile(e.target.files?.[0])} className="w-full rounded-xl border bg-transparent px-3 py-1.5 text-sm" />
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Notes</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 mt-2 border-t pt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-70">
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
