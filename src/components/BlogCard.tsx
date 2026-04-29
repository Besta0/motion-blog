"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Post, readingTime } from "@/lib/posts";
import { getViewCount } from "@/lib/views";

interface BlogCardProps {
  post: Post;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    setViews(getViewCount(post.slug));
  }, [post.slug]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.div
          whileHover={{ y: -6 }}
          className="group bg-surface-light rounded-2xl overflow-hidden border border-surface-lighter hover:border-accent/30 transition-colors duration-300 h-full flex flex-col"
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            {post.coverImage ? (
              <>
                <motion.img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/20 via-purple-500/20 to-pink-500/20"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
            )}
            {/* Fallback emoji when no cover image */}
            {!post.coverImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-5xl"
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {post.emoji}
                </motion.span>
              </div>
            )}
            {/* Category tag */}
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-sm text-xs font-medium text-text-secondary border border-surface-lighter">
              {post.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            {/* Meta row: date + reading time + views */}
            <div className="flex items-center gap-2 text-xs text-text-muted mb-3 flex-wrap">
              <time>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-text-muted" />
              <span>{readingTime(post.content)}</span>
              <span className="w-1 h-1 rounded-full bg-text-muted" />
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {views}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors duration-300">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-text-secondary leading-relaxed flex-1">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-surface-lighter/60 text-[11px] font-medium text-text-muted"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-[11px] text-text-muted">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Read more */}
            <div className="mt-4 flex items-center gap-1 text-sm text-accent font-medium">
              <span>Read more</span>
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                &rarr;
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
