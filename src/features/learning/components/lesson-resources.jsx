"use client";

import {
  BookOpen,
  ExternalLink,
  FileText,
  GitBranch,
  Image,
  Link2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const resourceTypes = [
  "youtube",
  "documentation",
  "website",
  "pdf",
  "image",
  "drive",
  "github",
  "other",
];

const iconByType = {
  youtube: Video,
  documentation: BookOpen,
  article: FileText,
  book: BookOpen,
  exercise: Upload,
  website: Link2,
  pdf: FileText,
  image: Image,
  drive: Upload,
  github: GitBranch,
  other: Link2,
};

// Priority for ordering AI resources: lower = shown first
const TYPE_PRIORITY = {
  youtube: 0,
  article: 1,
  book: 2,
  documentation: 3,
  exercise: 4,
  website: 5,
  github: 6,
  pdf: 7,
  image: 8,
  drive: 9,
  other: 10,
};

const initialForm = { title: "", type: "website", url: "", description: "" };

function extractYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
  } catch {
    /* invalid url */
  }
  return null;
}

function ResourceCard({ resource, canEdit, onEdit, onDelete }) {
  const Icon = iconByType[resource.type] || Link2;
  const videoId = resource.type === "youtube" ? extractYouTubeId(resource.url) : null;
  const linkHref = resource.filePath || resource.url || "#";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-sm max-h-[140px] h-full">
      <div className="flex gap-3 min-h-0">
        {/* Thumbnail or Icon */}
        <div className="shrink-0">
          {videoId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
              alt="Thumbnail"
              className="h-12 w-16 rounded-md object-cover"
            />
          ) : resource.type === "image" && resource.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resource.url}
              alt={resource.title}
              className="h-12 w-16 rounded-md object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--secondary)] text-[var(--primary)]">
              <Icon className="size-5" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex min-w-0 flex-1 flex-col">
          <a
            href={linkHref}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-sm leading-tight line-clamp-2 hover:text-[var(--primary)] transition-colors"
          >
            {resource.title}
          </a>
          <span className="mt-1 text-xs text-[var(--muted-foreground)] capitalize line-clamp-1">
            {resource.description || resource.type}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t mt-3">
         <a href={linkHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline">
            Open Resource <ExternalLink className="size-3.5" />
         </a>
        
        {canEdit && (
          <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(resource)}
              className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(resource._id)}
              className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LessonResources({ lessonId, aiResources, initialUserResources, globalResources = [] }) {
  const [userResources, setUserResources] = useState(initialUserResources);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sort AI resources: Video → Reading → Docs → Practice → GitHub → Other
  const sortedAiResources = [...aiResources].sort(
    (a, b) => (TYPE_PRIORITY[a.type] ?? 99) - (TYPE_PRIORITY[b.type] ?? 99),
  );

  const changeForm = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const resetForm = () => { setForm(initialForm); setEditingId(null); };

  const saveResource = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(
        editingId ? `/api/resources/${editingId}` : `/api/lessons/${lessonId}/resources`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setUserResources((current) =>
        editingId
          ? current.map((r) => (r._id === editingId ? payload.resource : r))
          : [payload.resource, ...current],
      );
      toast.success(editingId ? "Resource updated." : "Resource added.");
      resetForm();
    } catch (error) {
      toast.error(error.message || "We could not save this resource.");
    } finally {
      setIsSaving(false);
    }
  };

  const editResource = (resource) => {
    setEditingId(resource._id);
    setForm({ title: resource.title, type: resource.type, url: resource.url, description: resource.description || "" });
  };

  const deleteResource = async (resourceId) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error);
      }
      setUserResources((current) => current.filter((r) => r._id !== resourceId));
      toast.success("Resource deleted.");
    } catch (error) {
      toast.error(error.message || "We could not delete this resource.");
    }
  };

  // Combine global resources and lesson-specific user resources
  const allUserResources = [...globalResources, ...userResources];

  return (
    <div className="space-y-5">
      {/* ── My Resources (user-added & global) ── */}
      <section className="rounded-2xl border bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">⭐ Your Resources</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Saved links and matching resources from your library.
        </p>

        {allUserResources.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {allUserResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                canEdit={!resource.visibility} // only lesson-specific resources can be edited here
                onEdit={!resource.visibility ? editResource : undefined}
                onDelete={!resource.visibility ? deleteResource : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed p-4 text-sm text-[var(--muted-foreground)]">
            No personal resources yet. Add a link below to keep it with this lesson.
          </p>
        )}

        {/* Add / Edit form */}
        <form onSubmit={saveResource} className="mt-6 grid gap-3 border-t pt-5 sm:grid-cols-2">
          <input
            required
            name="title"
            value={form.title}
            onChange={changeForm}
            placeholder="Resource title"
            className="rounded-xl border bg-transparent px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <select
            name="type"
            value={form.type}
            onChange={changeForm}
            className="rounded-xl border bg-[var(--background)] px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <input
            required
            name="url"
            type="url"
            value={form.url}
            onChange={changeForm}
            placeholder="https://..."
            className="rounded-xl border bg-transparent px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--ring)] sm:col-span-2"
          />
          <input
            name="description"
            value={form.description}
            onChange={changeForm}
            placeholder="Optional description"
            className="rounded-xl border bg-transparent px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--ring)] sm:col-span-2"
          />
          <div className="flex gap-2 sm:col-span-2">
            <button
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-70"
            >
              <Plus className="size-4" />
              {editingId ? "Update Resource" : "Add Resource"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ── Curated Learning Content (AI) ── */}
      <section className="rounded-2xl border bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Recommended Resources</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Curated videos, official documentation, and practice resources for this lesson.
        </p>
        {sortedAiResources.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {sortedAiResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed p-4 text-sm text-[var(--muted-foreground)]">
            No curated resources yet. They will appear here once generated.
          </p>
        )}
      </section>
    </div>
  );
}
