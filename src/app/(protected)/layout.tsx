import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | LCM Next.js Boilerplate",
    default: "Protected Area | LCM Next.js Boilerplate",
  },
  description: "Protected pages requiring authentication",
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
