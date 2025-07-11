import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignIn } from "~/_components/auth";
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
  title: "Login | LCM Next.js Boilerplate",
  description: "Sign in to your account to access protected features.",
};

export default async function LoginPage() {
  const session = await auth();

  // Redirect if already logged in
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a magic link or use Google to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <SignIn />
            </Suspense>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" asChild>
            <Link href="/">Continue as Guest</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
