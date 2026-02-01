"use client";

import { Transaction } from "@/types/admin";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "transactionId",
        header: "Mã Giao Dịch",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800">{row.original.transactionId}</span>
            </div>
        ),
    },
    {
        accessorKey: "userEmail",
        header: "Người Dùng",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">{row.original.userName}</span>
                <span className="text-xs text-slate-400">{row.original.userEmail}</span>
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: "Số Tiền",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount);
            return <div className="font-black text-slate-800">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Trạng Thái",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                    ${status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'}`}>
                    {status === 'SUCCESS' ? 'Thành công' : status === 'PENDING' ? 'Đang xử lý' : 'Thất bại'}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt", 
        // Note: The ID in DTO is 'paidAt' but let's check what I mapped. 
        // In TransactionServiceImpl: .paidAt(transaction.getCreatedAt())
        // In TransactionDTO: private LocalDateTime paidAt;
        // The API returns 'paidAt'. 
        // Wait, typical JpaRepository sort might use entity field 'createdAt'.
        // Sort param passed to backend is 'createdAt,desc' by default in admin.service.ts
        // But the DTO field is 'paidAt'. 
        // DataTable uses accessorKey to map *data* fields. So it should be 'paidAt'.
        header: "Thời Gian",
        cell: ({ row }) => {
            return (
                <div className="text-sm font-medium text-slate-600">
                    {format(new Date(row.original.paidAt), "HH:mm dd/MM/yyyy", { locale: vi })}
                </div>
            );
        },
    },
    {
        accessorKey: "isPremium",
        header: "Gói",
        cell: ({ row }) => (
            row.original.isPremium ? 
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">PREMIUM</span> : 
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">FREE</span>
        ),
    }
];
