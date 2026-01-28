"use client";

import { Table } from "@tanstack/react-table";
import { endOfDay, startOfDay, startOfYear, subDays } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchKey?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
}

type DateRangeOption = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM';

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchValue,
    onSearchChange,
    onDateRangeChange,
}: DataTableToolbarProps<TData>) {
    // Determine if filtered. If server-side search is used, check searchValue.
    const isFiltered = (table.getState().columnFilters.length > 0) || (!!searchValue);

    const [rangeOption, setRangeOption] = useState<DateRangeOption>('ALL');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    const handleRangeChange = (option: DateRangeOption) => {
        setRangeOption(option);
        const now = new Date();
        let from: Date | undefined;
        let to: Date | undefined;

        switch (option) {
            case 'TODAY':
                from = startOfDay(now);
                to = endOfDay(now);
                break;
            case 'WEEK':
                from = subDays(now, 7);
                to = now;
                break;
            case 'MONTH':
                from = subDays(now, 30);
                to = now;
                break;
            case 'YEAR':
                from = startOfYear(now);
                to = now;
                break;
            case 'ALL':
                from = undefined;
                to = undefined;
                break;
            case 'CUSTOM':
                return;
        }

        if (onDateRangeChange) {
            onDateRangeChange({ from, to });
        }
    };

    const handleCustomDateSubmit = () => {
        if (customFrom && customTo && onDateRangeChange) {
            onDateRangeChange({
                from: startOfDay(new Date(customFrom)),
                to: endOfDay(new Date(customTo))
            });
        }
    };

    const onReset = () => {
        table.resetColumnFilters();
        if (onSearchChange) onSearchChange("");
        if (onDateRangeChange) {
            setRangeOption('ALL');
            onDateRangeChange({});
        }
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="flex flex-1 items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                {/* Reset Filters */}
                {isFiltered && (
                    <button
                        onClick={onReset}
                        className="h-10 px-3 lg:px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 border border-slate-200"
                    >
                        Đặt lại bộ lọc
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
