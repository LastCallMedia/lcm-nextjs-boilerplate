import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

/**
 * Protected API endpoint - Posts management
 * GET /api/protected/posts - Get user's posts
 * POST /api/protected/posts - Create a new post
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 },
      );
    }

    const posts = await db.post.findMany({
      where: {
        createdById: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      posts,
      count: posts.length,
      userId: session.user.id,
      protected: true,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as { name?: unknown };
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Post name is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    const post = await db.post.create({
      data: {
        name: name.trim(),
        createdById: session.user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        post,
        message: "Post created successfully",
        protected: true,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
