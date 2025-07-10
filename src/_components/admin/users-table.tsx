"use client";

import { useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { DataTable, type DataTableColumn } from "./data-table";
import { SearchInput } from "./search-input";
import { useAdminTable, type UserSortField } from "~/hooks/use-admin-table";
import { Badge } from "~/_components/ui/badge";
import { Button } from "~/_components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/_components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { MoreHorizontalIcon, TrashIcon, UserCheckIcon } from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  emailVerified: Date | null;
  image: string | null;
  _count: {
    posts: number;
    sessions: number;
  };
};

// Safe user avatar component with robust error handling
function UserAvatar({
  src,
  alt,
  fallbackText,
}: {
  src: string | null;
  alt: string;
  fallbackText: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // If no src or image error occurred, show fallback avatar
  if (!src || imageError) {
    return (
      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
        <span className="text-muted-foreground text-sm font-medium">
          {fallbackText.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-8 w-8">
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => setImageLoading(false)}
        unoptimized={
          src.includes("googleusercontent.com") || src.includes("github.com")
        }
        priority={false}
      />
      {imageLoading && (
        <div className="bg-muted absolute inset-0 h-8 w-8 animate-pulse rounded-full" />
      )}
    </div>
  );
}

export function UsersTable() {
  const {
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    searchInputRef,
    page,
    pageSize,
    setPage,
    handlePaginationChange,
    sortBy,
    sortOrder,
    handleSortChange,
  } = useAdminTable<UserSortField>("name", "asc");

  const utils = api.useUtils();

  const { data } = api.admin.getUsers.useQuery({
    page,
    pageSize,
    sortBy,
    sortOrder,
    search: debouncedSearch || undefined,
  });

  const updateUserRoleMutation = api.admin.updateUserRole.useMutation({
    onSuccess: (data, variables) => {
      void utils.admin.getUsers.invalidate();
      toast.success(
        `User role updated to ${variables.role.toLowerCase()} successfully`,
      );
    },
    onError: (error) => {
      // Handle specific error for demoting last admin
      if (error.message.includes("Cannot demote the last admin user")) {
        toast.error(
          "Cannot demote the last admin user. At least one admin must remain in the system.",
          {
            duration: 5000,
          },
        );
      } else if (error.message.includes("Cannot demote your own account")) {
        toast.error(
          "You cannot change your own role. Ask another admin to modify your permissions.",
          {
            duration: 5000,
          },
        );
      } else {
        toast.error(
          error.message || "Failed to update user role. Please try again.",
          {
            duration: 4000,
          },
        );
      }
    },
  });

  const deleteUserMutation = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      void utils.admin.getUsers.invalidate();
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user. Please try again.", {
        duration: 4000,
      });
    },
  });

  const handleRoleUpdate = (userId: string, newRole: "USER" | "ADMIN") => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };

  const handleUserDelete = (userId: string) => {
    deleteUserMutation.mutate({ userId });
  };

  const columns: DataTableColumn<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      sortable: true,
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <UserAvatar
            src={row.image}
            alt={row.name ?? "User"}
            fallbackText={row.name ?? row.email ?? "U"}
          />
          <div>
            <div className="font-medium">
              {typeof value === "string" && value ? value : "No name"}
            </div>
            <div className="text-muted-foreground text-sm">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      sortable: true,
      cell: (value) => (
        <Badge variant={value === "ADMIN" ? "default" : "secondary"}>
          {String(value)}
        </Badge>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: "Email Verified",
      sortable: true,
      cell: (value) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      accessorKey: "_count.posts",
      header: "Posts",
      cell: (value, row) => {
        const count = row._count;
        return count?.posts ?? 0;
      },
    },
    {
      accessorKey: "_count.sessions",
      header: "Sessions",
      cell: (value, row) => {
        const count = row._count;
        return count?.sessions ?? 0;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 cursor-pointer p-0"
              aria-label="Open user actions menu"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                handleRoleUpdate(
                  row.id,
                  row.role === "ADMIN" ? "USER" : "ADMIN",
                )
              }
              disabled={updateUserRoleMutation.isPending}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <UserCheckIcon className="mr-2 h-4 w-4" />
              {row.role === "ADMIN" ? "Make User" : "Make Admin"}
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the user account and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleUserDelete(row.id)}
                    className="cursor-pointer bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <SearchInput
        placeholder="Search users by name or email..."
        value={search}
        onChange={setSearch}
        onPageReset={() => setPage(1)}
        inputRef={searchInputRef}
        ariaLabel="Search users by name or email"
      />

      {/* Data Table - Only this part shows loading states */}
      <DataTable
        data={data?.users ?? []}
        columns={columns}
        pagination={
          data?.pagination ?? {
            page: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
          }
        }
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        isLoading={!data && !isSearching}
        isSearching={isSearching && !!data}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}
