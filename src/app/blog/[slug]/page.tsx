"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { getPostBySlug, readingTime, readingTimeMinutes, getRelatedPosts } from "@/lib/posts";
import { incrementView, getViewCount } from "@/lib/views";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MotionLink = motion(Link);

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  const [views, setViews] = useState(0);

  useEffect(() => {
    if (!post) return;
    // Count this visit (session-guarded — only counts once per session)
    const newCount = incrementView(post.slug);
    setViews(newCount);
  }, [post]);

  // Also keep views synced in case the user opens multiple tabs
  useEffect(() => {
    if (!post) return;
    const syncViews = () => setViews(getViewCount(post.slug));
    window.addEventListener("storage", syncViews);
    return () => window.removeEventListener("storage", syncViews);
  }, [post]);

  const relatedPosts = useMemo(() => (post ? getRelatedPosts(post.slug, 2) : []), [post]);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24 px-6">
      {/* Back button */}
      <div className="max-w-3xl mx-auto mb-12">
        <MotionLink
          href="/blog"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8L10 4" />
          </svg>
          Back to articles
        </MotionLink>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Meta row: category, date, reading time, views */}
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            <span className="px-3 py-1 rounded-full bg-surface-lighter/50 border border-surface-lighter text-text-secondary">
              {post.category}
            </span>
            <time className="text-text-muted">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span className="text-text-muted">{readingTime(post.content)}</span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            {/* View counter */}
            <span className="flex items-center gap-1 text-text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {views} {views === 1 ? "view" : "views"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author + emoji row */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{post.author}</p>
                <p className="text-xs text-text-muted">{readingTimeMinutes(post.content)} min read</p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-5xl"
            >
              {post.emoji}
            </motion.div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-surface-lighter">
              <span className="text-xs text-text-muted font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags?tag=${tag}`}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-lg bg-surface-lighter/50 border border-surface-lighter text-xs font-medium text-text-muted hover:text-accent hover:border-accent/30 transition-all cursor-pointer"
                  >
                    #{tag}
                  </motion.span>
                </Link>
              ))}
            </div>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-10 -mx-2"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Progress bar */}
          <ProgressBar />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose-custom"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mt-12 mb-6 text-text-primary"
                >
                  {children}
                </motion.h1>
              ),
              h2: ({ children }) => (
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mt-10 mb-4 text-text-primary"
                >
                  {children}
                </motion.h2>
              ),
              h3: ({ children }) => (
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold mt-8 mb-3 text-text-primary"
                >
                  {children}
                </motion.h3>
              ),
              p: ({ children }) => (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-base leading-relaxed mb-5 text-text-secondary"
                >
                  {children}
                </motion.p>
              ),
              ul: ({ children }) => (
                <motion.ul
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="list-disc pl-6 mb-6 space-y-2 text-text-secondary"
                >
                  {children}
                </motion.ul>
              ),
              ol: ({ children }) => (
                <motion.ol
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="list-decimal pl-6 mb-6 space-y-2 text-text-secondary"
                >
                  {children}
                </motion.ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <motion.blockquote
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-accent pl-6 py-4 mb-6 bg-surface-light rounded-r-xl italic text-text-primary"
                >
                  {children}
                </motion.blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="px-2 py-0.5 rounded-md bg-surface-lighter text-accent text-sm font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <motion.pre
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-surface-light rounded-xl p-6 mb-6 overflow-x-auto border border-surface-lighter"
                  >
                    <code className="text-sm font-mono text-text-primary leading-relaxed">
                      {children}
                    </code>
                  </motion.pre>
                );
              },
              strong: ({ children }) => (
                <strong className="font-semibold text-text-primary">{children}</strong>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline underline-offset-2"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <span className="block my-8">
                  <img
                    src={src}
                    alt={alt || ""}
                    className="w-full rounded-xl border border-surface-lighter"
                    loading="lazy"
                  />
                  {alt && (
                    <span className="block text-xs text-text-muted text-center mt-2 italic">{alt}</span>
                  )}
                </span>
              ),
              hr: () => (
                <motion.hr
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="border-surface-lighter my-10"
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Tags footer */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 pt-6 border-t border-surface-lighter"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-muted font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags?tag=${tag}`}>
                  <span className="px-3 py-1.5 rounded-lg bg-surface-lighter/50 border border-surface-lighter text-xs font-medium text-text-muted hover:text-accent hover:border-accent/30 transition-all cursor-pointer">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Author card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 p-6 rounded-2xl bg-surface-light border border-surface-lighter flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl shrink-0">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">{post.author}</p>
            <p className="text-sm text-text-secondary mt-1">
              Designer & developer exploring the intersection of motion and UI. Writing about Framer Motion, design systems, and creative coding.
            </p>
          </div>
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl bg-surface-light text-text-primary border border-surface-lighter hover:bg-accent hover:text-white hover:border-accent text-sm font-medium whitespace-nowrap transition-all"
            >
              Follow
            </motion.button>
          </Link>
        </motion.div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-text-primary mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rp, i) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-xl bg-surface-light border border-surface-lighter hover:border-accent/30 transition-all h-full"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{rp.emoji}</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-lighter/60 text-[11px] text-text-muted">
                        {rp.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">{rp.title}</h3>
                    <p className="text-xs text-text-muted">{readingTime(rp.content)}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-surface-lighter"
        >
          <div className="flex items-center justify-between">
            <Link href={`/blog`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-surface-light text-text-primary border border-surface-lighter hover:bg-accent hover:text-white hover:border-accent text-sm font-medium transition-all"
              >
                &larr; Back to Blog
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  );
}

/* Reading progress bar */
function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      className="fixed top-16 left-0 right-0 h-1 bg-accent origin-left z-40"
      style={{ transformOrigin: "left" }}
    />
  );
}
