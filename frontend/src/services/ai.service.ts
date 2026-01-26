/**
 * AI Service
 *
 * Handles AI-related API calls:
 * - Health Analysis (BMI, BMR, TDEE, 3-month roadmap)
 * - AI Coach Chat
 *
 * @see /lib/http.ts - HTTP client
 * @see /lib/utils/data-mapper.ts - Data mapping utilities
 */

import http from '@/lib/http';
import { mapFrontendToBackend } from '@/lib/utils/data-mapper';

// ============================================================
// AI ANALYSIS TYPES
// ============================================================

export interface AIAnalysis {
    bmi: number;
    bmr: number;
    tdee: number;
    healthStatus: string;
    summary: string;
}

export interface LifestyleInsights {
    activity: string;
    sleep: string;
    stress: string;
}

export interface MonthPlan {
    month: number;
    title: string;
    dailyCalories: number;
    note: string;
}

export interface ThreeMonthPlan {
    goal: string;
    totalTargetWeightChangeKg: number;
    months: MonthPlan[];
}

export interface AIAnalysisResponse {
    analysis: AIAnalysis;
    lifestyleInsights: LifestyleInsights;
    threeMonthPlan: ThreeMonthPlan;
}

// ============================================================
// SERVICE RESULT TYPE
// ============================================================

interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ============================================================
// API RESPONSE TYPE
// ============================================================

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

