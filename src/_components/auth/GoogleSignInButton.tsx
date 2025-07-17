"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const GoogleSignInButton = ({
  isGoogleConfigured,
}: {
  isGoogleConfigured: boolean;
}) => {
  if (!isGoogleConfigured) {
    return (
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
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
