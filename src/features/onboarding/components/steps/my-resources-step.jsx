"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BookOpen, FileText, GitBranch, Image as ImageIcon, Link2, Plus, Trash2, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const resourceTypes = [
  "youtube",
  "documentation",
  "blog",
  "github",
  "pdf",
  "docx",
  "pptx",
  "image",
  "markdown",
  "text",
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
  title: "",
  type: "youtube",
  url: "",
  technology: "",
  tags: "", // We'll split this by comma
  notes: "",
  visibility: "roadmap",
};

export function MyResourcesStep() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "resources",
  });

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("url"); // "url" or "file"

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!form.title) {
        setForm((prev) => ({ ...prev, title: selectedFile.name.split(".")[0] }));
      }
    }
  };

  const handleAddResource = async () => {
    if (!form.title || !form.technology) {
      toast.error("Title and Technology are required.");
      return;
    }

    if (uploadType === "url" && !form.url) {
      toast.error("URL is required.");
      return;
    }

    if (uploadType === "file" && !file) {
      toast.error("Please select a file.");
      return;
    }

    let filePath = "";
    let url = form.url;

    if (uploadType === "file") {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const data = await response.json();
        filePath = data.url; // path returned from API
        url = ""; // clear url since it's a file
      } catch (error) {
        toast.error("Could not upload file.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const tagsArray = form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    append({
      title: form.title,
      type: form.type,
      url: url,
      filePath: filePath,
      technology: form.technology,
      tags: tagsArray,
      notes: form.notes,
      visibility: form.visibility,
    });

    setForm(initialForm);
    setFile(null);
    toast.success("Resource added successfully.");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">My Learning Resources (Optional)</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Already have study material? Add it here and LearnOS will use it throughout your learning journey. You can skip this step.
      </p>

      {/* Added Resources List */}
      {fields.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Added Resources
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field, index) => {
              const Icon = iconByType[field.type] || Link2;
              return (
                <div key={field.id} className="relative flex items-start gap-3 rounded-xl border bg-[var(--background)] p-4 shadow-sm">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--secondary)] text-[var(--primary)]">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-sm">{field.title}</p>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)] capitalize">
                      {field.technology} • {field.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute right-2 top-2 p-1.5 rounded-md hover:bg-red-50 text-[var(--muted-foreground)] hover:text-red-600 transition-colors"
                    aria-label="Remove resource"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Resource Form */}
      <div className="mt-8 rounded-2xl border bg-[var(--card)] p-6">
        <h3 className="text-base font-semibold">Add a Resource</h3>
        
        <div className="mt-4 flex gap-4 border-b pb-2">
          <button
            type="button"
            onClick={() => setUploadType("url")}
            className={cn(
              "text-sm font-medium pb-2 border-b-2 transition-colors",
              uploadType === "url" ? "border-[var(--primary)] text-[var(--foreground)]" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            Link URL
          </button>
          <button
            type="button"
            onClick={() => setUploadType("file")}
            className={cn(
              "text-sm font-medium pb-2 border-b-2 transition-colors",
              uploadType === "file" ? "border-[var(--primary)] text-[var(--foreground)]" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            Upload File
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. React Official Docs"
              className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] capitalize"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Technology */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Technology *</label>
            <input
              name="technology"
              value={form.technology}
              onChange={handleChange}
              placeholder="e.g. React, Node.js"
              className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Tags (comma separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. Hooks, UI, Frontend"
              className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {/* URL or File */}
          {uploadType === "url" ? (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[var(--muted-foreground)]">URL *</label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          ) : (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[var(--muted-foreground)]">File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full rounded-xl border bg-[var(--background)] px-3 py-2 text-sm text-[var(--muted-foreground)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--secondary)] file:px-4 file:py-1 file:text-xs file:font-semibold file:text-[var(--secondary-foreground)] hover:file:bg-[var(--secondary)]/80"
              />
            </div>
          )}

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Visibility</label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="w-full rounded-xl border bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="roadmap">Roadmap Only (Current roadmap)</option>
              <option value="global">Global (Available for all roadmaps)</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes about this resource..."
              rows={2}
              className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleAddResource}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-70"
          >
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <Upload className="size-4 animate-bounce" />
                Uploading...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Plus className="size-4" />
                Add Resource
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
