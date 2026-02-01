"use client";

import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Receipt, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getTransactions } from "@/services/admin.service";
import { Transaction } from "@/types/admin";
import { columns } from "./columns";

export default function TransactionsClient() {
    const [data, setData] = useState<Transaction[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Filter States
    const [keyword, setKeyword] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    
    // Table States
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const startDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
            const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;
            
            const sortParam = sorting.length > 0
                ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}`
                : 'createdAt,desc';

            const result = await getTransactions(
                pagination.pageIndex,
                pagination.pageSize,
                sortParam,
                keyword,
                selectedStatus,
                startDate,
                endDate
            );
            
            setData(result.content);
            setPageCount(result.totalPages);
            setTotalElements(result.totalElements);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            toast.error("Không thể tải lịch sử giao dịch");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [pagination.pageIndex, pagination.pageSize, sorting, keyword, selectedStatus, dateRange]);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
             {/* Header Section with Gradient Background */}
             <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <Receipt className="w-8 h-8 text-violet-400" />
                            Lịch sử giao dịch
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Quản lý và theo dõi toàn bộ dòng tiền trong hệ thống
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tổng giao dịch</p>
                            <p className="text-2xl font-black text-white">{totalElements}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glassmorphism Filter Bar */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl flex flex-wrap gap-6 items-end sticky top-4 z-20">
                <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                        <Search className="w-3 h-3" /> Tìm kiếm giao dịch
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Mã GD, Email hoặc Tên người dùng..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            }}
                            className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all bg-slate-50/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 flex-[1.5]">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Trạng thái</label>
                        <select
                            value={selectedStatus === undefined ? '' : selectedStatus}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedStatus(val === '' ? undefined : val);
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                            }}
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="SUCCESS">Thành công</option>
                            <option value="PENDING">Đang chờ</option>
                            <option value="FAILED">Thất bại</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Thời gian giao dịch
                        </label>
                        <div className="flex gap-2 h-11">
                            <input
                                type="date"
                                value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    setDateRange(prev => ({ ...prev, from: date }));
                                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                }}
                                className="flex-1 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                            />
                            <div className="flex items-center text-slate-400">-</div>
                            <input
                                type="date"
                                value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    setDateRange(prev => ({ ...prev, to: date }));
                                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                }}
                                className="flex-1 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-1">
                    <DataTable
                        columns={columns}
                        data={data}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        sorting={sorting}
                        onSortingChange={setSorting}
                    />
                </div>
            </div>
        </div>
    );
}
