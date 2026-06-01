"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import BlogCard from "@/components/BlogCard";
import { getRecentPosts } from "@/lib/posts";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export default function Home() {
  const recentPosts = getRecentPosts(3);

  return (
    <>
      <HeroSection />

      {/* Featured Posts Section — asymmetric layout */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <motion.div {...fadeInUp} className="mb-16">
          <span className="text-xs font-medium text-text-muted tracking-widest uppercase mb-3 block">
            Latest
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display">
            Recent Stories
          </h2>
        </motion.div>

        {/* Featured: first post large, rest stacked */}
        {recentPosts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured post — spans full height */}
            <div className="lg:row-span-2">
              <BlogCard key={recentPosts[0].slug} post={recentPosts[0]} index={0} featured />
            </div>
            {/* Next 2 posts stacked */}
            <div className="flex flex-col gap-6">
              {recentPosts.slice(1, 3).map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <a href="/blog" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors inline-flex items-center gap-1.5">
            View all articles
            <span className="text-lg">&rarr;</span>
          </a>
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-surface-lighter">
        <motion.div {...fadeInUp}>
          <span className="text-xs font-medium text-text-muted tracking-widest uppercase mb-3 block">
            Built with
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-display mb-10">
            Tech stack
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Next.js", desc: "Framework", icon: "N" },
            { name: "TypeScript", desc: "Language", icon: "TS" },
            { name: "Tailwind CSS", desc: "Styling", icon: "T" },
            { name: "Framer Motion", desc: "Animation", icon: "F" },
          ].map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-5 rounded-xl border border-surface-lighter bg-surface-light hover:border-accent/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm font-mono mb-3">
                {tech.icon}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-0.5">{tech.name}</h3>
              <p className="text-xs text-text-muted">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-surface-lighter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            {
              number: "47",
              label: "Articles published",
              desc: "In-depth explorations of design, code, and creativity.",
            },
            {
              number: "12K",
              label: "Readers and growing",
              desc: "A growing community of designers and developers.",
            },
            {
              number: "100%",
              label: "Craft-driven",
              desc: "Every article is written with care and attention to detail.",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <span className="text-5xl md:text-6xl font-bold font-display text-text-primary block mb-3">
                {stat.number}
              </span>
              <h3 className="text-base font-semibold text-text-primary mb-1">{stat.label}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-surface-lighter pt-16"
        >
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight mb-2">
              Stay in the loop
            </h2>
            <p className="text-sm text-text-secondary">
              New articles, once a month. No spam, unsubscribe anytime.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm whitespace-nowrap hover:bg-accent-dark transition-colors"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
