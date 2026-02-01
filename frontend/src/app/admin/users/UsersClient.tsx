"use client";

import { ColumnDef, SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ban, Calendar, Eye, Shield, ShieldAlert, Star, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table/data-table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
    batchUpdateUserPremium,
    batchUpdateUserStatus,
    getUsers,
    togglePremiumStatus,
    toggleUserStatus
} from "@/services/admin.service";
import { AdminUser } from "@/types/admin";

export default function UsersClient() {
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
    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

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

            const sortParam = sorting.length > 0
                ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}`
                : 'id,desc';

            const result = await getUsers(
                pageIndex,
                pageSize,
                keyword,
                sortParam,
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
    }, [pageIndex, pageSize, keyword, dateRange, selectedStatus, selectedPremium, sorting]);

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
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={row.getIsSelected()}
                    onChange={(e) => row.toggleSelected(!!e.target.checked)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "ID",
            enableSorting: true,
            cell: ({ row }) => <span className="font-mono text-xs text-slate-500">#{row.original.id}</span>,
        },
        {
            accessorKey: "fullName",
            header: "Người dùng",
            enableSorting: true,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                            {(user?.fullName?.trim() ? user.fullName.trim().substring(0, 2).toUpperCase() : "US")}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{user.fullName || "Tên không xác định"}</p>
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
            enableSorting: true,
            cell: ({ row }) => {
                const dateStr = row.original.createdAt;
                try {
                    const date = new Date(dateStr);
                    return <span className="text-slate-600">{isNaN(date.getTime()) ? "N/A" : format(date, 'dd/MM/yyyy')}</span>
                } catch (e) {
                    console.error("Lỗi định dạng ngày:", e);
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

    const selectedRows = Object.keys(rowSelection).filter(key => rowSelection[key]);
    const selectedIds = selectedRows.map(index => data[parseInt(index)]?.id).filter(id => id !== undefined);

    const handleBatchStatus = async (status: number) => {
        if (selectedIds.length === 0) return;

        const actionText = status === 1 ? 'mở khóa' : 'khóa';
        setConfirmConfig({
            isOpen: true,
            title: `Cập nhật trạng thái hàng loạt`,
            description: `Bạn có chắc muốn ${actionText} ${selectedIds.length} tài khoản đã chọn?`,
            type: status === 1 ? 'success' : 'danger',
            confirmText: 'Xác nhận',
            onConfirm: async () => {
                try {
                    await batchUpdateUserStatus(selectedIds, status);
                    toast.success(`Đã ${actionText} thành công ${selectedIds.length} người dùng`);
                    setRowSelection({});
                    fetchData();
                } catch (error) {
                    toast.error("Lỗi khi cập nhật hàng loạt");
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleBatchPremium = async (isPremium: boolean) => {
        if (selectedIds.length === 0) return;

        const actionText = isPremium ? 'nâng cấp Premium' : 'hủy gói Premium';
        setConfirmConfig({
            isOpen: true,
            title: `Cập nhật gói hàng loạt`,
            description: `Bạn có chắc muốn ${actionText} cho ${selectedIds.length} tài khoản đã chọn?`,
            type: isPremium ? 'info' : 'warning',
            confirmText: 'Xác nhận',
            onConfirm: async () => {
                try {
                    await batchUpdateUserPremium(selectedIds, isPremium);
                    toast.success(`Đã ${actionText} thành công`);
                    setRowSelection({});
                    fetchData();
                } catch (error) {
                    toast.error("Lỗi khi cập nhật hàng loạt");
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

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
                    sorting={sorting}
                    onSortingChange={setSorting}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </div>

            {/* Bulk Action Bar - Floating */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6">
                        <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                {selectedIds.length}
                            </div>
                            <span className="text-white text-sm font-medium">Đã chọn</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBatchStatus(1)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-all"
                                title="Mở khóa tất cả"
                            >
                                <Shield className="w-4 h-4" /> Mở khóa
                            </button>
                            <button
                                onClick={() => handleBatchStatus(0)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-rose-500/20 text-rose-400 text-sm font-medium transition-all"
                                title="Khóa tất cả"
                            >
                                <Ban className="w-4 h-4" /> Khóa
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <button
                                onClick={() => handleBatchPremium(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-amber-500/20 text-amber-400 text-sm font-medium transition-all"
                                title="Nâng cấp Premium"
                            >
                                <Star className="w-4 h-4" /> Premium
                            </button>
                            <button
                                onClick={() => handleBatchPremium(false)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 text-white/60 text-sm font-medium transition-all"
                                title="Hủy Premium"
                            >
                                <Star className="w-4 h-4" /> Hủy Premium
                            </button>
                        </div>

                        <button
                            onClick={() => setRowSelection({})}
                            className="ml-4 p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                            title="Bỏ chọn"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

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
