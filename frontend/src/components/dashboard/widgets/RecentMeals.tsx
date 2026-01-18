/**
 * RecentMeals Widget
 *
 * Displays today's meals with calories.
 * Uses props instead of mock data for real API integration.
 */

'use client';

import { ChevronRight, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================

export interface MealItem {
    id: string;
    name: string;
    time: string;
    calories: number;
    icon?: string;
}

interface RecentMealsProps {
    meals?: MealItem[];
}

// ============================================================
// COMPONENT
// ============================================================

export function RecentMeals({ meals = [] }: RecentMealsProps) {
    const isEmpty = meals.length === 0;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Bữa ăn hôm nay
                </h3>
                <Link
                    href="/dashboard/diary"
                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                    Xem tất cả
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <UtensilsCrossed className="w-12 h-12 mb-3" />
                    <p className="text-sm">Chưa có bữa ăn nào hôm nay</p>
                    <Link
                        href="/dashboard/diary"
                        className="mt-3 text-sm text-primary font-medium hover:underline"
                    >
                        + Thêm bữa ăn
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {meals.map((meal) => (
                        <div
                            key={meal.id}
                            className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                                {meal.icon || '🍽️'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{meal.name}</p>
                                <p className="text-sm text-slate-500">{meal.time}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-primary">{meal.calories}</p>
                                <p className="text-xs text-slate-400">kcal</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
