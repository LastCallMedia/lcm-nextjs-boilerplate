import { PostsTable } from "~/_components/admin/posts-table";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Management | Admin Dashboard",
  description: "View and moderate all posts in the system",
};

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Post Management</h2>
          <p className="text-muted-foreground">
            View and moderate all posts in the system
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <PostsTable />
    </div>
  );
}
