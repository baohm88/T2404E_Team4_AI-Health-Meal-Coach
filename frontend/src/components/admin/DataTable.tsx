/**
 * Data Table Component
 * 
 * Reusable table with zebra striping, hover effects, and rounded corners.
 */

'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T, index: number) => ReactNode;
    className?: string;
    sortable?: boolean; // New prop
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    className?: string;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    // Sorting props
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (column: string) => void;
}

// ============================================================
// COMPONENT
// ============================================================

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export function DataTable<T extends object>({
    data,
    columns,
    keyExtractor,
    className,
    emptyMessage = 'Không có dữ liệu',
    onRowClick,
    sortColumn,
    sortDirection,
    onSort,
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-slate-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={cn('bg-white rounded-2xl overflow-hidden shadow-sm', className)}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {columns.map((col) => {
                                const isSortable = col.sortable && onSort;
                                const isSorted = sortColumn === col.key;
                                
                                return (
                                <th
                                    key={col.key}
                                    className={cn(
                                        'px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider',
                                        isSortable && 'cursor-pointer hover:bg-slate-100 transition-colors select-none',
                                        col.className
                                    )}
                                    onClick={() => isSortable && onSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {isSortable && (
                                            <span className="text-slate-400">
                                                {isSorted ? (
                                                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 text-primary" />
                                                ) : (
                                                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            )})}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item, index) => (
                            <tr
                                key={keyExtractor(item)}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    'transition-colors',
                                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                                    onRowClick && 'cursor-pointer hover:bg-primary/5'
                                )}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={cn('px-6 py-4 text-sm text-slate-700', col.className)}
                                    >
                                        {col.render
                                            ? col.render(item, index)
                                            : String((item as Record<string, unknown>)[col.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
