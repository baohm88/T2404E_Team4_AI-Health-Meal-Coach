/**
 * Payment Service (Mock Implementation)
 * 
 * Simulates VNPay payment gateway integration.
 * All functions use mock data with realistic delays.
 * 
 * @see /services/subscription.service.ts - Related subscription service
 */

// ============================================================
// TYPES
// ============================================================

export interface PaymentUrlResult {
    success: boolean;
    url: string;
    transactionId: string;
    error?: string;
}

export interface TransactionStatus {
    transactionId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
    isPremium: boolean;
    amount: number;
    paidAt?: string;
    error?: string;
}

export interface TransactionResult {
    success: boolean;
    data?: TransactionStatus;
    error?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_TRANSACTION_ID = 'MOCK_123456';

// ============================================================
// HELPER: Simulate Network Delay
// ============================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const paymentService = {
    /**
     * Tạo URL thanh toán VNPay (Mock)
     * 
     * @param amount - Số tiền thanh toán (VND)
     * @returns Promise với URL thanh toán
     * 
     * Note: Trong môi trường thật, sẽ gọi API backend để tạo URL VNPay
     */
    createPaymentUrl: async (amount: number): Promise<PaymentUrlResult> => {
        console.log('💳 [MOCK] Creating payment URL for:', amount.toLocaleString('vi-VN'), 'VND');

        // Giả lập network delay 1 giây
        await delay(1000);

        // Mock: Trả về URL success với transactionId
        const successUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/payment/success?transactionId=${MOCK_TRANSACTION_ID}`
            : `/payment/success?transactionId=${MOCK_TRANSACTION_ID}`;

        console.log('✅ [MOCK] Payment URL created:', successUrl);

        return {
            success: true,
            url: successUrl,
            transactionId: MOCK_TRANSACTION_ID,
        };
    },

    /**
     * Kiểm tra trạng thái giao dịch (Mock)
     * 
     * @param transactionId - ID giao dịch cần kiểm tra
     * @returns Promise với trạng thái giao dịch
     * 
     * Note: Trong môi trường thật, sẽ gọi API backend để verify với VNPay
     */
    checkTransactionStatus: async (transactionId: string): Promise<TransactionResult> => {
        console.log('🔍 [MOCK] Checking transaction status:', transactionId);

        // Giả lập network delay
        await delay(500);

        // Mock: Luôn trả về SUCCESS
        const mockStatus: TransactionStatus = {
            transactionId,
            status: 'SUCCESS',
            isPremium: true,
            amount: 899000, // Mặc định giá gói 6 tháng
            paidAt: new Date().toISOString(),
        };

        console.log('✅ [MOCK] Transaction status:', mockStatus);

        return {
            success: true,
            data: mockStatus,
        };
    },

    /**
     * Lấy thông tin giao dịch gần nhất của user (Mock)
     */
    getLatestTransaction: async (): Promise<TransactionResult> => {
        console.log('📋 [MOCK] Fetching latest transaction...');

        await delay(300);

        return {
            success: true,
            data: {
                transactionId: MOCK_TRANSACTION_ID,
                status: 'SUCCESS',
                isPremium: true,
                amount: 899000,
                paidAt: new Date().toISOString(),
            },
        };
    },
};
