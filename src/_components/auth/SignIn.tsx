import React from "react";
import { auth, signIn, signOut } from "~/server/auth";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";
import { Button } from "../ui/button";
import MagicLinkForm from "./MagicLinkForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const SignIn = async () => {
  const session = await auth();
  const isGoogleConfigured = isGoogleAuthConfigured();

  // If user is signed in, show sign out button
  if (session) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" className="cursor-pointer">
          Sign out
        </Button>
      </form>
    );
  }

  // Show login form with email magic link and Google option
  return (
    <div className="grid gap-4">
      {/* Magic Link Email Form */}
      <MagicLinkForm />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign In */}
      {!isGoogleConfigured ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled
                variant="outline"
                className="w-full cursor-not-allowed opacity-50"
              >
                Sign in with Google
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div>Google authentication is not configured.</div>
                <div>
                  Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment
                  variables.
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" variant="outline" className="w-full">
            Sign in with Google
          </Button>
        </form>
      )}
    </div>
  );
};

export default SignIn;
