"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getTransactions } from "@/services/admin.service";
import { Transaction } from "@/types/admin";
import { useEffect, useState } from "react";
import { columns } from "./columns";

export default function TransactionsPage() {
    const [data, setData] = useState<Transaction[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getTransactions(
                    pagination.pageIndex,
                    pagination.pageSize,
                    "createdAt,desc"
                );
                setData(result.content);
                setPageCount(result.totalPages);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pagination]);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Lịch sử giao dịch</h2>
                    <p className="text-slate-500 font-medium mt-2">
                        Quản lý toàn bộ giao dịch thanh toán trong hệ thống
                    </p>
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
                    />
                </div>
            </div>
        </div>
    );
}
