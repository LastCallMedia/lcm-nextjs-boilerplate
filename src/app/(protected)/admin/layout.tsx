import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard");
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
