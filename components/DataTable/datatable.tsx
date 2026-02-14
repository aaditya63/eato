"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Download,
  EyeIcon,
  Trash2,
  ChevronsUpDown,
  Pencil,
  FilterIcon,
  XIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PopoverClose } from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Types & Interfaces ---

export interface Column<T> {
  header: string;
  accessorKey: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  options?: string[];
  cell?: (row: T) => React.ReactNode;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasPrev: boolean;
  hasNext: boolean;
  limit?: number; 
}

export interface FetchParams {
  page: number;
  search: string;
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  filters: Record<string, string>;
  limit: number; 
}

export interface Permissions {
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface BulkAction<T> {
  label: string;
  onClick: (selectedRows: T[]) => void;
}

export interface ReusableGridProps<T> {
  columns?: Column<T>[];
  data?: T[];
  pagination?: PaginationState;
  loading?: boolean;
  onFetchData?: (params: FetchParams) => void;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => Promise<void> | void;
  onStatusChange?: (row: T, newValue: boolean) => void;
  permissions?: Permissions;
  uniqueId?: keyof T;
  statusKey:string;
  bulkActions?: BulkAction<T>[];
}

interface SortConfig {
  key: string | null;
  direction: "asc" | "desc" | null;
}

export default function ReusableGrid<T extends Record<string, any>>({
  columns = [],
  data = [],
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasPrev: false,
    hasNext: false,
    limit: 10,
  },
  loading = false,
  onFetchData,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  permissions = { canEdit: true, canDelete: true },
  uniqueId = "id" as keyof T,
  bulkActions,
}: ReusableGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState<number>(pagination.limit || 10); // NEW LIMIT

  // --- Row Selection ---
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const hasBulkActions = bulkActions && bulkActions.length > 0;

  // Clear selection when data (page) changes
  useEffect(() => {
    setSelectedRowIds(new Set());
  }, [data]);

