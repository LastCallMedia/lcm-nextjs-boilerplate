"use client";

import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, AlertDescription } from "~/_components/ui/alert";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/_components/ui/tabs";
import { getSafeLocale } from "~/lib/utils";

type AuthMode = "signin" | "register";
type LoginMethod = "password" | "magiclink";

export default function EnhancedLoginForm() {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const { locale } = useParams();
  const safeLocale = getSafeLocale(locale);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setStatus("idle");
    setMessage("");
  };

  const handleModeSwitch = (mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  };

  const validateForm = () => {
    if (authMode === "register") {
      if (password !== confirmPassword) {
        setStatus("error");
        setMessage("Passwords do not match");
        return false;
      }
      if (password.length < 8) {
        setStatus("error");
        setMessage("Password must be at least 8 characters");
        return false;
      }
    }
    return true;
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus("idle");

    try {
      if (authMode === "register") {
        // Register new user
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });

        const data = (await response.json()) as {
          error?: string;
          message?: string;
        };

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error ?? "Registration failed");
          return;
        }

        setStatus("success");
        setMessage("Account created successfully! You can now sign in.");
        setAuthMode("signin");
        resetForm();
      } else {
        // Sign in with credentials
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: `/${safeLocale}/dashboard`,
        });

        if (result?.error) {
          setStatus("error");
          setMessage("Invalid email or password");
        } else if (result?.ok) {
          setStatus("success");
          setMessage("Signed in successfully!");
          // Redirect will happen automatically
          window.location.href = result.url ?? `/${safeLocale}/dashboard`;
        } else {
          setStatus("error");
          setMessage("Unexpected response from authentication service.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
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
    <div className="grid gap-4" data-testid="enhanced-login-form">
      {/* Auth Mode Switcher */}
      <div className="text-center">
        {authMode === "signin" ? (
          <p className="text-muted-foreground text-sm">
            <FormattedMessage id="auth.switchToRegister" />{" "}
            <button
              type="button"
              onClick={() => handleModeSwitch("register")}
              className="text-primary underline hover:no-underline"
            >
              <FormattedMessage id="auth.register" />
            </button>
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            <FormattedMessage id="auth.switchToLogin" />{" "}
            <button
              type="button"
              onClick={() => handleModeSwitch("signin")}
              className="text-primary underline hover:no-underline"
            >
              <FormattedMessage id="auth.signIn" />
            </button>
          </p>
        )}
      </div>

      {/* Login Method Tabs */}
      <Tabs
        value={loginMethod}
        onValueChange={(value) => setLoginMethod(value as LoginMethod)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">
            <FormattedMessage id="auth.passwordLoginTab" />
          </TabsTrigger>
          <TabsTrigger value="magiclink">
            <FormattedMessage id="auth.magicLinkTab" />
          </TabsTrigger>
        </TabsList>

        {/* Password Login */}
        <TabsContent value="password">
          <form onSubmit={handlePasswordLogin} className="grid gap-4">
            {/* Email Field */}
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

            {/* Name Field (Register only) */}
            {authMode === "register" && (
              <div className="grid gap-2">
                <Label htmlFor="name">
                  <FormattedMessage id="auth.name" />
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  type="text"
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Password Field */}
            <div className="grid gap-2">
              <Label htmlFor="password">
                <FormattedMessage id="auth.password" />
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    authMode === "register"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register only) */}
            {authMode === "register" && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  <FormattedMessage id="auth.confirmPassword" />
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {authMode === "register" ? (
                    <FormattedMessage id="auth.registering" />
                  ) : (
                    <FormattedMessage id="auth.signingIn" />
                  )}
                </>
              ) : (
                <>
                  {authMode === "register" ? (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      <FormattedMessage id="auth.register" />
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      <FormattedMessage id="auth.signInWithPassword" />
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        {/* Magic Link Login */}
        <TabsContent value="magiclink">
          <form onSubmit={handleMagicLinkLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="magiclink-email">
                <FormattedMessage id="auth.email" />
              </Label>
              <Input
                id="magiclink-email"
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

            <p className="text-muted-foreground text-center text-xs">
              <FormattedMessage id="auth.magicLinkInfo" />
            </p>
          </form>
        </TabsContent>
      </Tabs>

      {/* Status Messages */}
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
    </div>
  );
}
