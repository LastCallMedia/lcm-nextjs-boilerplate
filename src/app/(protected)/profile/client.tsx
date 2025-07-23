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
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function ProfileClient({ user }: { user: User }) {
  const { update: updateSession } = useSession();
  const [name, setName] = useState(user?.name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.image ?? undefined,
  );
  const avatarRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProfile = api.admin.updateProfileImage.useMutation({
    onSuccess: async (data) => {
      setAvatarPreview(data.image ?? undefined);
      setError(null);
      setLoading(false);
      toast.success("Profile updated successfully");
      // Trigger NextAuth session update
      if (updateSession) {
        await updateSession();
      }
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
      toast.error(err.message || "Failed to update profile. Please try again.");
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
            Profile Overview
          </CardTitle>
          <CardDescription>Your current profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={avatarPreview ?? undefined}
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
                {name ?? user?.name ?? "Anonymous User"}
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
            Update your profile information and avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
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
                <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="avatar">Avatar Image</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={avatarPreview ?? undefined}
                    alt={name ?? user?.name ?? "User"}
                  />
                  <AvatarFallback>
                    {(name || user?.name)?.charAt(0) ??
                      user?.email?.charAt(0) ??
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="text-muted-foreground block cursor-pointer text-sm"
                    ref={avatarRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="reset" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
            {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
          </form>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h4 className="mb-2 font-medium">Demo Note</h4>
            <p className="text-muted-foreground text-sm">
              This profile page demonstrates a protected route with user data
              display. In a real application, you would implement form handling,
              validation, and database updates for profile changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
