/**
 * Food Database Management Page
 * 
 * Admin page for managing food database with CRUD operations.
 * Refactored to follow Single Responsibility Principle.
 * 
 * Components Used:
 * - FoodTable: Handles table display
 * - FoodFormModal: Handles Create/Edit form
 * - Toast: Handles notifications
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { MOCK_FOOD_DATABASE, FoodItem } from '@/lib/mock-data';
import { FoodTable } from '@/components/admin/FoodTable';
import { FoodFormModal } from '@/components/admin/FoodFormModal';
import { Toast, ToastData } from '@/components/ui/Toast';

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function FoodDatabasePage() {
    // ============================================================
    // STATE
    // ============================================================

    const [foods, setFoods] = useState<FoodItem[]>(MOCK_FOOD_DATABASE);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<ToastData | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

    // ============================================================
    // DERIVED DATA
    // ============================================================

    const filteredFoods = useMemo(() => {
        if (!searchQuery.trim()) return foods;
        const query = searchQuery.toLowerCase();
        return foods.filter((food) => food.name.toLowerCase().includes(query));
    }, [searchQuery, foods]);

    const existingNames = useMemo(() => foods.map(f => f.name), [foods]);

    // ============================================================
    // HELPERS
    // ============================================================

    const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // ============================================================
    // HANDLERS
    // ============================================================

    /** Open Modal for Create */
    const handleOpenCreate = useCallback(() => {
        setEditingFood(null);
        setIsModalOpen(true);
    }, []);

    /** Open Modal for Edit */
    const handleEdit = useCallback((food: FoodItem) => {
        setEditingFood(food);
        setIsModalOpen(true);
    }, []);

    /** Close Modal */
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingFood(null);
    }, []);

    /** Handle Create/Update from Modal */
    const handleSubmit = useCallback((foodData: Omit<FoodItem, 'id'>, isEdit: boolean) => {
        if (isEdit && editingFood) {
            // UPDATE
            setFoods(prev => prev.map(food =>
                food.id === editingFood.id ? { ...food, ...foodData } : food
            ));
            showToast(`Đã cập nhật món "${foodData.name}" thành công!`);
        } else {
            // CREATE
            const newFood: FoodItem = { ...foodData, id: `f${Date.now()}` };
            setFoods(prev => [newFood, ...prev]);
            showToast(`Đã thêm món "${foodData.name}" thành công!`);
        }
        handleCloseModal();
    }, [editingFood, showToast, handleCloseModal]);

    /** Handle Delete */
    const handleDelete = useCallback((food: FoodItem) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa món "${food.name}"?`)) {
            setFoods(prev => prev.filter(item => item.id !== food.id));
            showToast(`Đã xóa món "${food.name}"`);
        }
    }, [showToast]);

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Modal */}
            <FoodFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                existingNames={existingNames}
                editingFood={editingFood}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <p className="text-slate-500">
                    Tổng cộng <span className="font-semibold text-slate-800">{foods.length}</span> món ăn
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm món ăn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Thêm món mới</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <FoodTable
                data={filteredFoods}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage="Không tìm thấy món ăn"
            />
        </div>
    );
}
