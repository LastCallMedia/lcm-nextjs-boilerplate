import { NextResponse } from "next/server";

/**
 * Public API endpoint - No authentication required
 * GET /api/public/status
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      message: "LCM Next.js Boilerplate API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      public: true,
      authenticated: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
