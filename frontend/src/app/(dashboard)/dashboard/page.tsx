'use client';

import { CalorieCircle } from '@/components/dashboard/widgets/CalorieCircle';
import { MacrosBreakdown } from '@/components/dashboard/widgets/MacrosBreakdown';
import { WaterTracker } from '@/components/dashboard/widgets/WaterTracker';
import { RecentMeals } from '@/components/dashboard/widgets/RecentMeals';
import { MOCK_STATS } from '@/lib/mock-data';
import { Footprints, Flame } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Đốt cháy</p>
                            <p className="font-bold text-slate-800">{MOCK_STATS.caloriesOut} kcal</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Footprints className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Bước chân</p>
                            <p className="font-bold text-slate-800">{MOCK_STATS.steps.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm col-span-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Mục tiêu hôm nay</p>
                            <p className="font-bold text-slate-800">{MOCK_STATS.caloriesGoal} kcal</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Còn lại</p>
                            <p className="font-bold text-primary">{MOCK_STATS.caloriesRemaining} kcal</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Calories & Macros */}
                <div className="lg:col-span-1 space-y-6">
                    <CalorieCircle />
                    <MacrosBreakdown />
                </div>

                {/* Center & Right - Water & Meals */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WaterTracker />
                        <div className="bg-gradient-to-br from-primary to-green-600 rounded-3xl p-6 text-white">
                            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-80">
                                AI Coach
                            </h3>
                            <p className="text-lg font-medium mb-4">
                                Bạn đang làm rất tốt! Hãy uống thêm 3 ly nước nữa để đạt mục tiêu.
                            </p>
                            <button className="px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all">
                                Xem gợi ý
                            </button>
                        </div>
                    </div>
                    <RecentMeals />
                </div>
            </div>
        </div>
    );
}
