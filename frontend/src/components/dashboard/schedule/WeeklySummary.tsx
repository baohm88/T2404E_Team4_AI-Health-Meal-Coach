/**
 * Weekly Summary Component
 *
 * Displays weekly calorie and macro progress overview.
 *
 * @see /hooks/use-meal-schedule.ts - Data hook
 */

'use client';

import { useMealSchedule } from '@/hooks/use-meal-schedule';
import { MEAL_STATUS_CONFIG, VIETNAMESE_DAYS_SHORT } from '@/lib/constants/schedule.constants';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================================
// COMPONENT
// ============================================================

export const WeeklySummary = () => {
    const { schedule, todaySummary } = useMealSchedule();

    if (!schedule) {
        return (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-center py-6 text-slate-400">
                    <p>Chưa có dữ liệu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Tổng quan tuần</h3>

            {/* Today's Progress */}
            {todaySummary && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">Hôm nay</span>
                        <DeviationBadge deviation={todaySummary.calorieDeviation} />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-end justify-between mb-2">
                            <div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {todaySummary.actualCalories}
                                </p>
                                <p className="text-xs text-slate-400">
                                    / {todaySummary.targetCalories} kcal
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-600">
                                    {todaySummary.meals.filter(m => m.status === 'completed' || m.status === 'modified').length}
                                    /{todaySummary.meals.length}
                                </p>
                                <p className="text-xs text-slate-400">bữa hoàn thành</p>
                            </div>
                        </div>
                        <ProgressBar
                            value={todaySummary.actualCalories}
                            max={todaySummary.targetCalories}
                        />
                    </div>
                </div>
            )}

            {/* Weekly Calendar Preview */}
            <div className="mb-4">
                <p className="text-sm text-slate-500 mb-2">7 ngày</p>
                <div className="flex gap-1">
                    {schedule.days.map((day, index) => {
                        const isToday = day.date === new Date().toISOString().split('T')[0];
                        const completedMeals = day.meals.filter(
                            m => m.status === 'completed' || m.status === 'modified'
                        ).length;
                        const progress = completedMeals / day.meals.length;

                        return (
                            <div
                                key={day.date}
                                className={`flex-1 text-center py-2 rounded-lg ${isToday ? 'bg-primary/10 ring-2 ring-primary' : 'bg-slate-50'
                                    }`}
                            >
                                <p className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-slate-500'
                                    }`}>
                                    {VIETNAMESE_DAYS_SHORT[new Date(day.date).getDay()]}
                                </p>
                                <div
                                    className={`w-2 h-2 rounded-full mx-auto mt-1 ${progress >= 1
                                            ? 'bg-green-500'
                                            : progress > 0
                                                ? 'bg-amber-500'
                                                : 'bg-slate-200'
                                        }`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Meal Status Legend */}
            <div>
                <p className="text-sm text-slate-500 mb-2">Chú thích</p>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(MEAL_STATUS_CONFIG).map(([status, config]) => (
                        <div
                            key={status}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${config.bgColor} ${config.textColor}`}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                            {config.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

const DeviationBadge = ({ deviation }: { deviation: number }) => {
    if (Math.abs(deviation) < 50) {
        return (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <Minus className="w-3 h-3" />
                Đúng kế hoạch
            </span>
        );
    }

    if (deviation > 0) {
        return (
            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +{deviation} kcal
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
            <TrendingDown className="w-3 h-3" />
            {deviation} kcal
        </span>
    );
};

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const isOver = value > max;

    return (
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-primary'
                    }`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};
