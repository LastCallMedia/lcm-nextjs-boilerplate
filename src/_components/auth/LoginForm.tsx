"use client";

import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, AlertDescription } from "~/_components/ui/alert";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import { getSafeLocale } from "~/lib/utils";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const { locale } = useParams();
  const safeLocale = getSafeLocale(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: `/${safeLocale}/dashboard`,
      });

      if (result?.error) {
        console.error("SignIn error:", result.error);
        setStatus("error");
        setMessage(`Failed to send magic link: ${result.error}`);
      } else if (result?.ok) {
        setStatus("success");
        setMessage("Magic link sent! Check your email to sign in.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Unexpected response from authentication service.");
      }
    } catch (error) {
      console.error("Caught error:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">
          <FormattedMessage id="auth.email" />
        </Label>
        <Input
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <FormattedMessage id="auth.sending" />
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            <FormattedMessage id="auth.sendMagicLink" />
          </>
        )}
      </Button>

      {status === "success" && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <p className="text-muted-foreground text-center text-xs">
        <FormattedMessage id="auth.magicLinkInfo" />
      </p>
    </form>
  );
}
