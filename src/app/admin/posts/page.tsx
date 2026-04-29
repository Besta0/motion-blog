"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminToken } from "../layout";

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  category: string;
  emoji: string;
  wordCount: number;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load posts" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setDeleteLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-token": getAdminToken() || "" },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        setMessage({ type: "success", text: "Post deleted" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Failed to delete" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete post" });
    } finally {
      setDeleteLoading(false);
      setDeleteSlug(null);
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
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
          <p className="text-sm text-text-secondary mt-1">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Link href="/admin/posts/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium"
          >
            + New Post
          </motion.button>
        </Link>
      </div>

      {/* Message toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 px-4 py-3 rounded-xl text-sm ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted text-sm">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-light rounded-xl border border-surface-lighter p-5 flex items-center gap-4"
            >
              {/* Emoji */}
              <span className="text-2xl shrink-0">{post.emoji}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary truncate">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span>{post.wordCount} words</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <code className="text-[11px] text-accent">{post.slug}</code>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/posts/edit/${post.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg bg-surface-lighter/50 border border-surface-lighter text-xs text-text-secondary hover:text-text-primary transition-all"
                  >
                    Edit
                  </motion.button>
                </Link>
                <button
                  onClick={() => setDeleteSlug(post.slug)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteSlug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-light rounded-2xl border border-surface-lighter p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Delete post?
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                This will permanently delete &quot;{posts.find((p) => p.slug === deleteSlug)?.title}&quot;. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteSlug(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl border border-surface-lighter text-sm text-text-secondary hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteSlug)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
