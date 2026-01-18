/**
 * Meal Plan Generator Component
 *
 * Panel for generating a new AI-powered meal plan.
 *
 * @see /hooks/use-meal-schedule.ts - Data hook
 */

'use client';

import { useState, useCallback } from 'react';
import { useMealSchedule } from '@/hooks/use-meal-schedule';
import { Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================
// COMPONENT
// ============================================================

export const MealPlanGenerator = () => {
    const {
        schedule,
        isGenerating,
        generateSchedule,
        openGeneratePanel,
        weeklyStats,
    } = useMealSchedule();

    const [formData, setFormData] = useState({
        targetCalories: 2400,
        mealsPerDay: 4,
        preferences: '',
        restrictions: '',
    });

    const handleGenerate = useCallback(async () => {
        const result = await generateSchedule({
            userId: 'current_user',
            gender: 'MALE',
            weight: 72,
            height: 174,
            tdee: 2930,
            targetCalories: formData.targetCalories,
            goal: 'WEIGHT_LOSS',
            preferences: formData.preferences || 'Thích ăn thịt gà',
            restrictions: formData.restrictions || 'Không ăn được hành tây',
            mealsPerDay: formData.mealsPerDay,
        });

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }, [formData, generateSchedule]);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-800">AI Tạo lịch ăn</h3>
            </div>

            {schedule ? (
                /* Has existing schedule - show stats & regenerate */
                <div className="space-y-4">
                    {/* Weekly Stats */}
                    {weeklyStats && (
                        <div className="grid grid-cols-2 gap-3">
                            <StatBox
                                label="Đã hoàn thành"
                                value={`${weeklyStats.completedMeals}/${weeklyStats.totalMeals}`}
                                subtext="bữa ăn"
                                color="text-green-500"
                            />
                            <StatBox
                                label="Trung bình"
                                value={weeklyStats.avgDeviation > 0 ? '+' : ''}
                                extraValue={`${Math.round(weeklyStats.avgDeviation)}`}
                                subtext="kcal/ngày"
                                color={weeklyStats.avgDeviation > 100
                                    ? 'text-red-500'
                                    : weeklyStats.avgDeviation < -100
                                        ? 'text-amber-500'
                                        : 'text-green-500'}
                            />
                        </div>
                    )}

                    {/* Schedule Info */}
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-sm text-slate-500">Lịch hiện tại</p>
                        <p className="font-medium text-slate-800">
                            {schedule.startDate} → {schedule.endDate}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            Target: {schedule.targetDailyCalories} kcal/ngày
                        </p>
                    </div>

                    {/* Regenerate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Đang tạo...' : 'Tạo lịch mới'}
                    </button>
                </div>
            ) : (
                /* No schedule - show creation form */
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        Để AI tạo thực đơn 7 ngày phù hợp với mục tiêu của bạn.
                    </p>

                    {/* Target Calories */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Mục tiêu calo/ngày
                        </label>
                        <input
                            type="number"
                            value={formData.targetCalories}
                            onChange={(e) => setFormData({
                                ...formData,
                                targetCalories: parseInt(e.target.value) || 2000
                            })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Meals per day */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Số bữa ăn/ngày
                        </label>
                        <div className="flex gap-2">
                            {[3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setFormData({ ...formData, mealsPerDay: num })}
                                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${formData.mealsPerDay === num
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Sở thích (tùy chọn)
                        </label>
                        <input
                            type="text"
                            value={formData.preferences}
                            onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                            placeholder="VD: Thích ăn thịt gà, hải sản"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Restrictions */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Không ăn được (tùy chọn)
                        </label>
                        <input
                            type="text"
                            value={formData.restrictions}
                            onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                            placeholder="VD: Hành tây, đậu phộng"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-green-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                        {isGenerating ? 'AI đang tạo lịch...' : 'Tạo lịch ăn ngay'}
                    </button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// STAT BOX
// ============================================================

interface StatBoxProps {
    label: string;
    value: string;
    extraValue?: string;
    subtext: string;
    color: string;
}

const StatBox = ({ label, value, extraValue, subtext, color }: StatBoxProps) => (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className={`text-xl font-bold ${color}`}>
            {value}{extraValue}
        </p>
        <p className="text-xs text-slate-400">{subtext}</p>
    </div>
);
