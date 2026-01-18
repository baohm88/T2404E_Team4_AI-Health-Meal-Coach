'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalorieCircle } from '@/components/dashboard/widgets/CalorieCircle';
import { MacrosBreakdown } from '@/components/dashboard/widgets/MacrosBreakdown';
import { WaterTracker } from '@/components/dashboard/widgets/WaterTracker';
import { RecentMeals } from '@/components/dashboard/widgets/RecentMeals';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardSummary, DEFAULT_DASHBOARD_SUMMARY } from '@/types/api';
import { Footprints, Flame, RefreshCw } from 'lucide-react';

// ============================================================
// LOADING SKELETON
// ============================================================

const StatSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded" />
                <div className="w-20 h-4 bg-slate-200 rounded" />
            </div>
        </div>
    </div>
);

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardPage() {
    const [data, setData] = useState<DashboardSummary>(DEFAULT_DASHBOARD_SUMMARY);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await dashboardService.getSummary();

            // ✅ Defensive Programming: Merge với defaults để tránh undefined
            setData((prev) => ({
                ...DEFAULT_DASHBOARD_SUMMARY,  // Khung mặc định
                ...prev,                        // Giữ lại state cũ (nếu có)
                ...(result.data || {}),         // Đè dữ liệu API lên (nếu có)
                // Deep merge cho nested objects
                calories: {
                    ...DEFAULT_DASHBOARD_SUMMARY.calories,
                    ...(result.data?.calories || {}),
                },
                water: {
                    ...DEFAULT_DASHBOARD_SUMMARY.water,
                    ...(result.data?.water || {}),
                },
                macros: {
                    protein: {
                        ...DEFAULT_DASHBOARD_SUMMARY.macros.protein,
                        ...(result.data?.macros?.protein || {}),
                    },
                    carbs: {
                        ...DEFAULT_DASHBOARD_SUMMARY.macros.carbs,
                        ...(result.data?.macros?.carbs || {}),
                    },
                    fat: {
                        ...DEFAULT_DASHBOARD_SUMMARY.macros.fat,
                        ...(result.data?.macros?.fat || {}),
                    },
                },
            }));

            if (!result.success) {
                setError(result.message);
            }
        } catch {
            setError('Không thể tải dữ liệu dashboard');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Show skeleton while loading
    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatSkeleton />
                    <StatSkeleton />
                    <div className="col-span-2 md:col-span-2">
                        <StatSkeleton />
                    </div>
                </div>

                {/* Main Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm h-64 animate-pulse">
                            <div className="w-24 h-4 bg-slate-200 rounded mb-4" />
                            <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto" />
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm h-48 animate-pulse" />
                            <div className="bg-gradient-to-br from-primary to-green-600 rounded-3xl p-6 h-48 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Banner */}
            {error && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                    <span className="text-sm">{error}</span>
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Thử lại
                    </button>
                </div>
            )}

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Đốt cháy</p>
                            <p className="font-bold text-slate-800">{data.calories.burned} kcal</p>
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
                            <p className="font-bold text-slate-800">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm col-span-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Mục tiêu hôm nay</p>
                            <p className="font-bold text-slate-800">{data.calories.goal} kcal</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Còn lại</p>
                            <p className="font-bold text-primary">{data.calories.remaining} kcal</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Calories & Macros */}
                <div className="lg:col-span-1 space-y-6">
                    <CalorieCircle
                        eaten={data.calories.eaten}
                        goal={data.calories.goal}
                        remaining={data.calories.remaining}
                    />
                    <MacrosBreakdown
                        protein={data.macros.protein}
                        carbs={data.macros.carbs}
                        fat={data.macros.fat}
                    />
                </div>

                {/* Center & Right - Water & Meals */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WaterTracker
                            current={data.water.current}
                            goal={data.water.goal}
                        />
                        <div className="bg-gradient-to-br from-primary to-green-600 rounded-3xl p-6 text-white">
                            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-80">
                                AI Coach
                            </h3>
                            <p className="text-lg font-medium mb-4">
                                {data.water.current < data.water.goal
                                    ? `Bạn đang làm tốt! Hãy uống thêm ${data.water.goal - data.water.current} ly nước nữa để đạt mục tiêu.`
                                    : 'Tuyệt vời! Bạn đã đạt mục tiêu uống nước hôm nay!'}
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
