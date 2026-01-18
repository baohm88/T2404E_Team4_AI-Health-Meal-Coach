/**
 * Meal Event Modal Component
 *
 * Modal for viewing meal details and actions (check-in, change meal, skip).
 *
 * @see /hooks/use-meal-schedule.ts - Data hook
 */

'use client';

import { useMealSchedule } from '@/hooks/use-meal-schedule';
import {
    MEAL_TYPE_CONFIG,
    MEAL_STATUS_CONFIG,
} from '@/lib/constants/schedule.constants';
import { X, Check, RefreshCw, SkipForward } from 'lucide-react';

// ============================================================
// COMPONENT
// ============================================================

export const MealEventModal = () => {
    const {
        selectedMeal,
        showMealModal,
        isCheckingIn,
        closeMealModal,
        openCheckInModal,
        checkInMeal,
        skipMeal,
    } = useMealSchedule();

    if (!showMealModal || !selectedMeal) return null;

    const mealConfig = MEAL_TYPE_CONFIG[selectedMeal.mealType];
    const statusConfig = MEAL_STATUS_CONFIG[selectedMeal.status];

    const handleCheckIn = async () => {
        // Direct check-in (same as planned)
        const result = await checkInMeal(selectedMeal);
        if (result.success) {
            closeMealModal();
        }
    };

    const handleChangeMeal = () => {
        // Open check-in modal to enter different meal
        openCheckInModal();
    };

    const handleSkip = async () => {
        const result = await skipMeal(selectedMeal);
        if (result.success) {
            closeMealModal();
        }
    };

    const isUpcoming = selectedMeal.status === 'upcoming';
    const isModified = selectedMeal.status === 'modified';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeMealModal}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="p-6 rounded-t-2xl"
                        style={{ backgroundColor: `${mealConfig.color}15` }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{mealConfig.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {mealConfig.label}
                                    </p>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {selectedMeal.title}
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={closeMealModal}
                                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                            >
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Description */}
                        <p className="text-slate-600">{selectedMeal.description}</p>

                        {/* Nutrition Info */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">
                                Thông tin dinh dưỡng
                                {isModified && (
                                    <span className="text-red-500 ml-2">
                                        (Đã thay đổi)
                                    </span>
                                )}
                            </h4>

                            <div className="grid grid-cols-4 gap-4">
                                <NutritionItem
                                    label="Calo"
                                    value={selectedMeal.actualMeal?.calories || selectedMeal.calories}
                                    unit="kcal"
                                    color="text-orange-500"
                                    original={isModified ? selectedMeal.calories : undefined}
                                />
                                <NutritionItem
                                    label="Protein"
                                    value={selectedMeal.actualMeal?.protein || selectedMeal.protein}
                                    unit="g"
                                    color="text-red-500"
                                    original={isModified ? selectedMeal.protein : undefined}
                                />
                                <NutritionItem
                                    label="Carbs"
                                    value={selectedMeal.actualMeal?.carbs || selectedMeal.carbs}
                                    unit="g"
                                    color="text-blue-500"
                                    original={isModified ? selectedMeal.carbs : undefined}
                                />
                                <NutritionItem
                                    label="Fat"
                                    value={selectedMeal.actualMeal?.fat || selectedMeal.fat}
                                    unit="g"
                                    color="text-yellow-500"
                                    original={isModified ? selectedMeal.fat : undefined}
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {selectedMeal.scheduledTime} - {selectedMeal.date}
                            </span>
                        </div>

                        {/* Actual meal info if modified */}
                        {selectedMeal.actualMeal && (
                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                <h4 className="text-sm font-semibold text-red-700 mb-1">
                                    Món đã ăn thực tế
                                </h4>
                                <p className="text-red-600 font-medium">
                                    {selectedMeal.actualMeal.title}
                                </p>
                                <p className="text-sm text-red-500 mt-1">
                                    Check-in lúc {new Date(selectedMeal.actualMeal.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {isUpcoming && (
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={handleCheckIn}
                                disabled={isCheckingIn}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCheckingIn ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Check className="w-5 h-5" />
                                )}
                                {isCheckingIn ? 'Đang xử lý...' : 'Check-in'}
                            </button>
                            <button
                                onClick={handleChangeMeal}
                                disabled={isCheckingIn}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-700 font-medium rounded-xl hover:bg-amber-200 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Đổi món
                            </button>
                            <button
                                onClick={handleSkip}
                                disabled={isCheckingIn}
                                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                                title="Bỏ qua bữa ăn"
                            >
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// ============================================================
// NUTRITION ITEM
// ============================================================

interface NutritionItemProps {
    label: string;
    value: number;
    unit: string;
    color: string;
    original?: number;
}

const NutritionItem = ({ label, value, unit, color, original }: NutritionItemProps) => (
    <div className="text-center">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className={`text-lg font-bold ${color}`}>
            {value}
            <span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>
        </p>
        {original !== undefined && original !== value && (
            <p className="text-xs text-slate-400 line-through">{original}</p>
        )}
    </div>
);
