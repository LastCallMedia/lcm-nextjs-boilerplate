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
    redirect("/profile");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Sign in</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <SignIn />
            </Suspense>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue as guest
                </span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">Continue as Guest</Link>
            </Button>
          </CardContent>
        </Card>
        <p className="text-muted-foreground px-8 text-center text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
