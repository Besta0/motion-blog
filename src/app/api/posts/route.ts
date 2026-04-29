import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const POSTS_FILE = path.join(process.cwd(), "content", "posts.json");

function readPosts(): any[] {
  try {
    const raw = fs.readFileSync(POSTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writePosts(posts: any[]): void {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function checkAuth(request: Request): boolean {
  const token = request.headers.get("x-admin-token");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  return token === adminPassword;
}

// GET /api/posts — list all posts
export async function GET() {
  const posts = readPosts();
  // Return posts without full content for listing efficiency
  const summaries = posts.map(({ content, ...rest }: any) => ({
    ...rest,
    wordCount: content ? content.split(/\s+/).length : 0,
  }));
  return NextResponse.json(summaries);
}

// POST /api/posts — create new post
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, excerpt, date, category, emoji, author, tags, content } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { message: "slug, title, and content are required" },
        { status: 400 }
      );
    }

    const posts = readPosts();

    // Check slug uniqueness
    if (posts.some((p: any) => p.slug === slug)) {
      return NextResponse.json(
        { message: `A post with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const newPost = {
      slug,
      title,
      excerpt: excerpt || "",
      date: date || new Date().toISOString().split("T")[0],
      category: category || "Uncategorized",
      emoji: emoji || "📝",
      author: author || "Caleb Tam",
      tags: tags || [],
      content,
    };

    posts.push(newPost);
    writePosts(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create post", error: String(error) },
      { status: 500 }
    );
  }
}
