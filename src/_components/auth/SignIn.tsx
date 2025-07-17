import React from "react";
import LoginForm from "./LoginForm";
import GoogleSignInButton from "./GoogleSignInButton";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";

const SignIn = async () => {
  const isGoogleConfigured = isGoogleAuthConfigured();

  // Show login form with email magic link and Google option
  return (
    <div className="grid gap-4">
      {/* Magic Link Email Form */}
      <LoginForm />

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
      <GoogleSignInButton isGoogleConfigured={isGoogleConfigured} />
    </div>
  );
};

export default SignIn;
