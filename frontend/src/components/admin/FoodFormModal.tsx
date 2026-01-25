/**
 * Dish Form Modal Component
 * 
 * Unified Modal for both Create and Edit dish items.
 * Matches Backend DishLibrary entity.
 */

'use client';

import { CreateDishRequest, DishLibrary, MealTimeSlot } from '@/types/admin';
import { Edit3, Utensils, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface DishFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDishRequest, isEdit: boolean) => void;
    /** If provided, modal is in Edit mode. Otherwise, Create mode. */
    editingDish: DishLibrary | null;
}

interface FormData {
    name: string;
    category: MealTimeSlot;
    baseCalories: string;
    unit: string;
    description: string;
}

interface FormErrors {
    name?: string;
    baseCalories?: string;
    unit?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORY_OPTIONS: { value: MealTimeSlot; label: string }[] = [
    { value: MealTimeSlot.BREAKFAST, label: 'Bữa Sáng' },
    { value: MealTimeSlot.LUNCH, label: 'Bữa Trưa' },
    { value: MealTimeSlot.DINNER, label: 'Bữa Tối' },
    { value: MealTimeSlot.SNACK, label: 'Bữa Phụ' },
];

const INITIAL_FORM_DATA: FormData = {
    name: '',
    category: MealTimeSlot.LUNCH,
    baseCalories: '',
    unit: 'phần',
    description: '',
};

// ============================================================
// COMPONENT
// ============================================================

export function FoodFormModal({ isOpen, onClose, onSubmit, editingDish }: DishFormModalProps) {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});

    // Determine if we're in Edit mode
    const isEditMode = editingDish !== null;

    // Fill form with editing data when modal opens in Edit mode
    useEffect(() => {
        if (isOpen && editingDish) {
            // Edit mode: fill form with existing data
            setFormData({
                name: editingDish.name,
                category: editingDish.category,
                baseCalories: String(editingDish.baseCalories || ''),
                unit: editingDish.unit || 'phần',
                description: editingDish.description || '',
            });
            setErrors({});
        } else if (isOpen && !editingDish) {
            // Create mode: reset form
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
        }
    }, [isOpen, editingDish]);

    // Handle input change
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Check empty name
        if (!formData.name.trim()) {
            newErrors.name = 'Tên món không được để trống';
        }

        // Check calories
        const calories = parseInt(formData.baseCalories);
        if (!formData.baseCalories || isNaN(calories)) {
            newErrors.baseCalories = 'Vui lòng nhập số calo';
        } else if (calories < 0) {
            newErrors.baseCalories = 'Calo không được âm';
        }

        // Check unit
        if (!formData.unit.trim()) {
            newErrors.unit = 'Đơn vị tính không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle submit
    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const dishData: CreateDishRequest = {
            name: formData.name.trim(),
            category: formData.category,
            baseCalories: parseInt(formData.baseCalories) || 0,
            unit: formData.unit.trim(),
            description: formData.description.trim(),
        };

        onSubmit(dishData, isEditMode);
    }, [formData, validateForm, onSubmit, isEditMode]);

    // Handle close
    const handleClose = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditMode ? 'bg-blue-100' : 'bg-primary/10'
                            }`}>
                            {isEditMode ? (
                                <Edit3 className="w-5 h-5 text-blue-600" />
                            ) : (
                                <Utensils className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">
                            {isEditMode ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1">
                            Tên món <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ví dụ: Phở bò"
                            className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
                                } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Category & Unit */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 font-medium mb-1">Phân loại</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            >
                                {CATEGORY_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 font-medium mb-1">Đơn vị tính <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                placeholder="bát, đĩa..."
                                className={`w-full px-4 py-2.5 rounded-xl border ${errors.unit ? 'border-red-400' : 'border-slate-200'
                                    } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                            />
                            {errors.unit && (
                                <p className="text-xs text-red-500 mt-1">{errors.unit}</p>
                            )}
                        </div>
                    </div>

                    {/* Calories */}
                    <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1">
                            Calo cơ bản (kcal) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="baseCalories"
                            value={formData.baseCalories}
                            onChange={handleChange}
                            placeholder="Ví dụ: 450"
                            min="0"
                            className={`w-full px-4 py-2.5 rounded-xl border ${errors.baseCalories ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
                                } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                        />
                        {errors.baseCalories && (
                            <p className="text-xs text-red-500 mt-1">{errors.baseCalories}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1">Mô tả (Tùy chọn)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Mô tả chi tiết về món ăn..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors shadow-lg ${isEditMode
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
                                    : 'bg-primary text-white hover:bg-green-600 shadow-primary/30'
                                }`}
                        >
                            {isEditMode ? 'Cập nhật' : 'Lưu món ăn'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
