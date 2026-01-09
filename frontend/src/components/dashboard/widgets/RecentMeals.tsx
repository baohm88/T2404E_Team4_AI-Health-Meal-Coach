'use client';

import { MOCK_MEALS } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function RecentMeals() {
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

            <div className="space-y-3">
                {MOCK_MEALS.map((meal) => (
                    <div
                        key={meal.id}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                            {meal.icon}
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
        </div>
    );
}
