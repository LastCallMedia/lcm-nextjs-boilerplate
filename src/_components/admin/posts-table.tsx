"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { DataTable, type DataTableColumn } from "./data-table";
import { Badge } from "~/_components/ui/badge";
import { Input } from "~/_components/ui/input";
import { SearchIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Search input ref for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 300);

    if (search !== debouncedSearch) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  const { data } = api.admin.getPosts.useQuery({
    page,
    pageSize,
    sortBy,
    sortOrder,
    search: debouncedSearch || undefined,
  });

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc",
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const columns: DataTableColumn<Post>[] = [
    {
      accessorKey: "name",
      header: "Post Title",
      sortable: true,
      cell: (value) => (
        <div className="max-w-md truncate font-medium">
          {typeof value === "string" ? value : "Untitled"}
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Author",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium">
              {row.createdBy.name ?? "Unknown User"}
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
      header: "Created",
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
      header: "Updated",
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
      <div className="relative max-w-sm">
        <SearchIcon
          className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          ref={searchInputRef}
          placeholder="Search posts by title or author..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page when searching
          }}
          className="cursor-text pl-9"
          aria-label="Search posts by title or author"
        />
      </div>

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
