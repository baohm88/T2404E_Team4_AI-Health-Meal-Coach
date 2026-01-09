/**
 * Food Form Modal Component
 * 
 * Unified Modal for both Create and Edit food items.
 * Supports duplicate name validation and form validation.
 */

'use client';

import { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react';
import { X, Utensils, Edit3 } from 'lucide-react';
import { FoodItem } from '@/lib/mock-data';

// ============================================================
// TYPES
// ============================================================

interface FoodFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<FoodItem, 'id'>, isEdit: boolean) => void;
    existingNames: string[];
    /** If provided, modal is in Edit mode. Otherwise, Create mode. */
    editingFood: FoodItem | null;
}

interface FormData {
    name: string;
    category: FoodItem['category'];
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    serving: string;
    icon: string;
}

interface FormErrors {
    name?: string;
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORY_OPTIONS: { value: FoodItem['category']; label: string }[] = [
    { value: 'main', label: 'Món chính' },
    { value: 'protein', label: 'Protein' },
    { value: 'fruit', label: 'Trái cây' },
    { value: 'vegetable', label: 'Rau củ' },
    { value: 'snack', label: 'Snack' },
    { value: 'drink', label: 'Đồ uống' },
];

const ICON_OPTIONS = ['🍜', '🍚', '🍗', '🥚', '🍎', '🍌', '🥗', '🥖', '🥛', '🥜', '🍲', '🥓', '🧀', '🍳', '🥩', '🍕'];

const INITIAL_FORM_DATA: FormData = {
    name: '',
    category: 'main',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving: '1 phần',
    icon: '🍜',
};

// ============================================================
// COMPONENT
// ============================================================

export function FoodFormModal({ isOpen, onClose, onSubmit, existingNames, editingFood }: FoodFormModalProps) {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});

    // Determine if we're in Edit mode
    const isEditMode = editingFood !== null;

    // Fill form with editing data when modal opens in Edit mode
    useEffect(() => {
        if (isOpen && editingFood) {
            // Edit mode: fill form with existing data
            setFormData({
                name: editingFood.name,
                category: editingFood.category,
                calories: String(editingFood.calories),
                protein: String(editingFood.protein),
                carbs: String(editingFood.carbs),
                fat: String(editingFood.fat),
                serving: editingFood.serving,
                icon: editingFood.icon,
            });
            setErrors({});
        } else if (isOpen && !editingFood) {
            // Create mode: reset form
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
        }
    }, [isOpen, editingFood]);

    // Handle input change
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        } else {
            // Check duplicate name (skip if editing same food)
            const isDuplicate = existingNames.some(
                name => name.toLowerCase().trim() === formData.name.toLowerCase().trim()
            );

            // If editing, allow same name as original
            const isSameName = isEditMode &&
                editingFood?.name.toLowerCase().trim() === formData.name.toLowerCase().trim();

            if (isDuplicate && !isSameName) {
                newErrors.name = 'Món ăn này đã tồn tại trong kho!';
            }
        }

        // Check calories
        const calories = parseInt(formData.calories);
        if (!formData.calories || isNaN(calories)) {
            newErrors.calories = 'Vui lòng nhập số calo';
        } else if (calories < 0) {
            newErrors.calories = 'Calo không được âm';
        }

        // Check macros (optional but must be valid if provided)
        if (formData.protein && parseInt(formData.protein) < 0) {
            newErrors.protein = 'Không được âm';
        }
        if (formData.carbs && parseInt(formData.carbs) < 0) {
            newErrors.carbs = 'Không được âm';
        }
        if (formData.fat && parseInt(formData.fat) < 0) {
            newErrors.fat = 'Không được âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, existingNames, isEditMode, editingFood]);

    // Handle submit
    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const foodData: Omit<FoodItem, 'id'> = {
            name: formData.name.trim(),
            category: formData.category,
            calories: parseInt(formData.calories) || 0,
            protein: parseInt(formData.protein) || 0,
            carbs: parseInt(formData.carbs) || 0,
            fat: parseInt(formData.fat) || 0,
            serving: formData.serving || '1 phần',
            icon: formData.icon,
        };

        onSubmit(foodData, isEditMode);
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
                    {/* Icon & Name Row */}
                    <div className="flex gap-3">
                        {/* Icon Picker */}
                        <div className="shrink-0">
                            <label className="block text-xs text-slate-500 font-medium mb-1">Icon</label>
                            <select
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="w-16 h-11 text-2xl text-center rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                {ICON_OPTIONS.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>

                        {/* Name Input */}
                        <div className="flex-1">
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
                    </div>

                    {/* Category & Serving */}
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
                            <label className="block text-xs text-slate-500 font-medium mb-1">Khẩu phần</label>
                            <input
                                type="text"
                                name="serving"
                                value={formData.serving}
                                onChange={handleChange}
                                placeholder="1 phần"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    {/* Calories */}
                    <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1">
                            Calo (kcal) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="calories"
                            value={formData.calories}
                            onChange={handleChange}
                            placeholder="Ví dụ: 450"
                            min="0"
                            className={`w-full px-4 py-2.5 rounded-xl border ${errors.calories ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
                                } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                        />
                        {errors.calories && (
                            <p className="text-xs text-red-500 mt-1">{errors.calories}</p>
                        )}
                    </div>

                    {/* Macros Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 font-medium mb-1">
                                <span className="text-red-500">Protein</span> (g)
                            </label>
                            <input
                                type="number"
                                name="protein"
                                value={formData.protein}
                                onChange={handleChange}
                                placeholder="25"
                                min="0"
                                className={`w-full px-3 py-2.5 rounded-xl border ${errors.protein ? 'border-red-400' : 'border-slate-200'
                                    } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 font-medium mb-1">
                                <span className="text-yellow-600">Carbs</span> (g)
                            </label>
                            <input
                                type="number"
                                name="carbs"
                                value={formData.carbs}
                                onChange={handleChange}
                                placeholder="60"
                                min="0"
                                className={`w-full px-3 py-2.5 rounded-xl border ${errors.carbs ? 'border-red-400' : 'border-slate-200'
                                    } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 font-medium mb-1">
                                <span className="text-blue-500">Fat</span> (g)
                            </label>
                            <input
                                type="number"
                                name="fat"
                                value={formData.fat}
                                onChange={handleChange}
                                placeholder="12"
                                min="0"
                                className={`w-full px-3 py-2.5 rounded-xl border ${errors.fat ? 'border-red-400' : 'border-slate-200'
                                    } focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                            />
                        </div>
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
