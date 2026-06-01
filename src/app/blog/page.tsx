"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import { getAllPosts, Post } from "@/lib/posts";
import { getAllViewCounts, sortPostsByViews } from "@/lib/views";

type SortMode = "latest" | "popular" | "oldest";

export default function BlogPage() {
  const allPosts = getAllPosts();
  const [sortBy, setSortBy] = useState<SortMode>("latest");
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Sync view counts on mount and when localStorage changes from other tabs
  useEffect(() => {
    setViewCounts(getAllViewCounts());
    const handler = () => setViewCounts(getAllViewCounts());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const sortedPosts: Post[] = useMemo(() => {
    if (sortBy === "popular") {
      const slugsByViews = sortPostsByViews(allPosts);
      return slugsByViews
        .map((slug) => allPosts.find((p) => p.slug === slug))
        .filter(Boolean) as Post[];
    }
    if (sortBy === "oldest") {
      return [...allPosts].reverse();
    }
    // latest (default)
    return allPosts;
  }, [allPosts, sortBy]);

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: "latest", label: "Latest" },
    { key: "popular", label: "Most Viewed" },
    { key: "oldest", label: "Oldest" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-medium text-text-muted tracking-widest uppercase mb-3 block">
              All articles
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display tracking-tight">
              Blog
            </h1>

            {/* Sort bar — inline text buttons */}
            <div className="flex flex-wrap items-center gap-1 mt-8">
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === opt.key
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <span className="text-text-muted mx-1">/</span>
              <a
                href="/tags"
                className="px-4 py-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                Tags
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={sortBy}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-sm text-text-muted"
        >
          {allPosts.length} {allPosts.length === 1 ? "article" : "articles"} &middot;{" "}
          {Object.values(viewCounts).reduce((a, b) => a + b, 0)} total views
        </motion.div>
      </section>
    </>
  );
}
