import { NextResponse } from "next/server";

/**
 * Public API endpoint - Application information
 * GET /api/public/info
 */
export async function GET() {
  try {
    return NextResponse.json({
      name: "LCM Next.js Boilerplate",
      description:
        "A comprehensive Next.js boilerplate with authentication, database, and modern tooling",
      version: "1.0.0",
      features: [
        "Next.js 14+ with App Router",
        "TypeScript for type safety",
        "Tailwind CSS for styling",
        "NextAuth.js for authentication",
        "Prisma for database management",
        "tRPC for type-safe APIs",
        "shadcn/ui for components",
        "Playwright for E2E testing",
      ],
      routes: {
        public: ["/", "/about", "/contact", "/posts"],
        protected: ["/dashboard", "/profile", "/settings", "/posts/create"],
        auth: ["/login"],
      },
      authentication: {
        providers: ["Magic Link Email", "Google OAuth"],
        strategies: ["NextAuth.js"],
      },
      database: {
        orm: "Prisma",
        provider: "PostgreSQL",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
