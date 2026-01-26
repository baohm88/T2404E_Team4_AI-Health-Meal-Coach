"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/DataTableUI";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    // Search
    searchKey?: string; // For placeholder text typically
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    // Date Filter
    onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
    // Pagination (Server Side)
    pageCount?: number;
    pagination?: {
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
    // Sorting (Server Side)
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchValue,
    onSearchChange,
    onDateRangeChange,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        state: {
            columnVisibility,
            rowSelection,
            pagination,
            sorting, // Pass external sorting state if provided? No, useReactTable expects internal or external.
            // If I want to control it, I should pass `onSortingChange` and `state.sorting`.
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: !!pagination,
        onPaginationChange: (updater) => {
            if (typeof updater === 'function' && pagination) {
                const newPagination = updater(pagination);
                onPaginationChange?.(newPagination);
            }
        },
        // Sorting
        manualSorting: !!onSortingChange,
        onSortingChange: (updater) => {
             if (typeof updater === 'function' && onSortingChange && sorting) {
                 const newSorting = updater(sorting);
                 onSortingChange(newSorting);
             } else if (onSortingChange && typeof updater !== 'function') {
                 onSortingChange(updater as SortingState);
             }
        },
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar 
                table={table} 
                searchKey={searchKey}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                onDateRangeChange={onDateRangeChange}
            />
            <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-semibold text-slate-600">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-slate-700">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
