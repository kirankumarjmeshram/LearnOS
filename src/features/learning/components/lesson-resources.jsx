"use client";

import {
  BookOpen,
  ExternalLink,
  FileText,
  Github,
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
  github: Github,
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

  return (
    <div className="rounded-xl border bg-[var(--card)]">
      {/* YouTube embed */}
      {videoId && (
        <div className="aspect-video overflow-hidden rounded-t-xl bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={resource.title}
            loading="lazy"
          />
        </div>
      )}

      {/* Image preview */}
      {resource.type === "image" && resource.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resource.url}
          alt={resource.title}
          className="max-h-48 w-full rounded-t-xl object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}

      {/* Card body */}
      <div className="p-4">
        <a
          href={resource.url || "#"}
          target="_blank"
          rel="noreferrer"
          className={resource.url ? "group flex items-start gap-3" : "pointer-events-none flex items-start gap-3 opacity-60"}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--secondary)] text-[var(--primary)]">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium group-hover:text-[var(--primary)]">
              {resource.title}
            </span>
            <span className="mt-1 block text-sm leading-5 capitalize text-[var(--muted-foreground)]">
              {resource.description || resource.type}
            </span>
          </span>
          {resource.url && (
            <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-[var(--muted-foreground)]" />
          )}
        </a>

        {canEdit && (
          <div className="mt-3 flex gap-2 border-t pt-3">
            <button
              type="button"
              onClick={() => onEdit(resource)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(resource._id)}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LessonResources({ lessonId, aiResources, initialUserResources }) {
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

  return (
    <div className="space-y-5">
      {/* ── Curated Learning Content (AI) ── */}
      <section className="rounded-2xl border bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Learning Content</h2>
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

      {/* ── My Resources (user-added) ── */}
      <section className="rounded-2xl border bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">My Resources</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Save links you want to keep with this lesson.
        </p>

        {userResources.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {userResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                canEdit
                onEdit={editResource}
                onDelete={deleteResource}
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
    </div>
  );
}
