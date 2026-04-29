"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { getAdminToken } from "../../../layout";

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    date: "",
    category: "Design",
    emoji: "📝",
    author: "Caleb Tam",
    tags: "",
    coverImage: "",
    content: "",
  });

  const categories = ["Design", "Technology", "Engineering", "Creative", "Uncategorized"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setForm({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || "",
        date: data.date,
        category: data.category,
        emoji: data.emoji || "📝",
        author: data.author,
        tags: (data.tags || []).join(", "),
        coverImage: data.coverImage || "",
        content: data.content,
      });
    } catch {
      setError("Post not found");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": getAdminToken() || "",
        },
        body: JSON.stringify({ ...form, tags }),
      });

      if (res.ok) {
        router.push("/admin/posts");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update post");
      }
    } catch {
      setError("Connection failed. Is the server running?");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Edit Post</h1>
        <p className="text-sm text-text-secondary mt-1">
          Editing: <span className="text-accent">{form.title}</span>
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              }))
            }
            required
            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm font-mono"
          />
          <p className="text-xs text-text-muted mt-1">Changing the slug will update the URL.</p>
        </div>

        {/* Row: Date + Category + Emoji */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Emoji</label>
            <input
              name="emoji"
              value={form.emoji}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm"
            />
          </div>
        </div>

        {/* Author + Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Author</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="design, animation, react"
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Cover Image</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-edit"
              />
              <label
                htmlFor="image-upload-edit"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-lighter/50 border border-surface-lighter text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {uploading ? "Uploading..." : "Upload Image"}
              </label>
            </div>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="Or paste image URL..."
              className="flex-1 px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm"
            />
          </div>
          {form.coverImage && (
            <div className="mt-3 relative rounded-xl overflow-hidden aspect-video max-w-md">
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.border = "2px solid #ef4444";
                }}
              />
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Excerpt</label>
          <input
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm"
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-text-secondary">Content * (Markdown)</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="inline-image-upload-edit"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  try {
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (data.url) {
                      setForm((prev) => ({ ...prev, content: prev.content + `\n![image](${data.url})\n` }));
                    }
                  } catch {}
                  if (e.target) e.target.value = "";
                }}
              />
              <label
                htmlFor="inline-image-upload-edit"
                className="text-xs text-accent hover:underline cursor-pointer"
              >
                + Image
              </label>
              <span className="text-text-muted">|</span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-accent hover:underline"
              >
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>
          {showPreview ? (
            <div className="min-h-[300px] px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-secondary text-sm leading-relaxed overflow-auto">
              <SimpleMarkdownPreview content={form.content} />
            </div>
          ) : (
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={16}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary focus:outline-none focus:border-accent text-sm font-mono leading-relaxed resize-y"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="px-5 py-2.5 rounded-xl border border-surface-lighter text-sm text-text-secondary hover:text-text-primary transition-all"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving || !form.title || !form.slug || !form.content}
            className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-medium disabled:opacity-50 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

/** Simple markdown preview */
function SimpleMarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg font-bold text-text-primary mt-6 mb-3">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-text-primary mt-4 mb-2">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("> ")) {
          return (
            <blockquote key={i} className="border-l-3 border-accent pl-4 py-2 my-3 italic text-text-secondary text-sm">
              {line.slice(2)}
            </blockquote>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={i} className="ml-4 text-text-secondary text-sm mb-1">
              {line.slice(2)}
            </li>
          );
        }
        if (line.startsWith("1. ")) {
          return (
            <li key={i} className="ml-4 text-text-secondary text-sm mb-1 list-decimal">
              {line.slice(3)}
            </li>
          );
        }
        if (line.startsWith("```")) {
          return (
            <pre key={i} className="bg-surface-lighter rounded-lg p-4 my-3 overflow-x-auto text-xs font-mono text-text-primary">
              {line.replace(/```/g, "")}
            </pre>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-3" />;
        }
        return (
          <p key={i} className="text-text-secondary text-sm leading-relaxed mb-2">
            {line}
          </p>
        );
      })}
    </div>
  );
}
