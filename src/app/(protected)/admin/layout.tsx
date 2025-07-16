import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Check if user has admin role
  if (session.user.role !== "ADMIN") {
    redirect("/"); // Redirect to home if not admin
  }

  return (
    <main
      className="container mx-auto py-6"
      role="main"
      aria-label="Admin Dashboard"
    >
      <section aria-label="Admin content">{children}</section>
    </main>
  );
}
