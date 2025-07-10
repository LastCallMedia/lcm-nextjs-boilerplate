import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Logout | LCM Next.js Boilerplate",
  description: "Sign out of your account.",
};

export default async function LogoutPage() {
  const session = await auth();

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Sign out</CardTitle>
            <CardDescription className="text-center">
              Are you sure you want to sign out?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="text-muted-foreground text-center text-sm">
              You are currently signed in as:{" "}
              <span className="font-medium">{session.user?.email}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button asChild>
                <Link href="/api/auth/signout">Sign out</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
