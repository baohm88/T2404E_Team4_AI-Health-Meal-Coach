"use client";

import { ColumnDef, SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Coffee, Edit, Moon, Plus, Sun, Trash2, Undo2, Utensils, X, ShieldCheck, Eye, EyeOff, Check } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table/data-table";
import { FoodFormModal } from "@/components/admin/FoodFormModal";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
    createDish,
    getDishes,
    toggleDishStatus,
    toggleVerifyStatus,
    updateDish,
    batchUpdateDishStatus,
    batchVerifyDishes
} from "@/services/admin.service";
import { CreateDishRequest, DishLibrary, MealTimeSlot } from "@/types/admin";

// Category Badge Helper
const CategoryBadge = ({ category }: { category: string }) => {
    const configs: Record<string, { label: string; icon: any; color: string }> = {
        BREAKFAST: { label: 'Sáng', icon: Coffee, color: 'bg-blue-100 text-blue-700' },
        LUNCH: { label: 'Trưa', icon: Sun, color: 'bg-orange-100 text-orange-700' },
        DINNER: { label: 'Tối', icon: Moon, color: 'bg-indigo-100 text-indigo-700' },
        SNACK: { label: 'Phụ', icon: Utensils, color: 'bg-emerald-100 text-emerald-700' },
    };
    const config = configs[category] || { label: category, icon: Utensils, color: 'bg-slate-100 text-slate-700' };
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
};

