/**
 * Meal Check-In Modal Component
 *
 * Modal for entering a different meal than planned.
 * Triggers adjustment logic if calories deviate significantly.
 *
 * @see /hooks/use-meal-schedule.ts - Data hook
 */

'use client';

import { useState, useCallback } from 'react';
import { useMealSchedule } from '@/hooks/use-meal-schedule';
import {
    MEAL_TYPE_CONFIG,
} from '@/lib/constants/schedule.constants';
import { X, Search, Plus } from 'lucide-react';
import { MOCK_FOOD_DATABASE, FoodItem } from '@/lib/mock-data';

// ============================================================
// COMPONENT
// ============================================================

export const MealCheckInModal = () => {
    const {
        selectedMeal,
        showCheckInModal,
        isCheckingIn,
        closeCheckInModal,
        checkInMeal,
    } = useMealSchedule();

    const [searchQuery, setSearchQuery] = useState('');
    const [customMeal, setCustomMeal] = useState({
        title: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });
    const [showCustomForm, setShowCustomForm] = useState(false);

    // Filter foods based on search
    const filteredFoods = MOCK_FOOD_DATABASE.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectFood = useCallback(async (food: FoodItem) => {
        if (!selectedMeal) return;

        const result = await checkInMeal(selectedMeal, {
            title: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
        });

        if (result.success) {
            closeCheckInModal();
            setSearchQuery('');
        }
    }, [selectedMeal, checkInMeal, closeCheckInModal]);

    const handleCustomSubmit = useCallback(async () => {
        if (!selectedMeal || !customMeal.title || customMeal.calories <= 0) return;

        const result = await checkInMeal(selectedMeal, customMeal);

        if (result.success) {
            closeCheckInModal();
            setCustomMeal({ title: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
            setShowCustomForm(false);
        }
    }, [selectedMeal, customMeal, checkInMeal, closeCheckInModal]);

    if (!showCheckInModal || !selectedMeal) return null;

    const mealConfig = MEAL_TYPE_CONFIG[selectedMeal.mealType];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeCheckInModal}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{mealConfig.icon}</span>
                                <div>
                                    <p className="text-sm text-slate-500">Thay đổi {mealConfig.label}</p>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Bạn đã ăn món gì?
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={closeCheckInModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Original meal info */}
                        <div className="mt-4 px-4 py-3 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-500">Món ăn theo kế hoạch:</p>
                            <p className="font-medium text-slate-700">
                                {selectedMeal.title} ({selectedMeal.calories} kcal)
                            </p>
                        </div>
                    </div>

                    {/* Search / Custom Toggle */}
                    <div className="p-4 border-b border-slate-100">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCustomForm(false)}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!showCustomForm
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <Search className="w-4 h-4 inline mr-1" />
                                Tìm món ăn
                            </button>
                            <button
                                onClick={() => setShowCustomForm(true)}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${showCustomForm
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <Plus className="w-4 h-4 inline mr-1" />
                                Nhập thủ công
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {!showCustomForm ? (
                            <>
                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Tìm kiếm món ăn..."
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                {/* Food List */}
                                <div className="space-y-2">
                                    {filteredFoods.length > 0 ? (
                                        filteredFoods.map((food) => (
                                            <button
                                                key={food.id}
                                                onClick={() => handleSelectFood(food)}
                                                disabled={isCheckingIn}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left disabled:opacity-50"
                                            >
                                                <span className="text-2xl">{food.icon}</span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-800">{food.name}</p>
                                                    <p className="text-sm text-slate-500">{food.serving}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-orange-500">{food.calories}</p>
                                                    <p className="text-xs text-slate-400">kcal</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <p>Không tìm thấy món ăn</p>
                                            <button
                                                onClick={() => setShowCustomForm(true)}
                                                className="mt-2 text-primary font-medium hover:underline"
                                            >
                                                Nhập thủ công
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Custom Form */
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Tên món ăn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customMeal.title}
                                        onChange={(e) => setCustomMeal({ ...customMeal, title: e.target.value })}
                                        placeholder="VD: Buffet nướng"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Calories (ước tính) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={customMeal.calories || ''}
                                        onChange={(e) => setCustomMeal({ ...customMeal, calories: parseInt(e.target.value) || 0 })}
                                        placeholder="VD: 1500"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Protein (g)
                                        </label>
                                        <input
                                            type="number"
                                            value={customMeal.protein || ''}
                                            onChange={(e) => setCustomMeal({ ...customMeal, protein: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Carbs (g)
                                        </label>
                                        <input
                                            type="number"
                                            value={customMeal.carbs || ''}
                                            onChange={(e) => setCustomMeal({ ...customMeal, carbs: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Fat (g)
                                        </label>
                                        <input
                                            type="number"
                                            value={customMeal.fat || ''}
                                            onChange={(e) => setCustomMeal({ ...customMeal, fat: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={isCheckingIn || !customMeal.title || customMeal.calories <= 0}
                                    className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCheckingIn ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
