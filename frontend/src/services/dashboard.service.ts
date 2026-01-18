/**
 * Dashboard Service
 *
 * Handles dashboard API calls.
 * Provides summary data for calories, water, and macros widgets.
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
// SERVICE IMPLEMENTATION
// ============================================================

export interface DashboardServiceResponse {
    success: boolean;
    message: string;
    data: DashboardSummary;
}

export const dashboardService = {
    /**
     * Get dashboard summary data
     * Returns default values if API returns empty
     *
     * @returns Promise with dashboard summary
     */
    getSummary: async (): Promise<DashboardServiceResponse> => {
        try {
            // http.get returns ApiResponse<T> after interceptor unwrapping
            const response = await http.get('/dashboard/summary') as unknown as ApiResponse<DashboardSummary | null>;

            // Handle empty or null data from backend
            const data = response.data ?? DEFAULT_DASHBOARD_SUMMARY;

            // Merge with defaults to ensure all fields exist
            const mergedData: DashboardSummary = {
                calories: {
                    ...DEFAULT_DASHBOARD_SUMMARY.calories,
                    ...data.calories,
                },
                water: {
                    ...DEFAULT_DASHBOARD_SUMMARY.water,
                    ...data.water,
                },
                macros: {
                    protein: {
                        ...DEFAULT_DASHBOARD_SUMMARY.macros.protein,
                        ...data.macros?.protein,
                    },
                    carbs: {
                        ...DEFAULT_DASHBOARD_SUMMARY.macros.carbs,
                        ...data.macros?.carbs,
                    },
                    fat: {
                        ...DEFAULT_DASHBOARD_SUMMARY.macros.fat,
                        ...data.macros?.fat,
                    },
                },
            };

            return {
                success: response.success,
                message: response.message,
                data: mergedData,
            };
        } catch (error) {
            const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
            const errorMessage =
                axiosError.response?.data?.message ||
                'Không thể tải dữ liệu dashboard.';

            // Return default data on error so UI can still render
            return {
                success: false,
                message: errorMessage,
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
            await http.post('/dashboard/water', { glasses });
            return { success: true };
        } catch {
            return { success: false };
        }
    },
};
