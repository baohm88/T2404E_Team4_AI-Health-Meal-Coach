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
                {/* Search Input */}
                {searchKey && (
                    <input
                        placeholder="Tìm kiếm..."
                        value={searchValue ?? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                             if (onSearchChange) {
                                 onSearchChange(event.target.value);
                             } else {
                                 table.getColumn(searchKey)?.setFilterValue(event.target.value);
                             }
                        }}
                        className="h-10 w-[200px] lg:w-[300px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                )}

                {/* Reset Filters */}
                {isFiltered && (
                    <button
                        onClick={onReset}
                        className="h-10 px-3 lg:px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
                    >
                        Đặt lại
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Date Filter Controls */}
            {onDateRangeChange && (
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <select
                        value={rangeOption}
                        onChange={(e) => handleRangeChange(e.target.value as DateRangeOption)}
                        className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 px-2 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="ALL">Tất cả thời gian</option>
                        <option value="TODAY">Hôm nay</option>
                        <option value="WEEK">7 ngày qua</option>
                        <option value="MONTH">30 ngày qua</option>
                        <option value="YEAR">Năm nay</option>
                        <option value="CUSTOM">Tùy chọn...</option>
                    </select>

                    {rangeOption === 'CUSTOM' && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="h-8 w-32 border border-slate-200 rounded-lg text-xs px-2"
                            />
                            <span className="text-slate-400 text-xs">-</span>
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="h-8 w-32 border border-slate-200 rounded-lg text-xs px-2"
                            />
                            <button
                                onClick={handleCustomDateSubmit}
                                className="h-8 px-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600"
                            >
                                Lọc
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
