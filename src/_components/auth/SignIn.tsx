"use client";

import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { FormattedMessage } from "react-intl";
import { Button } from "../ui/button";

const SignIn = () => {
  const { data: session, status } = useSession();

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <Button disabled>
        <FormattedMessage id="common.loading" />
      </Button>
    );
  }

  // If user is signed in, show sign out button
  if (session) {
    return (
      <Button>
        <Link href="/api/auth/signout">
          <FormattedMessage id="auth.signOut" />
        </Link>
      </Button>
    );
  }

  // Show sign in button (Google auth configuration is handled server-side)
  return (
    <Button>
      <Link href="/api/auth/signin">
        <FormattedMessage
          id="auth.signInWith"
          values={{ provider: "Google" }}
        />
      </Link>
    </Button>
  );
};

export default SignIn;
