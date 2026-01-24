/**
 * Schedule Page (PREMIUM FEATURE)
 *
 * Main page for viewing and managing meal schedules.
 * Requires Premium subscription to access full features.
 *
 * @route /dashboard/schedule
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import {
    MealCalendar,
    MealEventModal,
    MealCheckInModal,
    AdjustmentAlert,
    MealPlanGenerator,
    WeeklySummary,
    RoadmapView,
} from '@/components/dashboard/schedule';
import { aiService, AIAnalysisResponse } from '@/services/ai.service';
import { subscriptionService } from '@/services/subscription.service';
import { Button } from '@/components/ui/Button';

// ============================================================
// SKELETON LOADING COMPONENT
// ============================================================

function ScheduleSkeleton() {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-64 bg-slate-200 rounded-lg" />
                <div className="h-4 w-96 bg-slate-100 rounded" />
            </div>

            {/* Roadmap Banner Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-6 w-48 bg-slate-200 rounded" />
                        <div className="h-4 w-72 bg-slate-100 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3">
                            <div className="h-4 w-20 bg-slate-200 rounded" />
                            <div className="h-8 w-32 bg-slate-300 rounded" />
                            <div className="h-3 w-24 bg-slate-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Skeleton (3 cols) */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div className="h-6 w-32 bg-slate-200 rounded" />
                        <div className="flex gap-2">
                            <div className="h-8 w-20 bg-slate-200 rounded" />
                            <div className="h-8 w-20 bg-slate-200 rounded" />
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Weekday headers */}
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                            <div key={`header-${day}`} className="h-8 bg-slate-100 rounded" />
                        ))}
                        {/* Calendar days */}
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-slate-50 rounded-lg p-2 space-y-1">
                                <div className="h-4 w-6 bg-slate-200 rounded" />
                                <div className="h-2 w-full bg-slate-100 rounded" />
                                <div className="h-2 w-3/4 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Panel Skeleton (1 col) */}
                <div className="space-y-6">
                    {/* Generator Skeleton */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                        <div className="h-5 w-40 bg-slate-200 rounded" />
                        <div className="h-10 bg-slate-100 rounded-lg" />
                        <div className="h-10 bg-slate-200 rounded-lg" />
                    </div>

                    {/* Summary Skeleton */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                        <div className="h-5 w-32 bg-slate-200 rounded" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 w-20 bg-slate-100 rounded" />
                                    <div className="h-4 w-16 bg-slate-200 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PREMIUM GATE COMPONENT
// ============================================================

function PremiumGate() {
    return (
        <div className="relative min-h-[60vh]">
            {/* Blurred background placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl opacity-50 blur-sm" />

            {/* Locked overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-emerald-600" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Tính năng Premium
                </h2>

                <p className="text-slate-600 max-w-md mb-6">
                    Nâng cấp lên Premium để truy cập lịch trình dinh dưỡng chi tiết từng ngày,
                    thực đơn cá nhân hóa và công thức nấu ăn phù hợp với bạn.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/dashboard/plan-overview">
                        <Button variant="outline">
                            Xem lộ trình tổng quan
                        </Button>
                    </Link>
                    <Button
                        variant="primary"
                        className="bg-emerald-600 hover:bg-emerald-700 from-emerald-600 to-emerald-600"
                        onClick={() => alert('Tính năng Premium sẽ sớm ra mắt!')}
                    >
                        <Sparkles className="w-4 h-4" />
                        Nâng cấp Premium
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <p className="text-sm text-slate-500 mt-6">
                    Premium bao gồm: Thực đơn chi tiết • Công thức nấu ăn • Theo dõi calo • Và nhiều hơn nữa
                </p>
            </div>
        </div>
    );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function SchedulePage() {
    const [analysisData, setAnalysisData] = useState<AIAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // Fetch AI analysis
            const result = await aiService.getStoredAnalysis();
            if (result.success && result.data) {
                setAnalysisData(result.data);
            } else {
                setError(result.error || 'Không thể tải dữ liệu phân tích');
            }

            // Check Premium status
            const premium = await subscriptionService.isPremium();
            setIsPremium(premium);

            setLoading(false);
        };

        fetchData();
    }, []);

    // ========================================
    // LOADING STATE
    // ========================================
    if (loading) {
        return <ScheduleSkeleton />;
    }

    // ========================================
    // PREMIUM GATE CHECK
    // ========================================
    if (!isPremium) {
        return (
            <div className="space-y-6 max-w-[1600px] mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            Lộ trình dinh dưỡng
                            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                PREMIUM
                            </span>
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Quản lý thực đơn hàng ngày với sự hỗ trợ của AI Coach
                        </p>
                    </div>
                </div>

                {/* AI Health Analysis Banner - Still visible */}
                <RoadmapView data={analysisData} loading={false} error={error} />

                {/* Premium Gate */}
                <PremiumGate />
            </div>
        );
    }

    // ========================================
    // PREMIUM USER - FULL ACCESS
    // ========================================
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Lộ trình dinh dưỡng</h1>
                    <p className="text-slate-500 mt-1">
                        Quản lý thực đơn hàng ngày với sự hỗ trợ của AI Coach
                    </p>
                </div>
            </div>

            {/* AI Health Analysis Banner */}
            <RoadmapView data={analysisData} loading={false} error={error} />

            {/* Micro View: Calendar + Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left: Calendar View (3 cols) */}
                <div className="lg:col-span-3">
                    <MealCalendar />
                </div>

                {/* Right: Side Panel (1 col) */}
                <div className="space-y-6">
                    {/* Current Month Target - Dynamic from AI */}
                    {analysisData?.threeMonthPlan?.months?.[0] && (
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {analysisData.threeMonthPlan.months[0].month}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-800 text-sm">Giai đoạn hiện tại</h3>
                                    <p className="text-xs text-emerald-600">
                                        {analysisData.threeMonthPlan.months[0].title}
                                    </p>
                                </div>
                            </div>

                            {/* Daily Calories Target */}
                            <div className="bg-white rounded-xl p-4 mb-3 border border-emerald-100">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Mục tiêu Calo/ngày</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {analysisData.threeMonthPlan.months[0].dailyCalories}
                                    <span className="text-sm font-normal text-slate-500 ml-1">kcal</span>
                                </p>
                            </div>

                            {/* Note */}
                            <div className="bg-white/50 rounded-lg p-3 border border-emerald-100">
                                <p className="text-xs text-slate-500 mb-1">📝 Ghi chú</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {analysisData.threeMonthPlan.months[0].note}
                                </p>
                            </div>
                        </div>
                    )}

                    <MealPlanGenerator />
                    <WeeklySummary />
                </div>
            </div>

            {/* Modals */}
            <MealEventModal />
            <MealCheckInModal />

            {/* Adjustment Alert (fixed position) */}
            <AdjustmentAlert />
        </div>
    );
}
