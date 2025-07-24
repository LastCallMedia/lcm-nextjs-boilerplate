import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignIn from "~/_components/auth/SignIn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { auth } from "~/server/auth";
import { getMessages } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "Login | LCM Next.js Boilerplate",
  description: "Sign in to your account to access protected features.",
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const session = await auth();
  const { locale } = await params;
  const messages = getMessages((locale ?? "en") as "en" | "es");

  // Redirect if already logged in
  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              {messages["login.title"]}
            </CardTitle>
            <CardDescription className="text-center">
              {messages["login.description"]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <SignIn />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
