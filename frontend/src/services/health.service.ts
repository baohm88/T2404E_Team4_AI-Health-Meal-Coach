/**
 * Health Profile Service (with Mock Data Support)
 * 
 * Handles health profile and analysis data.
 * Toggle USE_MOCK_DATA to switch between mock and real API.
 * 
 * @see /types/api.ts - Type definitions
 */

import http from '@/lib/http';
import { ApiResponse } from '@/types/api';

// ============================================================
// CONFIGURATION
// ============================================================

/** 
 * Toggle này để bật/tắt Mock Data
 * true = Dùng dữ liệu giả (để Dev/Demo)
 * false = Gọi API thật (khi Backend đã sẵn sàng)
 */
const USE_MOCK_DATA = true;

// ============================================================
// TYPES
// ============================================================

export interface HealthAnalysis {
    id: string;
    userId: string;
    bmi: number;
    bmr: number;
    tdee: number;
    healthStatus: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
    currentWeight: number;
    targetWeight: number;
    targetCalories: number;
    advice: string;
    createdAt: string;
    updatedAt: string;
}

export interface HealthProfile {
    id: string;
    userId: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    age: number;
    height: number;
    weight: number;
    goal: 'WEIGHT_LOSS' | 'MAINTENANCE' | 'MUSCLE_GAIN';
    activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'VERY_ACTIVE';
    stressLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
    sleepDuration: 'LESS_THAN_FIVE' | 'FIVE_TO_SEVEN' | 'SEVEN_TO_NINE' | 'MORE_THAN_NINE';
    createdAt: string;
    updatedAt: string;
}

interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_HEALTH_ANALYSIS: HealthAnalysis = {
    id: 'mock_analysis_001',
    userId: 'mock_user_001',
    bmi: 24.8,
    bmr: 1650,
    tdee: 2310,
    healthStatus: 'NORMAL',
    currentWeight: 72,
    targetWeight: 68,
    targetCalories: 1850,
    advice: 'Bạn đang có chỉ số BMI ở mức bình thường. Để giảm 4kg một cách an toàn, hãy tạo deficit 500 kcal/ngày và kết hợp vận động 3-4 lần/tuần. Ưu tiên protein (1.6g/kg) và ngủ đủ 7-8 tiếng.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const MOCK_HEALTH_PROFILE: HealthProfile = {
    id: 'mock_profile_001',
    userId: 'mock_user_001',
    gender: 'MALE',
    age: 28,
    height: 172,
    weight: 72,
    goal: 'WEIGHT_LOSS',
    activityLevel: 'MODERATE',
    stressLevel: 'MEDIUM',
    sleepDuration: 'SEVEN_TO_NINE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

// ============================================================
// HELPER: Simulate Network Delay
// ============================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const healthService = {
    /**
     * Lấy phân tích sức khỏe (BMI, BMR, TDEE, lời khuyên)
     */
    getHealthAnalysis: async (): Promise<ServiceResult<HealthAnalysis>> => {
        if (USE_MOCK_DATA) {
            console.log('🎭 [MOCK] Fetching health analysis...');
            await delay(500); // Giả lập network latency
            return {
                success: true,
                data: MOCK_HEALTH_ANALYSIS,
            };
        }

        // Real API call
        try {
            const response = await http.get<ApiResponse<HealthAnalysis>>('/health/analysis');
            const apiResponse = response as unknown as ApiResponse<HealthAnalysis>;

            if (apiResponse.success && apiResponse.data) {
                return {
                    success: true,
                    data: apiResponse.data,
                };
            }

            return {
                success: false,
                error: apiResponse.message || 'Không thể tải dữ liệu phân tích',
            };
        } catch (error) {
            console.error('❌ [Health Service] Error:', error);
            return {
                success: false,
                error: 'Không thể kết nối server',
            };
        }
    },

    /**
     * Lấy hồ sơ sức khỏe
     */
    getHealthProfile: async (): Promise<ServiceResult<HealthProfile>> => {
        if (USE_MOCK_DATA) {
            console.log('🎭 [MOCK] Fetching health profile...');
            await delay(500);
            return {
                success: true,
                data: MOCK_HEALTH_PROFILE,
            };
        }

        // Real API call
        try {
            const response = await http.get<ApiResponse<HealthProfile>>('/health/profile');
            const apiResponse = response as unknown as ApiResponse<HealthProfile>;

            if (apiResponse.success && apiResponse.data) {
                return {
                    success: true,
                    data: apiResponse.data,
                };
            }

            return {
                success: false,
                error: apiResponse.message || 'Không thể tải hồ sơ sức khỏe',
            };
        } catch (error) {
            console.error('❌ [Health Service] Error:', error);
            return {
                success: false,
                error: 'Không thể kết nối server',
            };
        }
    },
};
