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
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    className?: string;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function DataTable<T extends object>({
    data,
    columns,
    keyExtractor,
    className,
    emptyMessage = 'Không có dữ liệu',
    onRowClick,
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
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        'px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider',
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
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
