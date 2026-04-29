import postsData from "../../content/posts.json";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  emoji: string;
  author: string;
  tags: string[];
  coverImage?: string;
  content: string;
}

const WORDS_PER_MINUTE = 200;

export function readingTime(content: string): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return `${minutes} min read`;
}

export function readingTimeMinutes(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

export function getAllPosts(): Post[] {
  return postsData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return postsData.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  return postsData
    .filter((post) => post.category.toLowerCase() === category.toLowerCase())
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getCategories(): string[] {
  const categories = new Set(postsData.map((post) => post.category));
  return Array.from(categories);
}

export function getRecentPosts(count: number = 3): Post[] {
  return getAllPosts().slice(0, count);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  postsData.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): Post[] {
  return postsData
    .filter((post) => post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedPosts(currentSlug: string, count: number = 2): Post[] {
  const current = getPostBySlug(currentSlug);
  if (!current || !current.tags) return [];

  const related = postsData
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        post.tags?.some((tag) => current.tags!.includes(tag))
    )
    .sort((a, b) => {
      const aMatches = a.tags?.filter((tag) => current.tags!.includes(tag)).length || 0;
      const bMatches = b.tags?.filter((tag) => current.tags!.includes(tag)).length || 0;
      return bMatches - aMatches;
    });

  return related.slice(0, count);
}
