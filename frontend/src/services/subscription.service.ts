/**
 * Subscription Service (with Mock Data Support)
 * 
 * Handles Premium subscription and payment status.
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

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TRIAL';

export interface Subscription {
    id: string;
    userId: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string | null;
    autoRenew: boolean;
    features: string[];
    price: number;
    currency: string;
}

export interface SubscriptionPlan {
    tier: SubscriptionTier;
    name: string;
    price: number;
    priceMonthly: number;
    currency: string;
    features: string[];
    popular: boolean;
}

interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_SUBSCRIPTION: Subscription = {
    id: 'mock_sub_001',
    userId: 'mock_user_001',
    tier: 'FREE',
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: null,
    autoRenew: false,
    features: [
        'Phân tích sức khỏe cơ bản',
        'Theo dõi calo hàng ngày',
        'Gợi ý bữa ăn (giới hạn 3 bữa/ngày)',
        'Dashboard cơ bản',
    ],
    price: 0,
    currency: 'VND',
};

const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        tier: 'FREE',
        name: 'Miễn phí',
        price: 0,
        priceMonthly: 0,
        currency: 'VND',
        features: [
            'Phân tích sức khỏe cơ bản',
            'Theo dõi calo hàng ngày',
            'Gợi ý bữa ăn (3 bữa/ngày)',
            'Dashboard cơ bản',
        ],
        popular: false,
    },
    {
        tier: 'PREMIUM',
        name: 'Premium',
        price: 299000,
        priceMonthly: 99000,
        currency: 'VND',
        features: [
            '✅ Tất cả tính năng Free',
            '🍽️ Thực đơn chi tiết từng ngày',
            '👨‍🍳 Công thức nấu ăn chi tiết',
            '📊 Báo cáo dinh dưỡng nâng cao',
            '🤖 AI Coach hỗ trợ 24/7',
            '📱 Ứng dụng mobile',
            '🔔 Nhắc nhở thông minh',
        ],
        popular: true,
    },
    {
        tier: 'PREMIUM_PLUS',
        name: 'Premium Plus',
        price: 499000,
        priceMonthly: 149000,
        currency: 'VND',
        features: [
            '✅ Tất cả tính năng Premium',
            '🏋️ Lịch tập gym cá nhân hóa',
            '📞 Tư vấn 1-1 với chuyên gia',
            '🥗 Meal prep hàng tuần',
            '📈 Phân tích DNA (sắp ra mắt)',
            '🎁 Ưu đãi đặc biệt từ đối tác',
        ],
        popular: false,
    },
];

// ============================================================
// HELPER: Simulate Network Delay
// ============================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const subscriptionService = {
    /**
     * Lấy thông tin gói đăng ký hiện tại của user
     */
    getSubscriptionStatus: async (): Promise<ServiceResult<Subscription>> => {
        if (USE_MOCK_DATA) {
            console.log('🎭 [MOCK] Fetching subscription status...');
            await delay(500); // Giả lập network latency
            return {
                success: true,
                data: MOCK_SUBSCRIPTION,
            };
        }

        // Real API call
        try {
            const response = await http.get<ApiResponse<Subscription>>('/subscription/status');
            const apiResponse = response as unknown as ApiResponse<Subscription>;

            if (apiResponse.success && apiResponse.data) {
                return {
                    success: true,
                    data: apiResponse.data,
                };
            }

            return {
                success: false,
                error: apiResponse.message || 'Không thể tải thông tin gói đăng ký',
            };
        } catch (error) {
            console.error('❌ [Subscription Service] Error:', error);
            return {
                success: false,
                error: 'Không thể kết nối server',
            };
        }
    },

    /**
     * Lấy danh sách các gói Premium có sẵn
     */
    getAvailablePlans: async (): Promise<ServiceResult<SubscriptionPlan[]>> => {
        if (USE_MOCK_DATA) {
            console.log('🎭 [MOCK] Fetching available plans...');
            await delay(500);
            return {
                success: true,
                data: MOCK_SUBSCRIPTION_PLANS,
            };
        }

        // Real API call
        try {
            const response = await http.get<ApiResponse<SubscriptionPlan[]>>('/subscription/plans');
            const apiResponse = response as unknown as ApiResponse<SubscriptionPlan[]>;

            if (apiResponse.success && apiResponse.data) {
                return {
                    success: true,
                    data: apiResponse.data,
                };
            }

            return {
                success: false,
                error: apiResponse.message || 'Không thể tải danh sách gói',
            };
        } catch (error) {
            console.error('❌ [Subscription Service] Error:', error);
            return {
                success: false,
                error: 'Không thể kết nối server',
            };
        }
    },

    /**
     * Kiểm tra user có Premium không (helper)
     */
    isPremium: async (): Promise<boolean> => {
        const result = await subscriptionService.getSubscriptionStatus();
        return result.data?.tier === 'PREMIUM' || result.data?.tier === 'PREMIUM_PLUS';
    },
};
