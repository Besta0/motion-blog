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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/">
              <span className="text-lg font-bold gradient-text">MotionBlog</span>
            </Link>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Stories at the intersection of design, technology, and creativity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-text-secondary hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-text-secondary hover:text-accent transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Connect</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-secondary">Twitter / X</span>
              <span className="text-sm text-text-secondary">GitHub</span>
              <span className="text-sm text-text-secondary">Dribbble</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-lighter text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} MotionBlog by Caleb Tam. Built with Next.js & Framer Motion.
        </div>
      </div>
    </motion.footer>
  );
}
