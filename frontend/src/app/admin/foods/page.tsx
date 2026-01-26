"use client";

import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Coffee, Edit, Moon, Plus, Sun, Trash2, Undo2, Utensils } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table/data-table";
import { FoodFormModal } from "@/components/admin/FoodFormModal";
import { Button } from "@/components/ui/Button";
import { createDish, getDishes, toggleDishStatus, updateDish } from "@/services/admin.service";
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
    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
    
    // Filters
    const [keyword, setKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<MealTimeSlot | undefined>(undefined);

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

    // Handlers
    const handleToggleStatus = async (dish: DishLibrary) => {
        const action = dish.isDeleted ? 'khôi phục' : 'ẩn';
        if (window.confirm(`Bạn chắc chắn muốn ${action} món "${dish.name}"?`)) {
            try {
                await toggleDishStatus(dish.id);
                toast.success(`Đã ${action} món ăn`);
                fetchData();
            } catch (error) {
                toast.error('Lỗi cập nhật trạng thái');
            }
        }
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

    // Columns
    const columns: ColumnDef<DishLibrary>[] = [
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
            accessorKey: "calories",
            header: "Calo",
            cell: ({ row }) => <span className="font-bold text-slate-700">{row.original.calories} kcal</span>,
            enableSorting: true,
        },
        {
            accessorKey: "isDeleted",
            header: "Trạng thái",
            cell: ({ row }) => (
                row.original.isDeleted ? (
                    <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 font-medium border border-red-100">Đã xóa</span>
                ) : (
                    <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-medium border border-emerald-100">Hiện</span>
                )
            ),
            enableSorting: true,
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => {
                const dish = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleEdit(dish)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Chỉnh sửa"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleToggleStatus(dish)}
                            className={`p-2 rounded-lg transition-colors ${dish.isDeleted ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-400 hover:bg-red-50'}`}
                            title={dish.isDeleted ? "Khôi phục" : "Xóa"}
                        >
                            {dish.isDeleted ? <Undo2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                )
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý món ăn</h1>
                    <p className="text-slate-500">Cơ sở dữ liệu món ăn và thông tin dinh dưỡng</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Thêm món mới
                </Button>
            </div>

            {/* Additional Custom Filter Logic for Category can be injected via Toolbar or separate UI above table 
                For now, we can put a simple Select above or modify Helper to accept children?
                Or update DataTableToolbar to accept extra filters. 
                Let's put the Category select ABOVE the table for now for simplicity, 
                or pass it as a custom filter if we had time to refactor Toolbar.
            */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center">
                 <span className="text-sm font-medium text-slate-700">Lọc theo:</span>
                 <select 
                    value={selectedCategory || ''}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value ? e.target.value as MealTimeSlot : undefined);
                        setPageIndex(0);
                    }}
                    className="h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">Tất cả bữa ăn</option>
                    <option value="BREAKFAST">Sáng</option>
                    <option value="LUNCH">Trưa</option>
                    <option value="DINNER">Tối</option>
                    <option value="SNACK">Phụ</option>
                 </select>
            </div>

            <DataTable 
                columns={columns} 
                data={data}
                searchKey="name"
                searchValue={keyword}
                onSearchChange={setKeyword}
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
            />

            <FoodFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingDish(null);
                }}
                onSubmit={handleSubmit}
                editingDish={editingDish}
            />
        </div>
    );
}
