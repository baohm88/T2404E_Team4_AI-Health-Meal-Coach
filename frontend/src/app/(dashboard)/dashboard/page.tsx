'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CalorieCircle } from '@/components/dashboard/widgets/CalorieCircle';
import { MacrosBreakdown } from '@/components/dashboard/widgets/MacrosBreakdown';
import { WaterTracker } from '@/components/dashboard/widgets/WaterTracker';
import { RecentMeals } from '@/components/dashboard/widgets/RecentMeals';
import { StrategicMealCard } from '@/components/dashboard/widgets/StrategicMealCard';
import { WeeklyGoalProgress } from '@/components/dashboard/widgets/WeeklyGoalProgress';
import { HealthTrendChart } from '@/components/dashboard/widgets/HealthTrendChart';
import { dashboardService } from '@/services/dashboard.service';
import { mealLogService } from '@/services/meal-log.service';
import { DashboardSummary, DEFAULT_DASHBOARD_SUMMARY } from '@/types/api';
import { Footprints, Flame, RefreshCw, PlusCircle, Droplets } from 'lucide-react';

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
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const handleQuickCheckIn = async (mealId: number) => {
        if (!data.nextMeal) return;

        try {
            const res = await mealLogService.checkInPlannedMeal({
                foodName: data.nextMeal.mealName,
                estimatedCalories: data.nextMeal.plannedCalories,
                nutritionDetails: `AI Strategic Meal Check-in (${data.nextMeal.type})`,
                plannedMealId: data.nextMeal.plannedMealId
            });

            if (res.success) {
                toast.success('Bữa ăn đã được ghi nhận!');
                fetchDashboardData();
            } else {
                toast.error('Không thể ghi nhận bữa ăn');
            }
        } catch (e) {
            toast.error('Lỗi khi ghi nhận bữa ăn');
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Check for VNPay Return
    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const msg = searchParams.get('msg');

        if (paymentStatus) {
            if (paymentStatus === 'success') {
                toast.success('Thanh toán thành công! Bạn đã là thành viên Premium.');
            } else if (paymentStatus === 'failed') {
                toast.error('Thanh toán thất bại hoặc bị hủy.');
            } else if (paymentStatus === 'error') {
                toast.error(`Lỗi thanh toán: ${msg || 'Không xác định'}`);
            }

            // Cleanup URL immediately
            router.replace('/dashboard');
        }
    }, [searchParams, router]);

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

            {/* Main Grid V2 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* 1. Calories & Macros (Col 1) */}
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

                {/* 2. Trends (Col 2) */}
                <div className="lg:col-span-1">
                    <HealthTrendChart data={data.trendData} />
                </div>

                {/* 3. Strategy (Col 3-4) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StrategicMealCard
                            meal={data.nextMeal}
                            currentDay={data.weeklyProgress?.currentDay}
                            onCheckIn={handleQuickCheckIn}
                            isLoading={isLoading}
                        />
                        <WeeklyGoalProgress progress={data.weeklyProgress} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <WaterTracker
                                current={data.water.current}
                                goal={data.water.goal}
                            />
                        </div>
                        <div className="md:col-span-2 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 -mr-8 -mt-8 rounded-full blur-3xl transition-all group-hover:scale-110" />

                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-emerald-400">
                                LỜI KHUYÊN TỪ AI COACH
                            </h3>
                            <p className="text-lg font-bold mb-6 relative z-10 leading-tight">
                                {data.water.current < data.water.goal
                                    ? `Tiến triển rất tốt! Hãy uống thêm ${data.water.goal - data.water.current} ly nước nữa để đạt mục tiêu cấp nước.`
                                    : 'Cấp nước hoàn hảo! Bạn đã đạt mục tiêu nước uống hàng ngày.'}
                            </p>

                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                                    Nhận lời khuyên
                                </button>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                                            {i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Logins & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentMeals meals={[]} />
                </div>
                <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        Hành động nhanh
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-100 transition-colors">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm">Thêm món ăn</span>
                            </div>
                            <PlusCircle className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-100 transition-colors">
                                    <Droplets className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="font-bold text-sm">Thêm ly nước</span>
                            </div>
                            <PlusCircle className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
