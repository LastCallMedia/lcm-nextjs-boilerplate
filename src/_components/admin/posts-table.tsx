"use client";

import { api } from "~/trpc/react";
import { DataTable, type DataTableColumn } from "./data-table";
import { SearchInput } from "./search-input";
import { useAdminTable, type PostSortField } from "~/hooks/use-admin-table";
import { Badge } from "~/_components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useIntl } from "react-intl";

type Post = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
    role: "USER" | "ADMIN";
  };
};

export function PostsTable() {
  const intl = useIntl();
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
  } = useAdminTable<PostSortField>("name", "asc");

  const { data } = api.admin.getPosts.useQuery({
    page,
    pageSize,
    sortBy,
    sortOrder,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<Post>[] = [
    {
      accessorKey: "name",
      header: intl.formatMessage({ id: "postsTable.title" }),
      sortable: true,
      cell: (value) => (
        <div className="max-w-md truncate font-medium">
          {typeof value === "string"
            ? value
            : intl.formatMessage({ id: "postsTable.untitled" })}
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: intl.formatMessage({ id: "postsTable.author" }),
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium">
              {row.createdBy.name ??
                intl.formatMessage({ id: "postsTable.unknownUser" })}
            </div>
            <div className="text-muted-foreground text-sm">
              {row.createdBy.email}
            </div>
          </div>
          <Badge
            variant={row.createdBy.role === "ADMIN" ? "default" : "secondary"}
          >
            {row.createdBy.role}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: intl.formatMessage({ id: "postsTable.created" }),
      sortable: true,
      cell: (value) => {
        const date = value as Date;
        return (
          <div>
            <div className="font-medium">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
            <div className="text-muted-foreground text-sm">
              {date.toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: intl.formatMessage({ id: "postsTable.updated" }),
      sortable: true,
      cell: (value) => {
        const date = value as Date;
        return (
          <div>
            <div className="font-medium">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
            <div className="text-muted-foreground text-sm">
              {date.toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <SearchInput
        placeholder="Search posts by title or author..."
        value={search}
        onChange={setSearch}
        onPageReset={() => setPage(1)}
        inputRef={searchInputRef}
        ariaLabel="Search posts by title or author"
      />

      {/* Data Table - Only this part shows loading states */}
      <DataTable
        data={data?.posts ?? []}
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
