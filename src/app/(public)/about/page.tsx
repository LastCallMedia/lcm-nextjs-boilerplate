import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Badge } from "~/_components/ui/badge";

export const metadata: Metadata = {
  title: "About | LCM Next.js Boilerplate",
  description: "Learn more about the LCM Next.js Boilerplate and its features.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="text-muted-foreground">
          Learn more about the LCM Next.js Boilerplate
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Project Overview
              <Badge variant="outline">Public</Badge>
            </CardTitle>
            <CardDescription>
              A comprehensive Next.js boilerplate for modern web applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Purpose</h4>
              <p className="text-muted-foreground text-sm">
                This boilerplate provides a solid foundation for building
                scalable, modern web applications with Next.js, featuring
                authentication, database integration, and best practices.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Tech Stack</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js 14+</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Prisma</Badge>
                <Badge variant="secondary">NextAuth.js</Badge>
                <Badge variant="secondary">tRPC</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Everything you need to build a modern web application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Authentication with NextAuth.js</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">
                  Database integration with Prisma
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Type-safe API with tRPC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Modern UI with shadcn/ui</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">E2E testing with Playwright</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Responsive design</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Quick steps to start using this boilerplate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">For Visitors</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Explore public routes without signing in</li>
                  <li>• View posts and content</li>
                  <li>• Check out the responsive design</li>
                  <li>• Test accessibility features</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">For Authenticated Users</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Access protected profile and settings</li>
                  <li>• Create and manage posts</li>
                  <li>• Customize profile settings</li>
                  <li>• Use advanced features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
