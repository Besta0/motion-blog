"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-surface-lighter mt-24"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Link href="/">
              <span className="text-lg font-bold font-display tracking-tight">MotionBlog</span>
            </Link>
            <p className="mt-2 text-sm text-text-secondary">
              Stories at the intersection of design and technology.
            </p>
          </div>

          {/* Links — single row */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-accent transition-colors">
              Blog
            </Link>
            <Link href="/tags" className="text-sm text-text-secondary hover:text-accent transition-colors">
              Tags
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-surface-lighter flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-text-muted">
          <span>&copy; {new Date().getFullYear()} Caleb Tam.</span>
          <span>Built with Next.js &amp; Framer Motion.</span>
        </div>
      </div>
    </motion.footer>
  );
}
