"use client";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { t } from "~/i18n/messages";
import { Button } from "~/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/_components/ui/tooltip";
import { getSafeLocale } from "~/lib/utils";

export function GoogleSignInButton({
  isGoogleConfigured,
}: {
  isGoogleConfigured: boolean;
}) {
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
                id={t("auth.signInWith")}
                values={{ provider: "Google" }}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div>
                <FormattedMessage id={t("auth.googleNotConfigured")} />
              </div>
              <div>
                <FormattedMessage id={t("auth.googleConfigMessage")} />
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
      <FormattedMessage
        id={t("auth.signInWith")}
        values={{ provider: "Google" }}
      />
    </Button>
  );
}
