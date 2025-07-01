import Link from "next/link";
import React from "react";
import { auth } from "~/server/auth";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";
import { Button } from "../ui/button";
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
      <Button>
        <Link href="/api/auth/signout">Sign out</Link>
      </Button>
    );
  }

  // If Google auth is not configured, show disabled button with tooltip
  if (!isGoogleConfigured) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled
              variant="outline"
              className="cursor-not-allowed opacity-50"
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
    );
  }

  // Google auth is configured, show normal sign in button
  return (
    <Button>
      <Link href="/api/auth/signin">Sign in with Google</Link>
    </Button>
  );
};

export default SignIn;
