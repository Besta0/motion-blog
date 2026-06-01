"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6">
      {/* Subtle background gradient */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            "radial-gradient(900px circle at 65% 35%, rgba(61,90,128,0.1), transparent 70%)",
            "radial-gradient(900px circle at 35% 65%, rgba(61,90,128,0.06), transparent 70%)",
            "radial-gradient(900px circle at 65% 35%, rgba(61,90,128,0.1), transparent 70%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Content — split layout */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-light/80 border border-surface-lighter text-xs font-medium text-text-muted mb-8 font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            ~/blog
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 font-display"
          >
            Stories in
            <br />
            <span className="text-accent">Motion</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-text-secondary max-w-md leading-relaxed mb-8"
          >
            Exploring the intersection of design, technology, and creativity.
            Curated by Caleb Tam.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-accent text-white hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20"
              >
                Read the blog
              </motion.button>
            </Link>
            <Link href="/tags">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-transparent text-text-secondary border border-surface-lighter hover:border-accent/30 hover:text-text-primary"
              >
                Browse topics
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right: Terminal / Code visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="rounded-2xl overflow-hidden border border-surface-lighter bg-surface-light shadow-lg shadow-black/5">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-lighter bg-surface/60">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-text-muted font-mono">terminal</span>
            </div>
            {/* Terminal content */}
            <div className="p-5 font-mono text-[13px] leading-loose">
              <div className="text-text-muted">
                <span className="text-accent">$</span> cat about.txt
              </div>
              <div className="mt-2 text-text-secondary">
                Hi, I&rsquo;m <span className="text-text-primary font-medium">Caleb</span>.
              </div>
              <div className="text-text-secondary">
                I write about <span className="text-accent">design</span>,{" "}
                <span className="text-accent">code</span>, and{" "}
                <span className="text-accent">motion</span>.
              </div>
              <div className="mt-3 text-text-muted">
                <span className="text-accent">$</span> cat stack.json
              </div>
              <div className="mt-2 text-text-secondary">
                <span className="text-text-muted">{"{"}</span>
              </div>
              <div className="text-text-secondary">
                &nbsp;&nbsp;<span className="text-accent/80">&quot;framework&quot;</span>:{" "}
                <span className="text-green-600/80">&quot;Next.js&quot;</span>,
              </div>
              <div className="text-text-secondary">
                &nbsp;&nbsp;<span className="text-accent/80">&quot;language&quot;</span>:{" "}
                <span className="text-green-600/80">&quot;TypeScript&quot;</span>,
              </div>
              <div className="text-text-secondary">
                &nbsp;&nbsp;<span className="text-accent/80">&quot;styling&quot;</span>:{" "}
                <span className="text-green-600/80">&quot;Tailwind CSS&quot;</span>,
              </div>
              <div className="text-text-secondary">
                &nbsp;&nbsp;<span className="text-accent/80">&quot;animation&quot;</span>:{" "}
                <span className="text-green-600/80">&quot;Framer Motion&quot;</span>
              </div>
              <div className="text-text-secondary">
                <span className="text-text-muted">{"}"}</span>
              </div>
              <div className="mt-3 text-text-muted">
                <span className="text-accent">$</span>{" "}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-surface-lighter flex items-start justify-center p-1"
        >
          <motion.div className="w-1 h-1.5 rounded-full bg-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