// Helper: Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const aiService = {
    /**
     * Analyze health based on onboarding data
     * Works in 2 modes:
     * - Public (no token): Returns JSON for preview, doesn't save to DB
     * - Authenticated (with token): Saves analysis to DB
     *
     * @param data - Onboarding form data
     * @returns Promise with AI analysis response
     */
    analyzeHealth: async (
        data: Record<string, unknown>
    ): Promise<ServiceResult<AIAnalysisResponse>> => {
        try {
            console.log('🤖 [analyzeHealth] Starting...');
            console.log('🤖 [analyzeHealth] Input data:', data);

            // Map frontend data → backend format
            const mappedData = mapFrontendToBackend(data);
            console.log('🤖 [analyzeHealth] Mapped data:', mappedData);

            // Call API
            const response = await http.post<ApiResponse<AIAnalysisResponse>>(
                '/ai/health-analysis',
                mappedData
            );

            console.log('🤖 [analyzeHealth] data:', response.data);

            // http interceptor unwraps .data, so response IS ApiResponse
            const apiResponse = response as unknown as ApiResponse<AIAnalysisResponse>;

            if (apiResponse?.success && apiResponse?.data) {
                console.log('✅ [analyzeHealth] Success!');
                return {
                    success: true,
                    data: apiResponse.data,
                };
            }

            return {
                success: false,
                error: apiResponse?.message || 'Phân tích thất bại',
            };
        } catch (error) {
            console.error('❌ [analyzeHealth] Error:', error);

            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            };

            let errorMessage =
                axiosError.response?.data?.message ||
                axiosError.message ||
                'Không thể kết nối server AI';

            // Check for Rate Limit (429) or specific error text
            const isRateLimit = 
                axiosError.response?.status === 429 || 
                (typeof errorMessage === 'string' && errorMessage.includes('Rate limit reached'));

            if (isRateLimit) {
                errorMessage = 'Hệ thống AI đang quá tải. Vui lòng thử lại sau 30 giây.';
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    /**
     * Get stored health analysis from database
     * Requires authentication
     * 
     * @returns Promise with stored AI analysis response
     */
    getStoredAnalysis: async (): Promise<ServiceResult<AIAnalysisResponse>> => {
        // Real API mode
        try {
            console.log('📊 [getStoredAnalysis] Fetching stored analysis...');

            const response = await http.get<ApiResponse<AIAnalysisResponse>>(
                '/health-analysis'
            );

            console.log('📊 [getStoredAnalysis] Raw response:', response);

            // http interceptor unwraps .data, so response IS ApiResponse
            // Backend returns data as JSON string, need to parse it
            const apiResponse = response as unknown as ApiResponse<string>;

            if (apiResponse?.success && apiResponse?.data) {
                console.log('✅ [getStoredAnalysis] Success!');
                // Parse JSON string to object
                const parsedData = typeof apiResponse.data === 'string'
                    ? JSON.parse(apiResponse.data) as AIAnalysisResponse
                    : apiResponse.data as unknown as AIAnalysisResponse;
                return {
                    success: true,
                    data: parsedData,
                };
            }

            return {
                success: false,
                error: apiResponse?.message || 'Không tìm thấy dữ liệu phân tích',
            };
        } catch (error) {
            console.error('❌ [getStoredAnalysis] Error:', error);

            const axiosError = error as {
                response?: {
                    data?: ApiResponse<unknown>;
                };
                message?: string;
            };

            const errorMessage =
                axiosError.response?.data?.message ||
                axiosError.message ||
                'Không thể tải dữ liệu phân tích';

            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    /**
     * Save health analysis to database
     * Requires authentication
     * 
     * @param analysisJson - JSON string (already stringified) to save
     * @returns Promise with save result
     */
    saveHealthAnalysis: async (
        analysisJson: string
    ): Promise<ServiceResult<void>> => {
        try {
            console.log('💾 [saveHealthAnalysis] Saving to DB...');
            console.log('💾 [saveHealthAnalysis] JSON String:', analysisJson);

            // Send JSON string directly to POST /health-analysis
            const response = await http.post<ApiResponse<void>>(
                '/health-analysis',
                analysisJson,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('💾 [saveHealthAnalysis] Response:', response);

            const apiResponse = response as unknown as ApiResponse<void>;

            if (apiResponse?.success) {
                console.log('✅ [saveHealthAnalysis] Saved successfully!');
                return { success: true };
            }

            return {
                success: false,
                error: apiResponse?.message || 'Lưu dữ liệu thất bại',
            };
        } catch (error) {
            console.error('❌ [saveHealthAnalysis] Error:', error);

            const axiosError = error as {
                response?: {
                    data?: { message?: string };
                };
                message?: string;
            };

            return {
                success: false,
                error: axiosError.response?.data?.message || axiosError.message || 'Không thể lưu dữ liệu',
            };
        }
    },

    /**
     * Send message and get AI Coach response (Mock)
     * @deprecated Will be replaced with real API
     */
    sendMessage: async (message: string): Promise<{ id: string; role: string; content: string; timestamp: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let response = 'Chào bạn, tôi là AI Health Coach. Hiện tại tính năng chat đang được bảo trì để nâng cấp.';
                
                if (message.toLowerCase().includes('giảm cân')) {
                    response = 'Để giảm cân hiệu quả, bạn nên tạo calorie deficit (tiêu thụ ít hơn 300-500 kcal so với nhu cầu). Kết hợp với tập luyện 3-4 buổi/tuần và uống đủ 2L nước mỗi ngày.';
                } else if (message.toLowerCase().includes('protein')) {
                    response = 'Lượng protein khuyến nghị là 1.6-2.2g/kg cân nặng cho người tập gym. Với cân nặng 70kg, bạn nên ăn 112-154g protein mỗi ngày.';
                } else if (message.toLowerCase().includes('bữa sáng') || message.toLowerCase().includes('sáng')) {
                    response = 'Gợi ý bữa sáng healthy:\n🥚 2 trứng luộc (156 kcal)\n🥑 1/2 quả bơ (80 kcal)\n🍞 1 lát bánh mì đen (80 kcal)\n🥛 Sữa không đường (60 kcal)\n\nTổng: ~376 kcal';
                }

                resolve({
                    id: `ai_${Date.now()}`,
                    role: 'ai',
                    content: response,
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                });
            }, 1000);
        });
    },
};
