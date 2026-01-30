/**
 * StrategicMealCard
 *
 * Displays the next meal in the AI-generated schedule.
 * High-action widget for quick check-ins.
 */

'use client';

import { Check, Clock, Sparkles } from 'lucide-react';
import { NextStrategicMeal } from '@/types/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StrategicMealCardProps {
    meal?: NextStrategicMeal;
    currentDay?: number;
    onCheckIn?: (id: number) => void;
    isLoading?: boolean;
}

const mealTypeColors: Record<string, string> = {
    'Sáng': 'from-blue-500 to-indigo-600',
    'Trưa': 'from-orange-400 to-red-500',
    'Tối': 'from-indigo-600 to-purple-700',
    'Phụ': 'from-emerald-400 to-teal-500',
};

const mealTypeLabels: Record<string, string> = {
    'Sáng': 'Bữa Sáng',
    'Trưa': 'Bữa Trưa',
    'Tối': 'Bữa Tối',
    'Phụ': 'Bữa Phụ',
};

export function StrategicMealCard({ meal, currentDay = 0, onCheckIn, isLoading }: StrategicMealCardProps) {
    if (!meal) return null;

    const isFuture = meal.day > currentDay;
    const baseColor = mealTypeColors[meal.type] || 'from-slate-700 to-slate-900';

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative group h-full flex flex-col justify-between">
            {/* Background Accent */}
            <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110", baseColor)} />

            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r shadow-lg shadow-black/5", baseColor)}>
                            Bữa Ăn Chiến Lược
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                        <Clock className="w-3.5 h-3.5" />
                        {mealTypeLabels[meal.type] || meal.type}
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-800 leading-tight line-clamp-2">
                            {meal.mealName}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-primary tracking-tighter">
                                {meal.plannedCalories}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                kcal Mục tiêu
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center min-w-[60px]">
                        <button
                            onClick={() => !meal.checkedIn && !isFuture && onCheckIn?.(meal.id)}
                            disabled={meal.checkedIn || isFuture || isLoading}
                            className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95",
                                meal.checkedIn
                                    ? "bg-emerald-500 text-white shadow-emerald-200"
                                    : isFuture
                                        ? "bg-slate-100 text-slate-300 shadow-none cursor-not-allowed"
                                        : "bg-slate-900 text-white hover:bg-emerald-500 shadow-slate-200"
                            )}
                        >
                            {meal.checkedIn ? <Check className="w-6 h-6 stroke-[3]" /> : <Sparkles className="w-6 h-6" />}
                        </button>
                        <span className="text-[9px] font-black text-center uppercase text-slate-400 tracking-tighter">
                            {meal.checkedIn ? 'Đã Ăn' : isFuture ? 'Sắp Tới' : 'Ăn Ngay'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    Trạng Thái Hôm Nay
                </p>
                <div className="flex items-center gap-1.5">
                    <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-md",
                        meal.checkedIn ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    )}>
                        NGÀY {meal.day}
                    </span>
                </div>
            </div>
        </div>
    );
}
