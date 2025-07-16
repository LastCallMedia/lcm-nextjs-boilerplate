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
import { Badge } from "~/_components/ui/badge";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/_components/ui/avatar";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Profile | LCM Next.js Boilerplate",
  description: "Manage your profile settings and personal information.",
};

export default async function ProfilePage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Overview
              <Badge variant="secondary">Protected</Badge>
            </CardTitle>
            <CardDescription>Your current profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? "User"}
                />
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium">
                  {user?.name ?? "Anonymous User"}
                </h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-muted-foreground text-xs">User ID</Label>
                <p className="font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information (Note: This is a demo - changes
              won&apos;t be saved)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  defaultValue={user?.name ?? ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue={user?.email ?? ""}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about yourself..."
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name ?? "User"}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" disabled>
                    Change Picture
                  </Button>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Profile picture is managed by your OAuth provider
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" disabled>
                Cancel
              </Button>
              <Button disabled>Save Changes</Button>
            </div>

            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Demo Note</h4>
              <p className="text-muted-foreground text-sm">
                This profile page demonstrates a protected route with user data
                display. In a real application, you would implement form
                handling, validation, and database updates for profile changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
