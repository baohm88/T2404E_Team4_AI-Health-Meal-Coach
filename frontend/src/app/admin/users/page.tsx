"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Shield, ShieldAlert, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table/data-table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getUsers, togglePremiumStatus, toggleUserStatus } from "@/services/admin.service";
import { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
    // State
    const [data, setData] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const startDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
            const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

            const result = await getUsers(
                pageIndex, 
                pageSize, 
                keyword, 
                'id,desc', 
                undefined, // status 
                undefined, // isPremium
                startDate,
                endDate
            );
            
            setData(result.content);
            setPageCount(result.totalPages);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search could be added here, but for now direct fetch
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [pageIndex, pageSize, keyword, dateRange]);

    // Actions
    const handleToggleStatus = async (user: AdminUser) => {
        try {
            await toggleUserStatus(user.id);
            toast.success("Đã cập nhật trạng thái người dùng");
            fetchData();
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const handleTogglePremium = async (user: AdminUser) => {
        try {
            await togglePremiumStatus(user.id);
            toast.success("Đã cập nhật trạng thái Premium");
            fetchData();
        } catch (error) {
            toast.error("Lỗi khi cập nhật Premium");
        }
    };

    // Columns
    const columns: ColumnDef<AdminUser>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <span className="font-mono text-xs text-slate-500">#{row.original.id}</span>,
        },
        {
            accessorKey: "fullName",
            header: "Người dùng",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                            {user.fullName.substring(0, 2)}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Vai trò",
            cell: ({ row }) => (
                row.original.role === 'ADMIN' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                        <ShieldAlert className="w-3 h-3" />
                        Admin
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                        <Shield className="w-3 h-3" />
                        User
                    </span>
                )
            ),
        },
        {
            accessorKey: "isPremium",
            header: "Gói",
            cell: ({ row }) => (
                row.original.isPremium ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        PREMIUM
                    </span>
                ) : (
                    <span className="text-xs text-slate-500">Free</span>
                )
            ),
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tham gia",
            cell: ({ row }) => {
                try {
                    return <span className="text-slate-600">{format(new Date(row.original.createdAt), 'dd/MM/yyyy')}</span>
                } catch (e) {
                    return <span className="text-slate-400">N/A</span>
                }
            },
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Xem chi tiết">
                                <Eye className="w-4 h-4" />
                            </button>
                        </Link>
                        
                        <button 
                            onClick={() => handleTogglePremium(user)}
                            className={`p-2 rounded-lg transition-colors ${user.isPremium ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500'}`}
                            title="Toggle Premium"
                        >
                            <Star className={`w-4 h-4 ${user.isPremium ? 'fill-amber-500' : ''}`} />
                        </button>

                        <button 
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${user.status === 1 ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-600'}`}
                            title="Toggle Status"
                        >
                            {user.status === 1 ? <Shield className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </button>
                    </div>
                )
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
                <p className="text-slate-500">Xem và quản lý tài khoản thành viên</p>
            </div>

            <DataTable 
                columns={columns} 
                data={data}
                searchKey="fullName"
                searchValue={keyword}
                onSearchChange={setKeyword}
                onDateRangeChange={setDateRange}
                pageCount={pageCount}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPageIndex(pageIndex);
                    setPageSize(pageSize);
                }}
            />
        </div>
    );
}
