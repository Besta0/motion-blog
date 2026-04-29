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

      {/* Featured Posts Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-surface-lighter/50 border border-surface-lighter text-xs font-medium text-text-secondary mb-4"
          >
            Latest Articles
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Recent{" "}
            <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Handpicked articles to inspire your next creative project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl bg-surface-light text-text-primary border border-surface-lighter font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all"
            >
              View All Articles &rarr;
            </motion.button>
          </a>
        </motion.div>
      </section>

      {/* Features / Stats Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-surface-lighter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "50+",
              label: "Articles Published",
              desc: "In-depth explorations of design, code, and creativity.",
            },
            {
              number: "10K+",
              label: "Readers & Growing",
              desc: "A growing community of designers and developers.",
            },
            {
              number: "100%",
              label: "Passion Driven",
              desc: "Every article is crafted with care and attention to detail.",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center p-8 rounded-2xl bg-surface-light border border-surface-lighter"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                className="text-4xl md:text-5xl font-bold gradient-text block mb-2"
              >
                {stat.number}
              </motion.span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{stat.label}</h3>
              <p className="text-sm text-text-secondary">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-surface-lighter"
        >
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl block mb-4"
          >
            ✉️
          </motion.span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Stay in the Loop
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Get the latest articles delivered to your inbox. No spam, just thoughtful content.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm whitespace-nowrap hover:shadow-lg hover:shadow-accent/25 transition-all"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
