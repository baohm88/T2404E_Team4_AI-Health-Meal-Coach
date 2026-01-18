/**
 * Adjustment Alert Component
 *
 * Alert banner displayed when user deviates from the meal plan.
 * Shows AI advice, exercise suggestions, and adjusted schedule.
 *
 * Features:
 * - Same-day adjustment preview
 * - Late-night compensation with exercise suggestion
 * - Adjusted schedule for next 2 days
 *
 * @see /hooks/use-meal-schedule.ts - Data hook
 */

'use client';

import { useMealSchedule } from '@/hooks/use-meal-schedule';
import { MEAL_TYPE_CONFIG } from '@/lib/constants/schedule.constants';
import { AlertTriangle, X, Check, Dumbbell, Utensils, Moon } from 'lucide-react';

// ============================================================
// COMPONENT
// ============================================================

export const AdjustmentAlert = () => {
    const {
        pendingAdjustment,
        showAdjustmentAlert,
        isLoading,
        applyAdjustment,
        dismissAdjustment,
    } = useMealSchedule();

    if (!showAdjustmentAlert || !pendingAdjustment) return null;

    const handleApply = async () => {
        await applyAdjustment();
    };

    const isOverage = pendingAdjustment.originalDeviation > 0;
    const isLateNight = pendingAdjustment.isLateNightDeviation;
    const compensation = pendingAdjustment.compensation;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[500px] z-50 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className={`p-4 ${isLateNight ? 'bg-purple-50' : isOverage ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${isLateNight ? 'bg-purple-100' : isOverage ? 'bg-red-100' : 'bg-amber-100'}`}>
                            {isLateNight ? (
                                <Moon className="w-5 h-5 text-purple-500" />
                            ) : (
                                <AlertTriangle className={`w-5 h-5 ${isOverage ? 'text-red-500' : 'text-amber-500'}`} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-semibold ${isLateNight ? 'text-purple-800' : isOverage ? 'text-red-800' : 'text-amber-800'}`}>
                                {isLateNight
                                    ? 'Bữa tối nạp quá calo!'
                                    : isOverage
                                        ? 'Vượt mức calo cho phép!'
                                        : 'Thiếu calo hôm nay'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                {isOverage
                                    ? `Bạn đã nạp dư ${pendingAdjustment.originalDeviation} kcal ${isLateNight ? 'bữa tối' : 'hôm nay'}.`
                                    : `Bạn đang thiếu ${Math.abs(pendingAdjustment.originalDeviation)} kcal.`}
                            </p>
                        </div>
                        <button
                            onClick={dismissAdjustment}
                            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* AI Advice */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-green-50 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <p className="text-sm font-medium text-primary mb-1">Lời khuyên từ AI Coach</p>
                            <p className="text-sm text-slate-700">{pendingAdjustment.advice}</p>
                        </div>
                    </div>
                </div>

                {/* Compensation Section (Late-night only) */}
                {isLateNight && compensation && (
                    <div className="p-4 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-700 mb-3">
                            Kế hoạch bù trừ cho ngày mai:
                        </p>

                        <div className="space-y-3">
                            {/* Exercise Suggestion */}
                            {compensation.exercise && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Dumbbell className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-blue-800">
                                            {compensation.exercise.activity}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            {compensation.exercise.duration} phút • Đốt ~{compensation.exercise.caloriesBurned} kcal
                                        </p>
                                    </div>
                                    <span className="text-xl">💪</span>
                                </div>
                            )}

                            {/* Diet Reduction */}
                            {compensation.dietReduction && (
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Utensils className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-orange-800">
                                            Giảm khẩu phần ăn
                                        </p>
                                        <p className="text-sm text-orange-600">
                                            -{compensation.dietReduction.reducedCalories} kcal ngày mai
                                        </p>
                                    </div>
                                    <span className="text-xl">🥗</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Adjusted Days Preview */}
                <div className="p-4 max-h-60 overflow-y-auto">
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                        {isLateNight ? 'Thực đơn điều chỉnh:' : 'Lịch điều chỉnh cho 2 ngày tới:'}
                    </p>

                    <div className="space-y-3">
                        {pendingAdjustment.adjustedDays.map((day) => (
                            <div
                                key={day.date}
                                className="bg-slate-50 rounded-xl p-3"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-800">
                                        {day.dayOfWeek}
                                    </span>
                                    <span className="text-sm text-primary font-medium">
                                        Target: {day.targetCalories} kcal
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {day.meals.slice(0, 4).map((meal) => {
                                        const config = MEAL_TYPE_CONFIG[meal.mealType];
                                        return (
                                            <div
                                                key={meal.id}
                                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${meal.isAiAdjusted
                                                        ? 'bg-primary/10 border border-primary/20'
                                                        : 'bg-white'
                                                    }`}
                                            >
                                                <span>{config.icon}</span>
                                                <span className={`truncate max-w-[80px] ${meal.isAiAdjusted ? 'text-primary font-medium' : 'text-slate-600'
                                                    }`}>
                                                    {meal.title}
                                                </span>
                                                {meal.isAiAdjusted && (
                                                    <span className="text-[10px] text-primary">✨</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                        {pendingAdjustment.reason}
                    </p>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50 flex gap-3">
                    <button
                        onClick={dismissAdjustment}
                        className="flex-1 px-4 py-2.5 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            'Đang áp dụng...'
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                {isLateNight ? 'Lên lịch bù trừ' : 'Áp dụng điều chỉnh'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Custom animation */}
            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};
