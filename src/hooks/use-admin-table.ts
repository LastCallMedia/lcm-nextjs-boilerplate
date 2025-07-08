/**
 * Simple, consolidated hook for admin table state management
 * Handles search, pagination, and sorting in one place for clarity
 */
import { useState, useEffect, useRef } from "react";

export function useAdminTable(
  initialSortBy = "createdAt",
  initialSortOrder: "asc" | "desc" = "desc"
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
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

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

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
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
