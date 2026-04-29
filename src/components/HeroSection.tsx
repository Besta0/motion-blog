"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(600px circle at 20% 30%, rgba(99,102,241,0.15), transparent 70%)",
            "radial-gradient(600px circle at 80% 60%, rgba(168,85,247,0.15), transparent 70%)",
            "radial-gradient(600px circle at 40% 80%, rgba(236,72,153,0.15), transparent 70%)",
            "radial-gradient(600px circle at 20% 30%, rgba(99,102,241,0.15), transparent 70%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "15%", left: "10%" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "5%" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-lighter/50 border border-surface-lighter text-sm text-text-secondary mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Explore the art of motion
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
        >
          Stories in{" "}
          <span className="gradient-text">Motion</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Exploring the intersection of design, technology, and creativity.
          Curated by Caleb Tam — where every pixel tells a story.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all bg-surface-light text-text-primary border border-surface-lighter hover:bg-accent hover:text-white hover:border-accent hover:shadow-lg hover:shadow-accent/20"
            >
              Explore Articles
            </motion.button>
          </Link>
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all bg-surface-light text-text-primary border border-surface-lighter hover:bg-accent hover:text-white hover:border-accent"
            >
              Latest Posts
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-surface-lighter flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
