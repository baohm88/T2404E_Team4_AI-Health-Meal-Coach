/**
 * Schedule Page
 *
 * Main page for viewing and managing meal schedules.
 * Features:
 * - Macro View: 3-month roadmap with phases
 * - Micro View: 7-day calendar with meals
 * - AI-powered adjustments and generation
 *
 * @route /dashboard/schedule
 */

'use client';

import {
    MealCalendar,
    MealEventModal,
    MealCheckInModal,
    AdjustmentAlert,
    MealPlanGenerator,
    WeeklySummary,
    RoadmapView,
} from '@/components/dashboard/schedule';

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function SchedulePage() {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Lịch ăn thông minh</h1>
                    <p className="text-slate-500 mt-1">
                        Quản lý thực đơn hàng ngày với sự hỗ trợ của AI Coach
                    </p>
                </div>
            </div>

            {/* Macro View: Roadmap */}
            <RoadmapView />

            {/* Micro View: Calendar + Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left: Calendar View (3 cols) */}
                <div className="lg:col-span-3">
                    <MealCalendar />
                </div>

                {/* Right: Side Panel (1 col) */}
                <div className="space-y-6">
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

