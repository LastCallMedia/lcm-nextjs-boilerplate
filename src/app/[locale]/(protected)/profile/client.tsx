"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/_components/ui/avatar";
import type { User } from "next-auth";

interface ProfileClientProps {
  user: User;
  messages: Record<string, string>;
}
import { FormattedMessage } from "react-intl";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { LanguageSelectorWrapper } from "~/app/[locale]/(protected)/profile/LanguageSelectorClient";

export default function ProfileClient({ user, messages }: ProfileClientProps) {
  const { update: updateSession } = useSession();
  const [name, setName] = useState(user?.name ?? "");
  const [serverAvatar, setServerAvatar] = useState<string | undefined>(
    user?.image ?? undefined,
  );
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(undefined);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProfile = api.admin.updateProfileImage.useMutation({
    onSuccess: async (data, variables) => {
      let imageUrl = serverAvatar;
      if (typeof data.image === "string" && data.image.trim() !== "") {
        imageUrl = `${data.image}${data.image.includes("?") ? "&" : "?"}t=${Date.now()}`;
      }
      setServerAvatar(imageUrl);
      setLocalAvatar(undefined); // clear local preview after save
      setName(variables.name); // update name state as well
      setError(null);
      setLoading(false);
      // Reset file input so user can re-upload the same file if needed
      if (avatarRef.current) {
        avatarRef.current.value = "";
      }
      toast.success(
        <FormattedMessage
          id="profile.updateSuccess"
          defaultMessage="Profile updated successfully"
        />,
      );
      // Trigger NextAuth session update
      if (updateSession) {
        await updateSession();
      }
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
      toast.error(
        err.message ?? (
          <FormattedMessage
            id="profile.updateError"
            defaultMessage="Failed to update profile. Please try again."
          />
        ),
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let avatarData: { name: string; type: string; data: string } | undefined;
    const file = avatarRef.current?.files?.[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      // Use a streaming approach for base64 conversion
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.length; i += 16384) {
        binary += String.fromCharCode(...uint8Array.subarray(i, i + 16384));
      }
      const base64String = btoa(binary);
      avatarData = {
        name: file.name,
        type: file.type,
        data: base64String,
      };
    }
    updateProfile.mutate({ name, email: user.email ?? "", avatar: avatarData });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile Overview */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FormattedMessage
              id="profile.overview"
              defaultMessage="Profile Overview"
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="profile.overviewDescription"
              defaultMessage="Your current profile information"
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={localAvatar ?? serverAvatar ?? undefined}
                alt={name ?? user?.name ?? "User"}
              />
              <AvatarFallback className="text-lg">
                {(name || user?.name)?.charAt(0) ??
                  user?.email?.charAt(0) ??
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium">
                {name ?? user?.name ?? (
                  <FormattedMessage
                    id="profile.anonymous"
                    defaultMessage="Anonymous User"
                  />
                )}
              </h3>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <Label className="text-muted-foreground text-xs">
                <FormattedMessage
                  id="profile.userId"
                  defaultMessage="User ID"
                />
              </Label>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>
          </div>
          <div className="space-y-2">
            {/* Language Selector */}
            <LanguageSelectorWrapper messages={messages} />
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            <FormattedMessage
              id="profile.settings"
              defaultMessage="Profile Settings"
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="profile.settingsDescription"
              defaultMessage="Update your profile information and avatar"
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <FormattedMessage
                    id="profile.fullName"
                    defaultMessage="Full Name"
                  />
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="border-input bg-background ring-offset-background min-h-[40px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <FormattedMessage id="profile.email" defaultMessage="Email" />
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="border-input bg-background ring-offset-background min-h-[40px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  defaultValue={user?.email ?? ""}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">
                <FormattedMessage
                  id="profile.picture"
                  defaultMessage="Avatar Image"
                />
              </Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={localAvatar ?? serverAvatar ?? undefined}
                    alt={name ?? user?.name ?? "User"}
                  />
                  <AvatarFallback>
                    {(name || user?.name)?.charAt(0) ??
                      user?.email?.charAt(0) ??
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <label htmlFor="avatar" className="block">
                    <div
                      className="border-input bg-muted/30 hover:border-primary focus-within:border-primary text-muted-foreground hover:bg-muted/50 focus-within:bg-muted/50 flex min-w-[200px] cursor-pointer items-center gap-2 rounded-lg border-2 border-dotted px-4 py-3 text-sm shadow-sm transition-colors outline-none"
                      tabIndex={0}
                    >
                      <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        ref={avatarRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLocalAvatar(URL.createObjectURL(file));
                          }
                        }}
                        disabled={loading}
                      />
                      <span className="truncate select-none">
                        <FormattedMessage
                          id="profile.chooseFile"
                          defaultMessage="Choose File"
                        />
                        {avatarRef.current?.files?.[0]?.name
                          ? `: ${avatarRef.current.files[0].name}`
                          : ` `}
                        <FormattedMessage
                          id="profile.noFile"
                          defaultMessage="No file chosen"
                        />
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="reset" disabled={loading}>
                <FormattedMessage id="profile.cancel" defaultMessage="Cancel" />
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <FormattedMessage
                    id="common.loading"
                    defaultMessage="Saving..."
                  />
                ) : (
                  <FormattedMessage
                    id="profile.save"
                    defaultMessage="Save Changes"
                  />
                )}
              </Button>
            </div>
            {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
