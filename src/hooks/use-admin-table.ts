/**
 * Simple, consolidated hook for admin table state management
 * Handles search, pagination, and sorting in one place for clarity
 */
import { useState, useEffect, useRef } from "react";

export type UserSortField =
  | "id"
  | "name"
  | "email"
  | "role"
  | "createdAt"
  | "updatedAt"
  | "emailVerified";
export type PostSortField = "id" | "name" | "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export function useAdminTable<T extends string>(
  defaultSortBy: T,
  defaultSortOrder: SortOrder = "asc",
) {
  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state
  const [sortBy, setSortBy] = useState<T>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

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

  // Simple handlers
  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: T, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return {
    // Search
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    searchInputRef,
    // Pagination
    page,
    pageSize,
    setPage,
    handlePaginationChange,
    // Sorting
    sortBy,
    sortOrder,
    handleSortChange,
  };
}
