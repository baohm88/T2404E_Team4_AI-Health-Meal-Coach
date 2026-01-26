"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-slate-500">
                {table.getFilteredSelectedRowModel().rows.length} trong số{" "}
                {table.getFilteredRowModel().rows.length} hàng được chọn.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-slate-700">Hàng mỗi trang</p>
                    <select
                        value={`${table.getState().pagination.pageSize}`}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="h-8 w-[70px] rounded-lg border border-slate-200 bg-white text-sm"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium text-slate-700">
                    Trang {table.getState().pagination.pageIndex + 1} /{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="h-8 w-8 p-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                        className="h-8 w-8 p-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        className="h-8 w-8 p-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                        className="h-8 w-8 p-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
