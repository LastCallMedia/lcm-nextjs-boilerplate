import { UsersTable } from "~/_components/admin/users-table";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "View and manage all user accounts in the system",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            View and manage all user accounts in the system
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <UsersTable />
    </div>
  );
}
