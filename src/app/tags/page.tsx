"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAllPosts, getAllTags, Post } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

export default function TagsPage() {
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Read initial tag from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get("tag");
    if (tagParam) setActiveTag(tagParam);
  }, []);

  // Count posts per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [allPosts]);

  // Sort tags by count (most popular first)
  const sortedTags = useMemo(() => {
    return [...allTags].sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
  }, [allTags, tagCounts]);

  const filteredPosts: Post[] = activeTag
    ? allPosts.filter((p) => p.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : [];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 rounded-full bg-surface-lighter/50 border border-surface-lighter text-xs font-medium text-text-secondary mb-6"
            >
              Browse by Topic
            </motion.span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Tags</span>
            </h1>
            <p className="text-lg text-text-secondary">
              Explore articles by topic — click a tag to filter posts.
            </p>
          </motion.div>

          {/* Tag Cloud */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {sortedTags.map((tag, i) => {
              const count = tagCounts[tag] || 0;
              // Size based on popularity
              const sizeClasses =
                count >= 2
                  ? "text-base px-5 py-2.5"
                  : "text-sm px-4 py-2";

              return (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`rounded-xl font-medium transition-all border ${sizeClasses} ${
                    activeTag === tag
                      ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                      : "bg-surface-lighter/40 text-text-secondary border-surface-lighter hover:bg-surface-lighter hover:text-text-primary hover:border-text-muted"
                  }`}
                >
                  <span>#{tag}</span>
                  <span className={`ml-1.5 ${activeTag === tag ? "text-white/70" : "text-text-muted"}`}>
                    ({count})
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Filtered Posts */}
      {activeTag && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold text-text-primary">
              Posts tagged <span className="text-accent">#{activeTag}</span>
              <span className="text-text-muted font-normal ml-1">
                ({filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"})
              </span>
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTag(null)}
              className="px-4 py-2 rounded-lg bg-surface-light text-text-primary border border-surface-lighter hover:bg-accent hover:text-white hover:border-accent text-xs font-medium transition-all"
            >
              Clear filter
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* When no tag is selected, show tag descriptions */}
      {!activeTag && (
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-text-muted"
          >
            <p>Select a tag above to browse related articles.</p>
          </motion.div>
        </section>
      )}
    </>
  );
}
