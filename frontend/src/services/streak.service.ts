import http from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface UserStreak {
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string;
    freezeCount: number;
    canRecover: boolean;
    recoveryDeadline: string | null;
}

export const streakService = {
    getCurrentStreak: async (): Promise<ApiResponse<UserStreak>> => {
        return http.get('/api/streak/current');
    },

    purchaseFreeze: async (): Promise<ApiResponse<void>> => {
        return http.post('/api/streak/freeze/purchase');
    },

    recoverStreak: async (): Promise<ApiResponse<void>> => {
        return http.post('/api/streak/recover');
    }
};
