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
     * Fetches Health Profile and Analysis to calculate personalized goals.
     */
    getSummary: async (): Promise<DashboardServiceResponse> => {
        try {
            // 1. Fetch both profile and analysis in parallel to save time
            const [profileRes, analysisRes] = await Promise.allSettled([
                http.get<ApiResponse<any>>('/health-profile'),
                http.get<ApiResponse<any>>('/health-analysis'), // Backend returns raw JSON string in 'data'
            ]);

            // Start with default data to ensure no undefined crashes
            const summary = { ...DEFAULT_DASHBOARD_SUMMARY };

            // 2. Process Profile (Calculate Water Goal based on weight)
            if (profileRes.status === 'fulfilled' && profileRes.value.data?.success) {
                const profile = profileRes.value.data.data;
                if (profile && profile.weight) {
                    // Formula: Weight (kg) * 33ml / 250ml (glass size)
                    // e.g. 70kg * 33 = 2310ml / 250 = ~9 glasses
                    const calculatedGlasses = Math.round((profile.weight * 33) / 250);
                    // Ensure realistic bounds (min 6, max 15)
                    summary.water.goal = Math.max(6, Math.min(15, calculatedGlasses));
                }
            }

            // 3. Process Analysis (Calculate Calories & Macros)
            if (analysisRes.status === 'fulfilled' && analysisRes.value.data?.success) {
                const rawData = analysisRes.value.data.data;

                if (rawData) {
                    try {
                        // CRITICAL: Parse JSON string from backend if necessary
                        // Backend often returns serialized JSON string in the 'data' field
                        const analysis = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

                        // Priority: 
                        // 1. Daily Calories from the Generated Plan (Month 1)
                        // 2. TDEE from Analysis
                        // 3. Default fallback (2000)
                        const tdee = analysis.analysis?.tdee;
                        const planCalories = analysis.threeMonthPlan?.months?.[0]?.dailyCalories;
                        const goalCalories = planCalories || tdee || 2000;

                        // Update Calories
                        summary.calories.goal = Math.round(goalCalories);
                        // Recalculate remaining (Goal - Eaten)
                        // Note: 'eaten' currently is 0 until you integrate Meal Logging API
                        summary.calories.remaining = Math.round(goalCalories - summary.calories.eaten);

                        // Calculate Macros based on Standard Ratio (50% Carbs / 30% Protein / 20% Fat)
                        // Protein: 1g = 4kcal
                        // Carbs: 1g = 4kcal
                        // Fat: 1g = 9kcal
                        summary.macros = {
                            protein: {
                                current: 0,
                                goal: Math.round((goalCalories * 0.3) / 4),
                            },
                            carbs: {
                                current: 0,
                                goal: Math.round((goalCalories * 0.5) / 4),
                            },
                            fat: {
                                current: 0,
                                goal: Math.round((goalCalories * 0.2) / 9),
                            },
                        };
                    } catch (e) {
                        console.error('Failed to parse health analysis JSON:', e);
                        // Fallback to defaults if parsing fails
                    }
                }
            }

            return {
                success: true,
                message: 'Dashboard data fetched successfully',
                data: summary,
            };

        } catch (error) {
            console.error('Dashboard API Error:', error);
            // Return defaults on network error so UI doesn't crash
            return {
                success: false,
                message: 'Failed to load dashboard data',
                data: DEFAULT_DASHBOARD_SUMMARY,
            };
        }
    },

    /**
     * Update water intake
     * @param glasses - Number of glasses to set
     */
    updateWaterIntake: async (glasses: number): Promise<{ success: boolean }> => {
        try {
            // TODO: Connect to real backend endpoint when available
            // await http.post('/dashboard/water', { glasses });
            console.warn('Backend water logging endpoint not implemented yet. Local state only.');
            return { success: true };
        } catch {
            return { success: false };
        }
    },
};