"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const ADMIN_PASSWORD_KEY = "motionblog_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      setAuthed(true);
    } else if (pathname !== "/admin") {
      router.push("/admin");
    }
    setLoading(false);
  }, [pathname, router]);

  // Login page doesn't need the admin chrome
  if (pathname === "/admin" && !authed) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/posts/new", label: "New Post" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-surface-lighter">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/posts">
              <span className="text-sm font-bold gradient-text">MotionBlog Admin</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? "text-accent"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-surface-lighter/50 border border-surface-lighter flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <Link href="/">
              <span className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                View Site &rarr;
              </span>
            </Link>
            <button
              onClick={() => {
                clearAdminToken();
                router.push("/admin");
              }}
              className="px-3 py-1.5 rounded-lg bg-surface-lighter/50 border border-surface-lighter text-xs text-text-muted hover:text-text-primary transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14">{children}</div>
    </div>
  );
}
