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
      <Link 
        href="/api/auth/signout"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
      >
        Sign out
      </Link>
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
    <Link 
      href="/api/auth/signin"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
    >
      Sign in with Google
    </Link>
  );
};

export default SignIn;
