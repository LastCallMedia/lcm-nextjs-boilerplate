import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <main
      className="container mx-auto py-6"
      role="main"
      aria-label="Protected Content"
    >
      <section aria-label="Protected content">{children}</section>
    </main>
  );
}
