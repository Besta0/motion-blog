"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAdminToken, setAdminToken } from "./layout";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Already logged in
    if (getAdminToken()) {
      router.push("/admin/posts");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setAdminToken(password);
        router.push("/admin/posts");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text mb-2">Admin Login</h1>
          <p className="text-sm text-text-secondary">
            Enter your admin password to manage the blog.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-lighter text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-50 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-text-muted hover:text-accent transition-colors"
          >
            &larr; Back to blog
          </a>
        </div>
      </motion.div>
    </div>
  );
}
