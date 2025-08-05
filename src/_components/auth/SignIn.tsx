"use client";

import { FormattedMessage } from "react-intl";
import GoogleSignInButton from "~/_components/auth/GoogleSignInButton";
import EnhancedLoginForm from "~/_components/auth/EnhancedLoginForm";

const isGoogleConfigured =
  String(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED).toLowerCase() === "true";

const SignIn = () => {
  // Show enhanced login form with email/password, magic link, and Google options
  return (
    <div className="grid gap-4">
      {/* Enhanced Login Form with email/password and magic link */}
      <EnhancedLoginForm />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            <FormattedMessage id="auth.orContinueWith" />
          </span>
        </div>
      </div>

      {/* Google Sign In */}
      <GoogleSignInButton isGoogleConfigured={isGoogleConfigured} />
    </div>
  );
};

export default SignIn;
