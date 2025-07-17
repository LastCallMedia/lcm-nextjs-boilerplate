import { UsersTable } from "~/_components/admin/users-table";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { getMessages } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "View and manage all user accounts in the system",
};

export default function AdminUsersPage({
  params,
}: {
  params?: { locale?: string };
}) {
  const locale = params?.locale ?? "en";
  const messages = getMessages(locale as "en" | "es");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{messages["adminUsers.title"]}</h2>
          <p className="text-muted-foreground">
            {messages["adminUsers.description"]}
          </p>
        </div>
        <Link href={`/${locale}/dashboard`}>
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {messages["adminUsers.backToDashboard"]}
          </Button>
        </Link>
      </div>

      <UsersTable />
    </div>
  );
}
