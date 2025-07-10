import { NextResponse } from "next/server";
import { auth } from "~/server/auth";

/**
 * Protected API endpoint - User information
 * GET /api/protected/user
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

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      session: {
        expires: session.expires,
      },
      authenticated: true,
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
