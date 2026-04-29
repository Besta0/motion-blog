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
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 rounded-full bg-surface-lighter/50 border border-surface-lighter text-xs font-medium text-text-secondary mb-6"
            >
              Explore All Articles
            </motion.span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Caleb Tam's <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-lg text-text-secondary">
              Thoughts on design, technology, and the art of motion.
            </p>
          </motion.div>

          {/* Sort bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-10"
          >
            {sortOptions.map((opt) => (
              <motion.button
                key={opt.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(opt.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  sortBy === opt.key
                    ? "bg-accent text-white"
                    : "bg-surface-light text-text-primary border border-surface-lighter hover:bg-accent hover:text-white hover:border-accent"
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Quick links to Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <a
              href="/tags"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
            >
              Browse by tag &rarr;
            </a>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={sortBy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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
          className="mt-16 text-center text-sm text-text-muted"
        >
          {allPosts.length} {allPosts.length === 1 ? "article" : "articles"} &middot;{" "}
          {Object.values(viewCounts).reduce((a, b) => a + b, 0)} total views
        </motion.div>
      </section>
    </>
  );
}
