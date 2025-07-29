import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { getMessages } from "~/i18n/messages";
import ProfileClient from "~/app/[locale]/(protected)/profile/client";

export const metadata: Metadata = {
  title: "Profile | LCM Next.js Boilerplate",
  description: "Manage your profile settings and personal information.",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  // Redirect if not authenticated
  if (!session) {
    redirect(`/${locale ?? "en"}/login`);
  }
  // Fetch the latest user data via tRPC API
  const user = await api.admin.getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const messages = getMessages((locale ?? "en") as "en" | "es");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {messages["profile.title"]}
        </h1>
        <p className="text-muted-foreground">
          {messages["profile.description"]}
        </p>
      </div>
      <ProfileClient user={user} messages={messages} />
    </div>
  );
}
