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
import { FormattedMessage } from "react-intl";
import { t } from "~/i18n/messages";

// RecentUser defines the type for users in the recentUsers array from getStats.
type RecentUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  emailVerified: Date | null;
};

interface AdminStatsData {
  userCount: number;
  postCount: number;
  adminCount: number;
  recentUsers: RecentUser[];
}

export function AdminStats() {
  const { data: stats, isLoading } =
    api.admin.getStats.useQuery<AdminStatsData>();

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
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id={t("adminStats.totalUsers")} />
            </CardTitle>
            <UsersIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-muted-foreground text-xs">
              <FormattedMessage id={t("adminStats.totalUsersDesc")} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id={t("adminStats.totalPosts")} />
            </CardTitle>
            <FileTextIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postCount}</div>
            <p className="text-muted-foreground text-xs">
              <FormattedMessage id={t("adminStats.totalPostsDesc")} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id={t("adminStats.adminUsers")} />
            </CardTitle>
            <ShieldCheckIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminCount}</div>
            <p className="text-muted-foreground text-xs">
              <FormattedMessage id={t("adminStats.adminUsersDesc")} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id={t("adminStats.postsPerUser")} />
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
              <FormattedMessage id={t("adminStats.postsPerUserDesc")} />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheckIcon className="h-5 w-5" />
            <span>
              <FormattedMessage id={t("adminStats.recentVerified")} />
            </span>
          </CardTitle>
          <CardDescription>
            <FormattedMessage id={t("adminStats.recentVerifiedDesc")} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <FormattedMessage id={t("adminStats.noRecentVerified")} />
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentUsers.map((user: RecentUser) => (
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
                        {user.email ?? ""}
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
                      {user.emailVerified ? (
                        <FormattedMessage id={t("adminStats.verified")} />
                      ) : (
                        <FormattedMessage id={t("adminStats.unverified")} />
                      )}
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
