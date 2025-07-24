import { redirect } from "next/navigation";
import { getSafeLocale } from "~/lib/utils";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const safeLocale = getSafeLocale(locale);
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session) {
    redirect(`/${safeLocale}/login`);
  }
  if (session.user?.role !== "ADMIN") {
    redirect(`/${safeLocale}/dashboard`);
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
