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
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Settings | LCM Next.js Boilerplate",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account security and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <div className="text-muted-foreground text-sm">
                  Receive email notifications for important updates
                </div>
              </div>
              <Switch defaultChecked disabled />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <div className="text-muted-foreground text-sm">
                  Add an extra layer of security to your account
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Control your privacy and data sharing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Public Profile</Label>
                <div className="text-muted-foreground text-sm">
                  Make your profile visible to other users
                </div>
              </div>
              <Switch disabled />
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label className="text-base">Export Data</Label>
                <div className="text-muted-foreground text-sm">
                  Download a copy of your account data
                </div>
              </div>
              <Button variant="outline" disabled>
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Delete Account</Label>
              <div className="text-muted-foreground text-sm">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </div>
            </div>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Demo Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              This settings page demonstrates a protected route with user
              settings management. In a real application, you would implement
              form handling, validation, and database updates for these
              settings. (Note: This is a demo - changes won&apos;t be saved)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
