"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Eye, Shield, ShieldAlert, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table/data-table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getUsers, togglePremiumStatus, toggleUserStatus } from "@/services/admin.service";
import { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
    // State
    const [data, setData] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);
    const [selectedPremium, setSelectedPremium] = useState<boolean | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

    // Confirm Dialog State
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        type: 'danger' | 'warning' | 'info' | 'success';
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => { },
        type: 'info'
    });

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
                selectedStatus,
                selectedPremium,
                startDate,
                endDate
            );

            setData(result.content);
            setPageCount(result.totalPages);
            setTotalElements(result.totalElements);
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
    }, [pageIndex, pageSize, keyword, dateRange, selectedStatus, selectedPremium]);

    // Actions
    const handleToggleStatus = (user: AdminUser) => {
        const isLocking = user.status === 1;
        setConfirmConfig({
            isOpen: true,
            title: isLocking ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
            description: `Bạn có chắc muốn ${isLocking ? 'KHÓA' : 'MỞ KHÓA'} tài khoản của ${user.fullName}?`,
            type: isLocking ? 'danger' : 'success',
            confirmText: isLocking ? 'Khóa ngay' : 'Mở khóa',
            onConfirm: async () => {
                try {
                    await toggleUserStatus(user.id);
                    toast.success("Đã cập nhật trạng thái người dùng");
                    fetchData();
                } catch (error) {
                    toast.error("Lỗi khi cập nhật trạng thái");
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleTogglePremium = (user: AdminUser) => {
        const isRemoving = user.isPremium;
        setConfirmConfig({
            isOpen: true,
            title: isRemoving ? 'Hủy gói Premium' : 'Nâng cấp Premium',
            description: isRemoving
                ? `Bạn có chắc muốn HỦY gói Premium của ${user.fullName}?`
                : `Bạn có chắc muốn NÂNG CẤP Premium cho ${user.fullName}?`,
            type: isRemoving ? 'warning' : 'info',
            confirmText: isRemoving ? 'Hủy gói' : 'Nâng cấp',
            onConfirm: async () => {
                try {
                    await togglePremiumStatus(user.id);
                    toast.success("Đã cập nhật trạng thái Premium");
                    fetchData();
                } catch (error) {
                    toast.error("Lỗi khi cập nhật Premium");
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
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
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section with Gradient Background */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <Shield className="w-8 h-8 text-emerald-400" />
                            Quản lý người dùng
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Hệ thống kiểm soát và phân quyền thành viên AI Health Coach
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tổng thành viên</p>
                            <p className="text-2xl font-black text-white">{totalElements}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glassmorphism Filter Bar */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl flex flex-wrap gap-6 items-end sticky top-4 z-20">
                <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                        <Star className="w-3 h-3" /> Tìm kiếm thành viên
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tên hoặc email..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-[2]">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Trạng thái</label>
                        <select
                            value={selectedStatus === undefined ? '' : selectedStatus}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedStatus(val === '' ? undefined : Number(val));
                                setPageIndex(0);
                            }}
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="1">Đang hoạt động</option>
                            <option value="0">Đã bị khóa</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Loại tài khoản</label>
                        <select
                            value={selectedPremium === undefined ? '' : String(selectedPremium)}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedPremium(val === '' ? undefined : val === 'true');
                                setPageIndex(0);
                            }}
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                            <option value="">Tất cả loại gói</option>
                            <option value="false">Miễn phí (Free)</option>
                            <option value="true">Cao cấp (Premium)</option>
                        </select>
                    </div>

                    <div className="space-y-2 lg:col-span-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Thời gian đăng ký
                        </label>
                        <div className="flex gap-2 h-11">
                            <input
                                type="date"
                                value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    setDateRange(prev => ({ ...prev, from: date }));
                                    setPageIndex(0);
                                }}
                                className="flex-1 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                            <div className="flex items-center text-slate-400">-</div>
                            <input
                                type="date"
                                value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    setDateRange(prev => ({ ...prev, to: date }));
                                    setPageIndex(0);
                                }}
                                className="flex-1 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={data}
                    pageCount={pageCount}
                    pagination={{ pageIndex, pageSize }}
                    onPaginationChange={({ pageIndex, pageSize }) => {
                        setPageIndex(pageIndex);
                        setPageSize(pageSize);
                    }}
                />
            </div>

            {/* Footer shadow/decoration */}
            <div className="h-20 w-full" />

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
            />
        </div>
    );
}
