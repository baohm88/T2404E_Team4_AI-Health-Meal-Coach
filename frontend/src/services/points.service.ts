import http from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface PointHistory {
    id: number;
    actionType: string;
    pointsEarned: number;
    description: string;
    createdAt: string;
}

export interface UserPoint {
    totalPoints: number;
    currentMonthPoints: number;
    lastEarnedAt: string;
}

export const pointsService = {
    getCurrentPoints: async (): Promise<ApiResponse<UserPoint>> => {
        return http.get('/api/points/current');
    },

    getPointHistory: async (page: number = 0, size: number = 20): Promise<ApiResponse<any>> => {
        return http.get(`/api/points/history?page=${page}&size=${size}`);
    }
};
