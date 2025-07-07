"use client";

import * as React from "react";
import { Button } from "~/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function renderCellValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return "";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return "";
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isSearching?: boolean;
}

export interface DataTableColumn<T> {
  accessorKey: string;
  header: string;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  onPaginationChange,
  onSortChange,
  isLoading = false,
  sortBy,
  sortOrder,
  isSearching = false,
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      onSortChange(columnKey, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(columnKey, "asc");
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div
        className="rounded-md border"
        role="region"
        aria-label="Data table"
        tabIndex={0}
      >
        <Table role="table" aria-describedby="table-pagination">
          <TableHeader>
            <TableRow role="row">
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={
                    column.sortable
                      ? "hover:bg-muted/50 cursor-pointer select-none"
                      : ""
                  }
                  onClick={() =>
                    column.sortable && handleSort(column.accessorKey)
                  }
                  role={
                    column.sortable ? "columnheader button" : "columnheader"
                  }
                  aria-sort={
                    column.sortable && sortBy === column.accessorKey
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (
                      column.sortable &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      handleSort(column.accessorKey);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="text-xs">
                        {getSortIcon(column.accessorKey)}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : isSearching ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Searching...
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, index) => {
                const rowData = row as Record<string, unknown>;
                let uniqueKey: string;

                if (
                  typeof rowData.id === "string" ||
                  typeof rowData.id === "number"
                ) {
                  uniqueKey = String(rowData.id);
                } else if (typeof rowData.email === "string") {
                  uniqueKey = rowData.email;
                } else {
                  uniqueKey = `row-${index}`;
                }

                return (
                  <TableRow key={uniqueKey} role="row">
                    {columns.map((column) => {
                      const value = rowData[column.accessorKey];
                      return (
                        <TableCell
                          key={`${uniqueKey}-${column.accessorKey}`}
                          role="cell"
                        >
                          {column.cell
                            ? column.cell(value, row)
                            : renderCellValue(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between"
        id="table-pagination"
        role="navigation"
        aria-label="Table pagination"
      >
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground text-sm" aria-live="polite">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.page * pagination.pageSize,
              pagination.totalCount,
            )}{" "}
            of {pagination.totalCount} results
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="page-size-select" className="text-sm font-medium">
              Rows per page
            </label>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => onPaginationChange(1, parseInt(value))}
            >
              <SelectTrigger
                className="h-8 w-[70px] cursor-pointer"
                id="page-size-select"
                aria-label="Select rows per page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={pageSize.toString()}
                    className="cursor-pointer"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPaginationChange(pagination.page - 1, pagination.pageSize)
                }
                disabled={pagination.page <= 1}
                className="cursor-pointer disabled:cursor-not-allowed"
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPaginationChange(pagination.page + 1, pagination.pageSize)
                }
                disabled={pagination.page >= pagination.totalPages}
                className="cursor-pointer disabled:cursor-not-allowed"
                aria-label="Go to next page"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
