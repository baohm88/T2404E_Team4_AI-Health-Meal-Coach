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
        // Return default data directly without making an API call
        return {
            success: true,
            message: 'Dashboard data (Default)',
            data: DEFAULT_DASHBOARD_SUMMARY,
        };
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