  const isAllSelected = data.length > 0 && data.every((row) => selectedRowIds.has(String(row[uniqueId])));
  const isSomeSelected = data.some((row) => selectedRowIds.has(String(row[uniqueId]))) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds(new Set());
    } else {
      const allIds = new Set(data.map((row) => String(row[uniqueId])));
      setSelectedRowIds(allIds);
    }
  };

  const toggleSelectRow = (row: T) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      const id = String(row[uniqueId]);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getSelectedRows = (): T[] => data.filter((row) => selectedRowIds.has(String(row[uniqueId])));

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () =>
      (columns || []).reduce((acc, column) => {
        acc[column.accessorKey] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    if (columns && columns.length > 0) {
      setVisibleColumns((prev) => {
        const newCols = columns.reduce((acc, column) => {
          acc[column.accessorKey] =
            prev[column.accessorKey] !== undefined
              ? prev[column.accessorKey]
              : true;
          return acc;
        }, {} as Record<string, boolean>);
        return newCols;
      });
    }
  }, [columns]);

  // Debounce Search
  useEffect(() => {
    // if (searchQuery === "" && sortConfig.key === null) return;

    const timeout = setTimeout(() => {
      handleFetch({ search: searchQuery, page: 1 });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Unified fetch
  const handleFetch = (overrides: Partial<FetchParams> = {}) => {
    if (onFetchData) {
      onFetchData({
        page: overrides.page ?? pagination.currentPage ?? 1,
        search: overrides.search ?? searchQuery,
        sortBy: overrides.sortBy ?? sortConfig.key,
        sortOrder: overrides.sortOrder ?? sortConfig.direction,
        filters: overrides.filters ?? filters,
        limit: overrides.limit ?? limit, // SEND LIMIT
      });
    }
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    handleFetch({ sortBy: key, sortOrder: direction });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => handleFetch({ filters, page: 1 });

  const handleClearFilter = () => {
    setFilters({});
    handleFetch({ filters: {}, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    handleFetch({ page: newPage });
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    setLimit(newLimit);
    handleFetch({ limit: newLimit, page: 1 });
  };

  const handleExportCSV = (filename = "export.csv") => {
    if (!data?.length) return;
    const includedKeys = Object.keys(visibleColumns).filter(
      (key) => visibleColumns[key]
    );

    const escapeCSV = (value: any) => {
      const str = String(value ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = includedKeys.join(",");
    const rows = data.map((row) =>
      includedKeys.map((key) => escapeCSV(row[key])).join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const handleDeleteClick = async (e: React.MouseEvent, row: T) => {
    e.stopPropagation();
    if (onDelete) await onDelete(row);
  };

  return (
    <div className="h-fit">
      <div className="bg-white py-[15px] rounded-2xl">

        {/* --- TOP BAR (Search / Filter / Export / Columns) --- */}

        <div className="flex flex-col md:flex-row justify-between px-[20px] gap-[10px] md:h-[42px] mb-4 md:mb-0">
          <div className="relative flex-1 h-[42px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-full"
            />
          </div>

          <div className="flex gap-2 h-[42px]">

            {/* --- Filters --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-full items-center cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span className="hidden lg:block ml-2">Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <div className="ml-2 rounded-full bg-[#495774] text-white text-xs px-2">
                      {Object.keys(filters).length}
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-4 p-2">
                  <h4 className="font-medium">Filter Data</h4>
                  {(columns || []).map((column, i) =>
                    column.options ? (
                      <div key={i} className="grid gap-2">
                        <label className="text-sm">{column.header}</label>
                        <Select
                          value={filters[column.accessorKey] ?? ""}
                          onValueChange={(value) =>
                            handleFilterChange(column.accessorKey, value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue
                              placeholder={`Select ${column.header}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {column.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null
                  )}

                  <div className="flex justify-between pt-2">
                    <PopoverClose asChild>
                      <Button size="sm" onClick={handleApplyFilter}>
                        Apply
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClearFilter}
                      >
                        <XIcon className="w-4 h-4 mr-1" /> Clear
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* --- Export --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={data.length === 0}
                  variant="outline"
                  size="sm"
                  className="flex h-full items-center cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden lg:block ml-2">Export</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0 rounded-xl">
                <div className="flex flex-col rounded-xl">
                  <PopoverClose asChild>
                    <button
                      onClick={() => handleExportCSV()}
                      className="px-5 py-2 hover:bg-neutral-100 text-[13px] rounded-t-xl"
                    >
                      Export as CSV
                    </button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <button
                      onClick={() => handlePrint()}
                      className="px-5 py-2 hover:bg-neutral-100 text-[13px] rounded-b-xl"
                    >
                      Print / Save as PDF
                    </button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>

            {/* --- Column Toggle --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-full items-center cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden lg:block ml-2">Columns</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52">
                <div className="space-y-2 p-2">
                  <h4 className="font-medium mb-2">Toggle Columns</h4>
                  {(columns || []).map((column) => (
                    <div
                      key={column.accessorKey}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={visibleColumns[column.accessorKey]}
                        onCheckedChange={() =>
                          toggleColumnVisibility(column.accessorKey)
                        }
                      />
                      <label className="text-sm cursor-pointer">
                        {column.header}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* --- BULK ACTIONS BAR --- */}
        {hasBulkActions && selectedRowIds.size > 0 && (
          <div className="flex items-center gap-3 px-[20px] mt-3">
            <span className="text-sm text-gray-600 font-medium">
              {selectedRowIds.size} row{selectedRowIds.size > 1 ? "s" : ""} selected
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 py-4 cursor-pointer"
                >
                  Bulk Actions
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0 rounded-md">
                <div className="flex flex-col rounded-md">
                  {bulkActions!.map((action, idx) => (
                    <PopoverClose asChild key={idx}>
                      <button
                        onClick={() => {
                          action.onClick(getSelectedRows());
                          setSelectedRowIds(new Set());
                        }}
                        className="px-5 cursor-pointer py-2 hover:bg-neutral-100 text-[13px] text-left first:rounded-t-md last:rounded-b-md"
                      >
                        {action.label}
                      </button>
                    </PopoverClose>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-gray-500 cursor-pointer"
              onClick={() => setSelectedRowIds(new Set())}
            >
              Clear selection
            </Button>
          </div>
        )}

        {/* --- TABLE --- */}
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="border mt-[15px] overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#fbfbfb] h-[56px]">
                <TableRow>
                  {/* --- Select All Checkbox --- */}
                  {hasBulkActions && (
                    <TableHead className="pl-4 w-[50px]" style={{ minWidth: '50px' }}>
                      <Checkbox
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) {
                            (el as unknown as HTMLInputElement).indeterminate = isSomeSelected;
                          }
                        }}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                  )}
                  {(columns || []).map(
                    (column) =>
                      visibleColumns[column.accessorKey] && (
                        <TableHead
                          key={column.accessorKey}
                          className={`pl-4 ${
                            column.align === "center"
                              ? "text-center"
                              : column.align === "right"
                              ? "text-right"
                              : "text-left"
                          }`}
                          style={column.width ? { width: column.width, minWidth: column.width } : {}}
                        >
                          {column.sortable ? (
                            <div
                              className={`flex items-center gap-2 cursor-pointer ${
                                column.align === "center"
                                  ? "justify-center"
                                  : column.align === "right"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                              onClick={() => requestSort(column.accessorKey)}
                            >
                              <span>{column.header}</span>
                              {sortConfig.key === column.accessorKey ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-3 w-3 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-3 w-3 text-gray-500" />
                                )
                              ) : (
                                <ChevronsUpDown className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                          ) : (
                            <span>{column.header}</span>
                          )}
                        </TableHead>
                      )
                  )}

                  <TableHead className="border border-l text-center sticky right-0 bg-[#fbfbfb] z-20 w-[120px]" style={{ minWidth: '120px', boxShadow: '-4px 0 8px -4px rgba(0,0,0,0.08)' }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.length > 0 ? (
                  data.map((row, i) => (
                    <TableRow
                      key={String(row[uniqueId]) || i}
                      className={`cursor-pointer ${
                        i % 2 === 0 ? "bg-white" : "bg-[#f4f4f4]"
                      }`}
                      onClick={() => onView && onView(row)}
                    >
                      {/* --- Row Checkbox --- */}
                      {hasBulkActions && (
                        <TableCell className="pl-4 w-[50px]" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedRowIds.has(String(row[uniqueId]))}
                            onCheckedChange={() => toggleSelectRow(row)}
                            aria-label={`Select row ${String(row[uniqueId])}`}
                          />
                        </TableCell>
                      )}
                      {(columns || []).map(
                        (column) =>
                          visibleColumns[column.accessorKey] && (
                            <TableCell
                              key={`${String(row[uniqueId])}-${column.accessorKey}`}
                              className={`pl-4 ${
                                column.align === "center"
                                  ? "text-center"
                                  : column.align === "right"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                              style={column.width ? { width: column.width, minWidth: column.width } : {}}
                            >
                              {column.cell
                                ? column.cell(row)
                                : row[column.accessorKey] ??
                                  ""}
                            </TableCell>
                          )
                      )}

                      {/* --- Actions --- */}
                      <TableCell
                        className={`sticky right-0 z-20 w-[120px] border-l ${
                          i % 2 === 0 ? "bg-white" : "bg-[#f4f4f4]"
                        }`}
                        style={{ minWidth: '120px', boxShadow: '-4px 0 8px -4px rgba(0,0,0,0.08)' }}
                      >
                        <div className="flex items-center justify-center gap-[5px]">

                          {onStatusChange && permissions.canEdit && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Switch
                                className="cursor-pointer mr-2"
                                checked={!!row["is_active"]}
                                onCheckedChange={(val) =>
                                  onStatusChange(row, val)
                                }
                              />
                            </div>
                          )}

                          {onView && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(row);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <EyeIcon className="h-4 w-4 text-[#28bc28]" />
                            </Button>
                          )}

                          {onEdit && permissions.canEdit && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4 text-[#3e8df4]" />
                            </Button>
                          )}

                          {onDelete && permissions.canDelete && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>
                                      <div className="pt-2">
                                        <p>You cannot undo this action.</p>
                                        <div className="flex justify-between mt-4 gap-4">
                                          <DialogClose asChild>
                                            <Button variant="outline" className="flex-1">
                                              Cancel
                                            </Button>
                                          </DialogClose>

                                          <DialogClose asChild>
                                            <Button
                                              className="flex-1 bg-red-500 hover:bg-red-600"
                                              onClick={(e) =>
                                                handleDeleteClick(e, row)
                                              }
                                            >
                                              Delete
                                            </Button>
                                          </DialogClose>
                                        </div>
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        (columns || []).filter(
                          (c) => visibleColumns[c.accessorKey]
                        ).length + 1 + (hasBulkActions ? 1 : 0)
                      }
                      className="h-32 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          pageconfig={{ ...pagination, limit }}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}

/* ------------------ Pagination ------------------ */

interface PaginationProps {
  pageconfig: PaginationState;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: string) => void;
}

function Pagination({
  pageconfig,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const {
    currentPage = 1,
    totalPages = 1,
    hasPrev = false,
    hasNext = false,
    limit = 10,
  } = pageconfig;

  const goToFirst = () => {
    if (currentPage !== 1) onPageChange(1);
  };
  const goToLast = () => {
    if (currentPage !== totalPages) onPageChange(totalPages);
  };
  const goToPrev = () => {
    if (hasPrev) onPageChange(currentPage - 1);
  };
  const goToNext = () => {
    if (hasNext) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-[20px] mt-[15px]">

      {/* Pagination Buttons */}
      <div className="flex items-center justify-center space-x-1 mb-3 sm:mb-0">
        <Button
          variant="outline"
          size="sm"
          onClick={goToFirst}
          disabled={currentPage === 1}
        >
          First
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={goToPrev}
          disabled={!hasPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm px-2">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={goToLast}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      </div>

      {/* Limit Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page:</span>
        <Select value={String(limit)} onValueChange={onLimitChange}>
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
