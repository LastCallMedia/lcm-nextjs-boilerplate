import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Button } from "~/_components/ui/button";
import { Switch } from "~/_components/ui/switch";
import { Label } from "~/_components/ui/label";
import { Separator } from "~/_components/ui/separator";
import { LegalPageEditor } from "~/_components/admin/LegalPageEditor";
import { auth } from "~/server/auth";
import { getMessages, t } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "Settings | LCM Next.js Boilerplate",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) {
    redirect(`/${locale ?? "en"}/login`);
  }
  const messages = getMessages((locale ?? "en") as "en" | "es");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {messages[t("settings.title")]}
        </h1>
        <p className="text-muted-foreground">
          {messages[t("settings.description")]}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Legal Pages Management */}
        {session.user.role === "ADMIN" && (
          <Card>
            <CardHeader>
              <CardTitle>Legal Pages</CardTitle>
              <CardDescription>
                Manage your Terms and Conditions and Privacy Policy pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalPageEditor />
            </CardContent>
          </Card>
        )}
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{messages[t("settings.account.title")]}</CardTitle>
            <CardDescription>
              {messages[t("settings.account.description")]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">
                  {messages[t("settings.account.emailNotifications")]}
                </Label>
                <div className="text-muted-foreground text-sm">
                  {messages[t("settings.account.emailNotificationsDesc")]}
                </div>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">
                  {messages[t("settings.account.twoFactor")]}
                </Label>
                <div className="text-muted-foreground text-sm">
                  {messages[t("settings.account.twoFactorDesc")]}
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                {messages[t("settings.account.enable2fa")]}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{messages[t("settings.privacy.title")]}</CardTitle>
            <CardDescription>
              {messages[t("settings.privacy.description")]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">
                  {messages[t("settings.privacy.publicProfile")]}
                </Label>
                <div className="text-muted-foreground text-sm">
                  {messages[t("settings.privacy.publicProfileDesc")]}
                </div>
              </div>
              <Switch disabled />
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label className="text-base">
                  {messages[t("settings.privacy.exportData")]}
                </Label>
                <div className="text-muted-foreground text-sm">
                  {messages[t("settings.privacy.exportDataDesc")]}
                </div>
              </div>
              <Button variant="outline" disabled>
                {messages[t("settings.privacy.exportDataButton")]}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              {messages[t("settings.danger.title")]}
            </CardTitle>
            <CardDescription>
              {messages[t("settings.danger.description")]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">
                {messages[t("settings.danger.deleteAccount")]}
              </Label>
              <div className="text-muted-foreground text-sm">
                {messages[t("settings.danger.deleteAccountDesc")]}
              </div>
            </div>
            <Button variant="destructive" disabled>
              {messages[t("settings.danger.deleteAccountButton")]}
            </Button>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>{messages[t("settings.demo.title")]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {messages[t("settings.demo.description")]}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
