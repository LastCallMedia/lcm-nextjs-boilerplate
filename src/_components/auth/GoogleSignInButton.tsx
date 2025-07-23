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
import { useParams } from "next/navigation";
import { getSafeLocale } from "~/lib/utils";

const GoogleSignInButton = ({
  isGoogleConfigured,
}: {
  isGoogleConfigured: boolean;
}) => {
  const { locale } = useParams();
  const safeLocale = getSafeLocale(locale);

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
      onClick={() =>
        signIn("google", { callbackUrl: `/${safeLocale}/dashboard` })
      }
    >
      <FormattedMessage id="auth.signInWith" values={{ provider: "Google" }} />
    </Button>
  );
};

export default GoogleSignInButton;
