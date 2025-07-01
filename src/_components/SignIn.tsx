import Link from "next/link";
import React from "react";
import { auth } from "~/server/auth";
import { Button } from "./ui/button";

const SignIn = async () => {
  const session = await auth();
  return (
    <Button>
      <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
        {session ? "Sign out" : "Sign in"}
      </Link>
    </Button>
  );
};

export default SignIn;
