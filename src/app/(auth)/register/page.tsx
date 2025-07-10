import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignIn } from "~/_components/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Register | LCM Next.js Boilerplate",
  description: "Create a new account to access all features.",
};

export default async function RegisterPage() {
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
            <CardTitle className="text-center text-2xl">
              Create account
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <SignIn />
            </Suspense>
          </CardContent>
        </Card>
        <p className="text-muted-foreground px-8 text-center text-sm">
          By creating an account, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    </div>
  );
}
