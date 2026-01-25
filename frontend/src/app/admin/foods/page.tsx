/**
 * Food Database Management Page
 * 
 * Admin page for managing food database with CRUD operations.
 * Connected to Backend API.
 */

'use client';

import { FoodFormModal } from '@/components/admin/FoodFormModal';
import { FoodTable } from '@/components/admin/FoodTable';
import { Pagination } from '@/components/ui/Pagination';
import { Toast, ToastData } from '@/components/ui/Toast';
import { createDish, getDishes, toggleDishStatus, updateDish } from '@/services/admin.service';
import { CreateDishRequest, DishLibrary, MealTimeSlot } from '@/types/admin';
import { Filter, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function FoodDatabasePage() {
    // ============================================================
    // STATE
    // ============================================================

    const [dishes, setDishes] = useState<DishLibrary[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<MealTimeSlot | undefined>(undefined);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Sorting State
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const [toast, setToast] = useState<ToastData | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<DishLibrary | null>(null);

    // ============================================================
    // HELPERS
    // ============================================================

    const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // ============================================================
    // API CALLS
    // ============================================================

    const fetchDishes = useCallback(async (page: number, query: string, category?: MealTimeSlot, sortCol?: string, sortDir?: 'asc' | 'desc') => {
        setLoading(true);
        try {
            // NOTE: Need to update getDishes signature in admin.service.ts to accept sort
            // For now, assuming getDishes handles params string manually or we update it.
            // Let's check admin.service.ts - it currently hardcodes 'id,desc'.
            // Accessing internal API of getDishes might require update.
            // But wait, the previous `getDishes` implementation used `URLSearchParams`.
            // We need to update `getDishes` to accept sort params too.
            // See next step.
            
            // Wait, I can't change service signature here. I should update service first or pass it if flexible.
            // Actually, I'll update the service call here assuming service will be updated or accept flexible args.
            // Let's modify the service call to pass sort.
            
            const rData = await getDishes(page, 10, query, category, `${sortCol || sortColumn},${sortDir || sortDirection}`);
            setDishes(rData.content);
            setTotalPages(rData.totalPages);
            setTotalElements(rData.totalElements);
            setCurrentPage(rData.number);
        } catch (error) {
            console.error('Failed to fetch dishes:', error);
            showToast('Không thể tải danh sách món ăn', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast, sortColumn, sortDirection]);

    // Initial load & Search/Filter effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDishes(currentPage, searchQuery, selectedCategory, sortColumn, sortDirection);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, currentPage, selectedCategory, sortColumn, sortDirection, fetchDishes]);


    // ============================================================
    // HANDLERS
    // ============================================================

    const handleSort = (column: string) => {
        // Toggle direction if clicking same column
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
        // Effect will trigger fetch
    };

    /** Open Modal for Create */
    const handleOpenCreate = useCallback(() => {
        setEditingDish(null);
        setIsModalOpen(true);
    }, []);

    /** Open Modal for Edit */
    const handleEdit = useCallback((dish: DishLibrary) => {
        setEditingDish(dish);
        setIsModalOpen(true);
    }, []);

    /** Close Modal */
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingDish(null);
    }, []);

    /** Handle Create/Update from Modal */
    const handleSubmit = useCallback(async (dishData: CreateDishRequest, isEdit: boolean) => {
        try {
            if (isEdit && editingDish) {
                // UPDATE
                await updateDish(editingDish.id, dishData);
                showToast(`Đã cập nhật món "${dishData.name}" thành công!`);
            } else {
                // CREATE
                await createDish(dishData);
                showToast(`Đã thêm món "${dishData.name}" thành công!`);
            }
            // Refresh list
            fetchDishes(currentPage, searchQuery, selectedCategory, sortColumn, sortDirection);
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save dish:', error);
            showToast('Có lỗi xảy ra khi lưu món ăn', 'error');
        }
    }, [editingDish, showToast, handleCloseModal, currentPage, searchQuery, selectedCategory, sortColumn, sortDirection, fetchDishes]);

    /** Handle Toggle Status (Soft Delete) */
    const handleToggleStatus = useCallback(async (dish: DishLibrary) => {
        const action = dish.isDeleted ? 'khôi phục' : 'ẩn';
        if (window.confirm(`Bạn chắc chắn muốn ${action} món "${dish.name}"?`)) {
            try {
                await toggleDishStatus(dish.id);
                showToast(`Đã ${action} món "${dish.name}"`);
                fetchDishes(currentPage, searchQuery, selectedCategory, sortColumn, sortDirection);
            } catch (error) {
                console.error('Failed to toggle status:', error);
                showToast('Không thể thay đổi trạng thái', 'error');
            }
        }
    }, [showToast, currentPage, searchQuery, selectedCategory, sortColumn, sortDirection, fetchDishes]);

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
                editingDish={editingDish}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <p className="text-slate-500">
                    Tổng cộng <span className="font-semibold text-slate-800">{totalElements}</span> món ăn
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Category Filter */}
                    <div className="relative">
                        <select 
                            value={selectedCategory || ''}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value ? e.target.value as MealTimeSlot : undefined);
                                setCurrentPage(0);
                            }}
                            className="px-4 py-2.5 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <option value="">Tất cả phân loại</option>
                            <option value="BREAKFAST">Bữa Sáng</option>
                            <option value="LUNCH">Bữa Trưa</option>
                            <option value="DINNER">Bữa Tối</option>
                            <option value="SNACK">Bữa Phụ</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm món ăn..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(0);
                            }}
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
            {loading && dishes.length === 0 ? (
                 <div className="text-center py-12 text-slate-400">Đang tải...</div>
            ) : (
                <>
                    <FoodTable
                        data={dishes}
                        onEdit={handleEdit}
                        onToggleStatus={handleToggleStatus}
                        emptyMessage="Không tìm thấy món ăn"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />

                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
