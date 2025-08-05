import { UsersTable } from "~/_components/admin/users-table";
import { Button } from "~/_components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { getMessages, t } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "View and manage all user accounts in the system",
};

export default async function AdminUsersPage({
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
            {messages[t("adminUsers.title")]}
          </h2>
          <p className="text-muted-foreground">
            {messages[t("adminUsers.description")]}
          </p>
        </div>
        <Link href={`/${locale}/dashboard`}>
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {messages[t("adminUsers.backToDashboard")]}
          </Button>
        </Link>
      </div>

      <UsersTable />
    </div>
  );
}
