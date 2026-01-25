/**
 * Food Table Component
 * 
 * Reusable data table for displaying dish items with edit/delete actions.
 */

'use client';

import { Column, DataTable } from '@/components/admin/DataTable';
import { DishLibrary, MealTimeSlot } from '@/types/admin';
import { Edit, Eye, EyeOff } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface FoodTableProps {
    /** List of dishes to display */
    data: DishLibrary[];
    /** Callback when Edit button is clicked */
    onEdit: (dish: DishLibrary) => void;
    /** Callback when Toggle Status button is clicked */
    onToggleStatus: (dish: DishLibrary) => void;
    /** Message to show when table is empty */
    emptyMessage?: string;
    // Sorting props
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (column: string) => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const categoryLabels: Record<MealTimeSlot, string> = {
    [MealTimeSlot.BREAKFAST]: 'Bữa Sáng',
    [MealTimeSlot.LUNCH]: 'Bữa Trưa',
    [MealTimeSlot.DINNER]: 'Bữa Tối',
    [MealTimeSlot.SNACK]: 'Bữa Phụ',
};

// ============================================================
// COMPONENT
// ============================================================

export function FoodTable({ 
    data, 
    onEdit, 
    onToggleStatus, 
    emptyMessage = 'Không có dữ liệu',
    sortColumn,
    sortDirection,
    onSort
}: FoodTableProps) {

    const columns: Column<DishLibrary>[] = [
        {
            key: 'name',
            header: 'Món ăn',
            sortable: true, // SORTABLE
            render: (dish) => (
                <div className={`flex items-center gap-3 ${dish.isDeleted ? 'opacity-50' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                        🍲
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{dish.name}</p>
                        <p className="text-xs text-slate-500">{dish.unit}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Phân loại',
            sortable: true, // SORTABLE
            render: (dish) => (
                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                    {categoryLabels[dish.category] || dish.category}
                </span>
            ),
        },
        {
            key: 'baseCalories',
            header: 'Calo',
            sortable: true, // SORTABLE
            render: (dish) => (
                <span className="font-semibold text-slate-800">{dish.baseCalories} kcal</span>
            ),
        },
        {
            key: 'isDeleted', // Sorting by isDeleted (mapped to Status in UI)
            header: 'Trạng thái', 
            sortable: true,
            render: (dish) => (
                <div className="flex gap-2">
                    {dish.isDeleted ? (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">Đã ẩn</span>
                    ) : (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Hiển thị</span>
                    )}
                    {dish.isAiSuggested && (
                        <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100">AI</span>
                    )}
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Hành động',
            render: (dish) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(dish);
                        }}
                        className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(dish);
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            dish.isDeleted 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        title={dish.isDeleted ? "Khôi phục" : "Ẩn món ăn"}
                    >
                        {dish.isDeleted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            keyExtractor={(dish) => String(dish.id)}
            emptyMessage={emptyMessage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
        />
    );
}
