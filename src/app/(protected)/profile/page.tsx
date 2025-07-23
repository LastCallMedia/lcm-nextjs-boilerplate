import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import ProfileClient from "./client";

export const metadata: Metadata = {
  title: "Profile | LCM Next.js Boilerplate",
  description: "Manage your profile settings and personal information.",
};

export default async function ProfilePage() {
  const session = await auth();
  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }
  // Always fetch the latest user data from the database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <ProfileClient user={user} />
    </div>
  );
}