export default function FoodDatabasePage() {
    // State
    const [data, setData] = useState<DishLibrary[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Sort
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);

    // Filters
    // Filters
    const [keyword, setKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<MealTimeSlot | undefined>(undefined);

    // Selection
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    // Derived Selection Ids
    const selectedRows = Object.keys(rowSelection).filter(key => rowSelection[key]);
    const selectedIds = selectedRows.map(index => data[parseInt(index)]?.id).filter(id => id !== undefined);

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

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<DishLibrary | null>(null);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Convert SortingState to API string "field,dir"
            const sortField = sorting[0]?.id || 'id';
            const sortDir = sorting[0]?.desc ? 'desc' : 'asc';
            const sortParam = `${sortField},${sortDir}`;

            const result = await getDishes(
                pageIndex,
                pageSize,
                keyword,
                selectedCategory,
                sortParam
            );

            setData(result.content);
            setPageCount(result.totalPages);
            setTotalElements(result.totalElements);
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
            toast.error("Không thể tải danh sách món ăn");
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize, keyword, selectedCategory, sorting]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchData]);

    // Reset selection when data changes (e.g. page change)
    useEffect(() => {
        setRowSelection({});
    }, [data]);

    // Handlers
    const handleToggleStatus = (dish: DishLibrary) => {
        const action = dish.isDeleted ? 'hiển thị lại' : 'ẩn';
        setConfirmConfig({
            isOpen: true,
            title: `${dish.isDeleted ? 'Hiển thị' : 'Ẩn'} món ăn`,
            description: `Bạn có chắc chắn muốn ${action} món "${dish.name}"?`,
            type: dish.isDeleted ? 'success' : 'warning',
            confirmText: dish.isDeleted ? 'Hiển thị' : 'Ẩn món',
            onConfirm: async () => {
                try {
                    await toggleDishStatus(dish.id);
                    toast.success(`Đã ${action} món ăn`);
                    fetchData();
                } catch (error) {
                    toast.error('Lỗi cập nhật trạng thái');
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleToggleVerify = (dish: DishLibrary) => {
        const action = dish.isVerified ? 'hủy xác nhận' : 'xác nhận';
        setConfirmConfig({
            isOpen: true,
            title: `${dish.isVerified ? 'Hủy' : 'Xác nhận'} món chuẩn`,
            description: `Bạn có chắc chắn muốn ${action} món "${dish.name}" không?`,
            type: dish.isVerified ? 'warning' : 'info',
            confirmText: dish.isVerified ? 'Hủy xác nhận' : 'Xác nhận',
            onConfirm: async () => {
                try {
                    await toggleVerifyStatus(dish.id);
                    toast.success(`Đã ${action} món ăn`);
                    fetchData();
                } catch (error) {
                    toast.error('Lỗi cập nhật trạng thái xác thực');
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleEdit = (dish: DishLibrary) => {
        setEditingDish(dish);
        setIsModalOpen(true);
    }

    const handleOpenCreate = () => {
        setEditingDish(null);
        setIsModalOpen(true);
    }

    const handleSubmit = async (dishData: CreateDishRequest, isEdit: boolean) => {
        try {
            if (isEdit && editingDish) {
                await updateDish(editingDish.id, dishData);
                toast.success(`Đã cập nhật món "${dishData.name}"`);
            } else {
                await createDish(dishData);
                toast.success(`Đã thêm món "${dishData.name}"`);
            }
            fetchData();
            setIsModalOpen(false);
            setEditingDish(null);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lưu món ăn');
        }
    };

    const handleBatchStatus = async (isDeleted: boolean) => {
        if (selectedIds.length === 0) return;

        const actionText = isDeleted ? 'ẩn' : 'hiển thị lại';
        setConfirmConfig({
            isOpen: true,
            title: `Cập nhật trạng thái hiển thị`,
            description: `Bạn có chắc muốn ${actionText} ${selectedIds.length} món ăn đã chọn?`,
            type: isDeleted ? 'warning' : 'success',
            confirmText: 'Xác nhận',
            onConfirm: async () => {
                try {
                    await batchUpdateDishStatus(selectedIds, isDeleted);
                    toast.success(`Đã ${actionText} thành công ${selectedIds.length} món ăn`);
                    setRowSelection({});
                    fetchData();
                } catch (error) {
                    toast.error("Lỗi khi cập nhật trạng thái hàng loạt");
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleBatchVerify = async (isVerified: boolean) => {
        if (selectedIds.length === 0) return;

        const actionText = isVerified ? 'xác nhận chuẩn' : 'hủy xác nhận';
        setConfirmConfig({
            isOpen: true,
            title: `Xác nhận dữ liệu chuẩn`,
            description: `Bạn có chắc muốn ${actionText} cho ${selectedIds.length} món ăn đã chọn?`,
            type: isVerified ? 'success' : 'warning',
            confirmText: 'Xác nhận',
            onConfirm: async () => {
                try {
                    await batchVerifyDishes(selectedIds, isVerified);
                    toast.success(`Đã ${actionText} thành công ${selectedIds.length} món ăn`);
                    setRowSelection({});
                    fetchData();
                } catch (error) {
                    toast.error("Lỗi khi xác nhận hàng loạt");
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    // Columns
    const columns: ColumnDef<DishLibrary>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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
            cell: ({ row }) => <span className="font-mono text-xs text-slate-500">#{row.original.id}</span>,
            enableSorting: true,
        },
        {
            accessorKey: "name", // We use name for sorting, but render image+name
            header: "Món ăn",
            cell: ({ row }) => {
                const dish = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center text-lg">
                            {dish.imageUrl ? (
                                <Image
                                    src={dish.imageUrl}
                                    alt={dish.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span>🍽️</span>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 line-clamp-1">{dish.name}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{dish.description || 'Chưa có mô tả'}</p>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "category",
            header: "Bữa ăn",
            cell: ({ row }) => <CategoryBadge category={row.original.category} />,
            enableSorting: true,
        },
        {
            accessorKey: "baseCalories",
            header: "Calo",
            cell: ({ row }) => <span className="font-bold text-slate-700">{row.original.baseCalories} kcal</span>,
            enableSorting: true,
        },
        {
            accessorKey: "isVerified",
            header: "Trạng thái",
            cell: ({ row }) => (
                row.original.isVerified ? (
                    <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-medium border border-emerald-100">Đã xác nhận</span>
                ) : (
                    <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 font-medium border border-red-100">Chưa xác nhận</span>
                )
            ),
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => {
                try {
                    return <span className="text-slate-600 font-medium">{format(new Date(row.original.createdAt), 'dd/MM/yyyy')}</span>
                } catch (e) {
                    return <span className="text-slate-400">N/A</span>
                }
            },
            enableSorting: true,
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => {
                const dish = row.original;
                return (
                    <div className="flex items-center gap-1">
                        {/* Verify Toggle */}
                        <button
                            onClick={() => handleToggleVerify(dish)}
                            className={`p-2 rounded-lg transition-colors ${dish.isVerified ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                            title={dish.isVerified ? "Hủy xác nhận" : "Xác nhận món chuẩn"}
                        >
                            <Utensils className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                            onClick={() => handleEdit(dish)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-blue-600 transition-colors"
                            title="Chỉnh sửa"
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        {/* Toggle Visibility (Soft Delete) */}
                        <button
                            onClick={() => handleToggleStatus(dish)}
                            className={`p-2 rounded-lg transition-colors ${dish.isDeleted ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                            title={dish.isDeleted ? "Hiển thị lại" : "Ẩn món ăn"}
                        >
                            {dish.isDeleted ? <Undo2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                )
            },
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Header Section */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700/50">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            <Utensils className="w-4 h-4" /> Food Intelligence
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                            Thư viện <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Dinh dưỡng</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                            Quản lý cơ sở dữ liệu món ăn, thông tin calo và trạng thái xác thực dữ liệu chuẩn cho hệ thống AI.
                        </p>
                    </div>

                    <Button
                        onClick={handleOpenCreate}
                        className="h-16 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 gap-3"
                    >
                        <Plus className="w-6 h-6" /> Thêm món mới
                    </Button>
                </div>
            </div>

            {/* Designer Filter Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-2xl p-6 rounded-[32px] border border-white shadow-2xl flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            Tìm kiếm món ăn
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Ví dụ: Phở bò, Cơm tấm..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full h-14 pl-6 pr-12 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-slate-50/50 text-slate-800 font-medium"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-64 space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lọc bữa ăn</label>
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value ? e.target.value as MealTimeSlot : undefined);
                                setPageIndex(0);
                            }}
                            className="w-full h-14 px-5 rounded-2xl border border-slate-200 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 bg-white transition-all appearance-none cursor-pointer"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25rem' }}
                        >
                            <option value="">Tất cả bữa ăn</option>
                            <option value="BREAKFAST">☕ Bữa Sáng</option>
                            <option value="LUNCH">☀️ Bữa Trưa</option>
                            <option value="DINNER">🌙 Bữa Tối</option>
                            <option value="SNACK">🍎 Bữa Phụ</option>
                        </select>
                    </div>
                </div>

                <div className="bg-emerald-500 p-8 rounded-[32px] shadow-2xl shadow-emerald-500/20 flex flex-col justify-center items-center text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-125" />
                    <p className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-1 relative z-10">Thư viện hiện có</p>
                    <p className="text-4xl font-black relative z-10 tracking-tighter">{totalElements}</p>
                    <p className="text-[10px] text-emerald-100/60 mt-2 font-medium relative z-10 text-center uppercase tracking-tighter">Tổng số món ăn</p>
                </div>
            </div>

            {/* Table Container with Premium Styling */}
            <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
                <div className="relative">
                    <DataTable
                        columns={columns}
                        data={data}
                        // Pagination
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                        }}
                        // Sorting
                        sorting={sorting}
                        onSortingChange={setSorting}
                        // Selection
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                    />
                </div>
            </div>

            {/* Bulk Action Toolbar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6">
                        <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                                {selectedIds.length}
                            </div>
                            <span className="text-white font-bold text-sm whitespace-nowrap">Đang chọn</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Verify Actions */}
                            <button
                                onClick={() => handleBatchVerify(true)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <ShieldCheck className="w-4 h-4" /> Xác nhận chuẩn
                            </button>

                            <button
                                onClick={() => handleBatchVerify(false)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-amber-500/20 rounded-full text-amber-400 text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <ShieldCheck className="w-4 h-4 opacity-50" /> Hủy xác nhận
                            </button>

                            {/* Visibility Actions */}
                            <button
                                onClick={() => handleBatchStatus(false)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <Eye className="w-4 h-4" /> Hiển thị
                            </button>

                            <button
                                onClick={() => handleBatchStatus(true)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-500/20 rounded-full text-slate-400 text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <EyeOff className="w-4 h-4" /> Ẩn đi
                            </button>
                        </div>

                        <button
                            onClick={() => setRowSelection({})}
                            className="ml-4 p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                            title="Bỏ chọn"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="h-20" />

            <FoodFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingDish(null);
                }}
                onSubmit={handleSubmit}
                editingDish={editingDish}
            />

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
