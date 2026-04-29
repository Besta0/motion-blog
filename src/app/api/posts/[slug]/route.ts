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

// GET /api/posts/[slug] — get single post
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const posts = readPosts();
  const post = posts.find((p: any) => p.slug === params.slug);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT /api/posts/[slug] — update post
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const posts = readPosts();
    const index = posts.findIndex((p: any) => p.slug === params.slug);

    if (index === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // If slug is being changed, check uniqueness
    if (body.slug && body.slug !== params.slug) {
      if (posts.some((p: any) => p.slug === body.slug)) {
        return NextResponse.json(
          { message: `A post with slug "${body.slug}" already exists` },
          { status: 409 }
        );
      }
    }

    posts[index] = {
      ...posts[index],
      ...body,
    };

    writePosts(posts);
    return NextResponse.json(posts[index]);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update post", error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] — delete post
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = readPosts();
    const index = posts.findIndex((p: any) => p.slug === params.slug);

    if (index === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const deleted = posts.splice(index, 1);
    writePosts(posts);

    return NextResponse.json({ message: "Deleted", post: deleted[0] });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete post", error: String(error) },
      { status: 500 }
    );
  }
}
