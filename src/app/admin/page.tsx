import { AdminStats } from "~/_components/admin/admin-stats";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { UsersIcon, FileTextIcon, BarChart3Icon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | LCM Next.js Boilerplate",
  description: "Manage users, posts, and system settings",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, posts, and system settings
        </p>
      </header>

      {/* Dashboard Stats */}
      <AdminStats />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/users" className="cursor-pointer">
          <Button
            variant="outline"
            className="hover:bg-accent flex h-24 w-full cursor-pointer flex-col space-y-2 transition-colors"
            aria-label="Navigate to user management"
          >
            <UsersIcon className="h-8 w-8" aria-hidden="true" />
            <div className="text-center">
              <div className="font-medium">Manage Users</div>
              <div className="text-muted-foreground text-sm">
                View and edit user accounts
              </div>
            </div>
          </Button>
        </Link>

        <Link href="/admin/posts" className="cursor-pointer">
          <Button
            variant="outline"
            className="hover:bg-accent flex h-24 w-full cursor-pointer flex-col space-y-2 transition-colors"
            aria-label="Navigate to post management"
          >
            <FileTextIcon className="h-8 w-8" aria-hidden="true" />
            <div className="text-center">
              <div className="font-medium">Manage Posts</div>
              <div className="text-muted-foreground text-sm">
                View and moderate posts
              </div>
            </div>
          </Button>
        </Link>

        <Button
          variant="outline"
          className="flex h-24 w-full flex-col space-y-2"
          disabled
          aria-label="Analytics coming soon"
        >
          <BarChart3Icon className="h-8 w-8" aria-hidden="true" />
          <div className="text-center">
            <div className="font-medium">Analytics</div>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
