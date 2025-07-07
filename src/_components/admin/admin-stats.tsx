"use client";

import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Badge } from "~/_components/ui/badge";
import {
  UsersIcon,
  FileTextIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react";

export function AdminStats() {
  const { data: stats, isLoading } = api.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load stats</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-muted-foreground text-xs">
              Registered users in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileTextIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postCount}</div>
            <p className="text-muted-foreground text-xs">
              Posts created by users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <ShieldCheckIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminCount}</div>
            <p className="text-muted-foreground text-xs">
              Users with admin privileges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posts per User
            </CardTitle>
            <FileTextIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.userCount > 0
                ? (stats.postCount / stats.userCount).toFixed(1)
                : "0"}
            </div>
            <p className="text-muted-foreground text-xs">
              Average posts per user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheckIcon className="h-5 w-5" />
            <span>Recently Verified Users</span>
          </CardTitle>
          <CardDescription>
            Users who have recently verified their email addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No recently verified users
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <p className="text-sm leading-none font-medium">
                        {user.name ?? "No name"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.emailVerified ? "default" : "destructive"}
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
