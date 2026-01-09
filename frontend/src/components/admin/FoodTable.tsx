/**
 * Food Table Component
 * 
 * Reusable data table for displaying food items with edit/delete actions.
 * Follows Single Responsibility Principle - only handles display logic.
 */

'use client';

import { Edit, Trash2 } from 'lucide-react';
import { FoodItem } from '@/lib/mock-data';
import { DataTable, Column } from '@/components/admin/DataTable';

// ============================================================
// TYPES
// ============================================================

export interface FoodTableProps {
    /** List of food items to display */
    data: FoodItem[];
    /** Callback when Edit button is clicked */
    onEdit: (food: FoodItem) => void;
    /** Callback when Delete button is clicked */
    onDelete: (food: FoodItem) => void;
    /** Message to show when table is empty */
    emptyMessage?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const categoryLabels: Record<FoodItem['category'], string> = {
    main: 'Món chính',
    protein: 'Protein',
    fruit: 'Trái cây',
    vegetable: 'Rau củ',
    snack: 'Snack',
    drink: 'Đồ uống',
};

// ============================================================
// COMPONENT
// ============================================================

export function FoodTable({ data, onEdit, onDelete, emptyMessage = 'Không có dữ liệu' }: FoodTableProps) {

    const columns: Column<FoodItem>[] = [
        {
            key: 'name',
            header: 'Món ăn',
            render: (food) => (
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{food.icon}</span>
                    <div>
                        <p className="font-medium text-slate-800">{food.name}</p>
                        <p className="text-xs text-slate-500">{food.serving}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Phân loại',
            render: (food) => (
                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                    {categoryLabels[food.category]}
                </span>
            ),
        },
        {
            key: 'calories',
            header: 'Calo',
            render: (food) => (
                <span className="font-semibold text-slate-800">{food.calories} kcal</span>
            ),
        },
        {
            key: 'macros',
            header: 'P / C / F',
            render: (food) => (
                <div className="text-xs text-slate-600">
                    <span className="text-red-500 font-medium">{food.protein}g</span>
                    {' / '}
                    <span className="text-yellow-600 font-medium">{food.carbs}g</span>
                    {' / '}
                    <span className="text-blue-500 font-medium">{food.fat}g</span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Hành động',
            render: (food) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(food);
                        }}
                        className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(food);
                        }}
                        className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            keyExtractor={(food) => food.id}
            emptyMessage={emptyMessage}
        />
    );
}
