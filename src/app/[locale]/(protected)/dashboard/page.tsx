import { AdminStats } from "~/_components/admin/admin-stats";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { UsersIcon, FileTextIcon } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "~/server/auth";
import { getMessages } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "Dashboard | LCM Next.js Boilerplate",
  description: "Manage users, posts, and system settings",
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;
  const messages = getMessages((locale || "en") as "en" | "es");
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{messages["dashboard.title"]}</h1>
        <p className="text-muted-foreground">
          {messages["dashboard.description"]}
        </p>
      </header>

      {/* Dashboard Stats */}
      <AdminStats />

      {/* Quick Actions */}
      {session?.user?.role === "ADMIN" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Link href={`/${locale}/admin/users`} className="cursor-pointer">
            <Button
              variant="outline"
              className="hover:bg-accent flex h-24 w-full cursor-pointer flex-col space-y-2 transition-colors"
              aria-label={messages["dashboard.users.ariaLabel"]}
            >
              <UsersIcon className="h-8 w-8" aria-hidden="true" />
              <div className="text-center">
                <div className="font-medium">
                  {messages["dashboard.users.title"]}
                </div>
                <div className="text-muted-foreground text-sm">
                  {messages["dashboard.users.description"]}
                </div>
              </div>
            </Button>
          </Link>

          <Link href={`/${locale}/admin/posts`} className="cursor-pointer">
            <Button
              variant="outline"
              className="hover:bg-accent flex h-24 w-full cursor-pointer flex-col space-y-2 transition-colors"
              aria-label={messages["dashboard.posts.ariaLabel"]}
            >
              <FileTextIcon className="h-8 w-8" aria-hidden="true" />
              <div className="text-center">
                <div className="font-medium">
                  {messages["dashboard.posts.title"]}
                </div>
                <div className="text-muted-foreground text-sm">
                  {messages["dashboard.posts.description"]}
                </div>
              </div>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
