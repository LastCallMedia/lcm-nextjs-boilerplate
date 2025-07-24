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
import { getMessages } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "Profile | LCM Next.js Boilerplate",
  description: "Manage your profile settings and personal information.",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect(`/${locale ?? "en"}/login`);
  }

  const user = session.user;
  const messages = getMessages((locale ?? "en") as "en" | "es");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {messages["profile.title"]}
        </h1>
        <p className="text-muted-foreground">
          {messages["profile.description"]}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {messages["profile.overview"]}
              <Badge variant="secondary">{messages["profile.protected"]}</Badge>
            </CardTitle>
            <CardDescription>
              {messages["profile.overviewDescription"]}
            </CardDescription>
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
                <Label className="text-muted-foreground text-xs">
                  {messages["profile.userId"]}
                </Label>
                <p className="font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{messages["profile.settings"]}</CardTitle>
            <CardDescription>
              {messages["profile.settingsDescription"]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{messages["profile.fullName"]}</Label>
                <Input
                  id="name"
                  placeholder={messages["profile.fullName"]}
                  defaultValue={user?.name ?? ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{messages["profile.email"]}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={messages["profile.email"]}
                  defaultValue={user?.email ?? ""}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{messages["profile.bio"]}</Label>
              <textarea
                id="bio"
                className={[
                  "border-input bg-background ring-offset-background",
                  "placeholder:text-muted-foreground focus-visible:ring-ring flex",
                  "min-h-[80px] w-full rounded-md border px-3 py-2",
                  "text-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                  "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
                placeholder={messages["profile.bioPlaceholder"]}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>{messages["profile.picture"]}</Label>
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
                    {messages["profile.changePicture"]}
                  </Button>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {messages["profile.pictureNote"]}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" disabled>
                {messages["profile.cancel"]}
              </Button>
              <Button disabled>{messages["profile.save"]}</Button>
            </div>

            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-2 font-medium">
                {messages["profile.demoNoteTitle"]}
              </h4>
              <p className="text-muted-foreground text-sm">
                {messages["profile.demoNoteDescription"]}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
