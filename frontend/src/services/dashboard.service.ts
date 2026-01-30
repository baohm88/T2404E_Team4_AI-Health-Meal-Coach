/**
 * Dashboard Service (Real API Implementation)
 *
 * Handles dashboard API calls.
 * Fetches data from Health Profile & Analysis to calculate goals.
 *
 * @see /lib/http.ts - HTTP client
 * @see /types/api.ts - Type definitions
 */

import http from '@/lib/http';
import {
    ApiResponse,
    DashboardSummary,
    DEFAULT_DASHBOARD_SUMMARY,
} from '@/types/api';
import { mealPlanService } from './meal-plan.service';
import { differenceInDays, startOfDay, parseISO, format, addDays, isPast, isToday } from 'date-fns';

// ============================================================
// TYPES
// ============================================================

export interface DashboardServiceResponse {
    success: boolean;
    message: string;
    data: DashboardSummary;
}

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const dashboardService = {
    /**
     * Get dashboard summary data
     * Fetches Health Profile, Analysis, and Meal Plans to aggregate a strategic view.
     */
    getSummary: async (): Promise<DashboardServiceResponse> => {
        try {
            // 1. Fetch all required data in parallel
            const [profileRes, analysisRes, planRes] = await Promise.allSettled([
                http.get<ApiResponse<any>>('/health-profile'),
                http.get<ApiResponse<any>>('/health-analysis'),
                mealPlanService.getMealPlan(),
            ]);

            const summary = { ...DEFAULT_DASHBOARD_SUMMARY };

            // 2. Process Profile (Water Goal)
            if (profileRes.status === 'fulfilled' && profileRes.value.data?.success) {
                const profile = profileRes.value.data.data;
                if (profile && profile.weight) {
                    const calculatedGlasses = Math.round((profile.weight * 33) / 250);
                    summary.water.goal = Math.max(6, Math.min(15, calculatedGlasses));
                }
            }

            // 3. Process Plan & Analysis
            if (planRes.status === 'fulfilled' && planRes.value.success && planRes.value.data) {
                const planData = planRes.value.data;
                const today = startOfDay(new Date());
                const startDate = startOfDay(parseISO(planData.startDate));

                // Calculate current relative day (1-indexed)
                const relativeDay = Math.max(1, differenceInDays(today, startDate) + 1);

                // Find Next Strategic Meal
                let nextMealFound = false;
                for (let d = relativeDay; d <= planData.totalDays; d++) {
                    const dayPlan = planData.mealPlan.find(dp => dp.day === d);
                    if (dayPlan) {
                        const nextM = dayPlan.meals.find(m => !m.checkedIn);
                        if (nextM) {
                            summary.nextMeal = {
                                id: nextM.id,
                                plannedMealId: nextM.plannedMealId,
                                mealName: nextM.mealName,
                                type: nextM.type,
                                calories: nextM.calories,
                                plannedCalories: nextM.plannedCalories,
                                day: d,
                                checkedIn: false
                            };
                            nextMealFound = true;
                            break;
                        }
                    }
                }

                // Calculate Weekly Progress & Cumulative Diff
                const currentWeek = Math.floor((relativeDay - 1) / 7);
                const weekStartDay = currentWeek * 7 + 1;
                const weekEndDay = weekStartDay + 6;

                let cumulativeDiff = 0;
                let weeklyEaten = 0;
                let weeklyGoal = 0;

                planData.mealPlan.forEach(dp => {
                    if (dp.day >= weekStartDay && dp.day <= weekEndDay) {
                        dp.meals.forEach(m => {
                            if (m.checkedIn) {
                                cumulativeDiff += (m.calories - m.plannedCalories);
                                weeklyEaten += m.calories;
                            }
                            weeklyGoal += m.plannedCalories;
                        });
                    }
                });

                summary.weeklyProgress = {
                    currentDay: relativeDay,
                    totalDays: planData.totalDays,
                    cumulativeDiff: Math.round(cumulativeDiff)
                };

                // Generate 7-Day Trend Data
                const trendData = [];
                for (let i = 6; i >= 0; i--) {
                    const targetDate = addDays(today, -i);
                    const relD = differenceInDays(targetDate, startDate) + 1;
                    const dayPlan = planData.mealPlan.find(dp => dp.day === relD);

                    trendData.push({
                        date: format(targetDate, 'dd/MM'),
                        eaten: dayPlan ? dayPlan.meals.reduce((sum, m) => sum + (m.checkedIn ? m.calories : 0), 0) : 0,
                        goal: dayPlan ? dayPlan.totalPlannedCalories : 2000
                    });
                }
                summary.trendData = trendData;

                // Update Daily Calories
                const todayPlan = planData.mealPlan.find(dp => dp.day === relativeDay);
                if (todayPlan) {
                    summary.calories.goal = todayPlan.totalPlannedCalories;
                    summary.calories.eaten = todayPlan.meals.reduce((sum, m) => sum + (m.checkedIn ? m.calories : 0), 0);
                    summary.calories.remaining = Math.max(0, summary.calories.goal - summary.calories.eaten);
                }
            } else if (analysisRes.status === 'fulfilled' && analysisRes.value.data?.success) {
                // Fallback to analysis if no specific plan is found
                const rawData = analysisRes.value.data.data;
                const analysis = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                const goalCalories = analysis.analysis?.tdee || 2000;
                summary.calories.goal = Math.round(goalCalories);
                summary.calories.remaining = Math.round(goalCalories - summary.calories.eaten);
            }

            return {
                success: true,
                message: 'Dashboard data fetched successfully',
                data: summary,
            };

        } catch (error) {
            console.error('Dashboard API Error:', error);
            return {
                success: false,
                message: 'Failed to load dashboard data',
                data: DEFAULT_DASHBOARD_SUMMARY,
            };
        }
    },

    /**
     * Update water intake
     */
    updateWaterIntake: async (glasses: number): Promise<{ success: boolean }> => {
        try {
            console.warn('Backend water logging endpoint not implemented yet. Local state only.');
            return { success: true };
        } catch {
            return { success: false };
        }
    },
};
