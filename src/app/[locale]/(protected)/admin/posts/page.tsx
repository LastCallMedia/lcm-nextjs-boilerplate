import { PostsTable } from "~/_components/admin/posts-table";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { getMessages, t } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "Post Management | Admin Dashboard",
  description: "View and moderate all posts in the system",
};

export default async function AdminPostsPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages((locale ?? "en") as "en" | "es");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {messages[t("adminPosts.title")]}
          </h2>
          <p className="text-muted-foreground">
            {messages[t("adminPosts.description")]}
          </p>
        </div>
        <Link href={`/${locale}/dashboard`}>
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {messages[t("adminPosts.backToDashboard")]}
          </Button>
        </Link>
      </div>

      <PostsTable />
    </div>
  );
}
