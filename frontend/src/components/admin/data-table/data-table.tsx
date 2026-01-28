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

import { cn } from "@/lib/utils";
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
            <div className="bg-white/50 backdrop-blur-sm overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-slate-900 shadow-lg relative z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-slate-900 border-none h-16">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-white/90 first:pl-8 last:pr-8">
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
                            table.getRowModel().rows.map((row, idx) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(
                                        "transition-all duration-300 border-slate-100",
                                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="first:pl-8 last:pr-8 py-5">
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
                                    className="h-32 text-center text-slate-400 font-medium"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl">📭</div>
                                        Không tìm thấy dữ liệu phù hợp.
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
