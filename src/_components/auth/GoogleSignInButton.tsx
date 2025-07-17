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
import { FormattedMessage } from "react-intl";

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
              <FormattedMessage
                id="auth.signInWith"
                values={{ provider: "Google" }}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div>
                <FormattedMessage id="auth.googleNotConfigured" />
              </div>
              <div>
                <FormattedMessage id="auth.googleConfigMessage" />
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
      <FormattedMessage id="auth.signInWith" values={{ provider: "Google" }} />
    </Button>
  );
};

export default GoogleSignInButton;
