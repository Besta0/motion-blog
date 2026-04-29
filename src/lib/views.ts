"use client";

const STORAGE_KEY = "motionblog_views";

export interface ViewCounts {
  [slug: string]: number;
}

/** Read all view counts from localStorage */
export function getAllViewCounts(): ViewCounts {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Get view count for a single post */
export function getViewCount(slug: string): number {
  const all = getAllViewCounts();
  return all[slug] || 0;
}

/**
 * Increment view count for a post and return new count.
 * Uses a session-visit guard so a single browser session only counts
 * the first visit to each post (not re-renders or back/forward).
 */
export function incrementView(slug: string): number {
  if (typeof window === "undefined") return 0;

  // Session guard: only count once per session per post
  const sessionKey = `motionblog_visited_${slug}`;
  if (sessionStorage.getItem(sessionKey)) {
    // Already counted this session — still return the current stored count
    return getViewCount(slug);
  }

  const all = getAllViewCounts();
  const current = (all[slug] || 0) + 1;
  all[slug] = current;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  sessionStorage.setItem(sessionKey, "1");
  return current;
}

/** Get all posts sorted by view count (most viewed first) */
export function sortPostsByViews(posts: { slug: string }[]): string[] {
  const views = getAllViewCounts();
  return [...posts].sort((a, b) => {
    const aViews = views[a.slug] || 0;
    const bViews = views[b.slug] || 0;
    return bViews - aViews;
  }).map((p) => p.slug);
}
