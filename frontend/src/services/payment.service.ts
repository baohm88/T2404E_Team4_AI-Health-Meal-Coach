/**
 * Payment Service (Real Implementation)
 * 
 * Integration with Backend to generate VNPay URLs.
 * 
 * @see /lib/http.ts - HTTP client
 */

import http from '@/lib/http';
import { ApiResponse } from '@/types/api';
import { jwtDecode } from 'jwt-decode';

// ============================================================
// TYPES
// ============================================================

export interface PaymentUrlResult {
    success: boolean;
    url: string;
    transactionId?: string;
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

interface DecodedToken {
    userId: string;
    sub: string;
    exp: number;
}

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const paymentService = {
    /**
     * Create VNPay Payment URL
     * 
     * @param amount - Amount in VND
     * @returns Promise with payment URL
     */
    createPaymentUrl: async (amount: number): Promise<PaymentUrlResult> => {
        try {
            // 1. Get User ID from Token
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            if (!token) {
                return { success: false, url: '', error: 'User not authenticated' };
            }

            let userId: string;
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // Backend usually puts ID in 'userId' or 'sub'
                userId = decoded.userId || decoded.sub;
            } catch (e) {
                return { success: false, url: '', error: 'Invalid token' };
            }

            console.log(`💳 Initiating Payment for User [${userId}] Amount: ${amount}`);

            // 2. Call Backend API
            // Note: http interceptor unwraps response, so we get ApiResponse directly at runtime
            // But TS thinks we get AxiosResponse. We cast to unknown first.
            const response = await http.get<ApiResponse<string>>('/payment/create-url', {
                params: {
                    userId,
                    amount
                }
            }) as unknown as ApiResponse<string>;

            if (response.success) {
                console.log('✅ VNPay URL generated:', response.data);
                return {
                    success: true,
                    url: response.data,
                };
            }

            return {
                success: false,
                url: '',
                error: response.message || 'Failed to generate URL'
            };

        } catch (error) {
            console.error('Payment creation error:...', error);
            // Default fallback or detailed error
            return {
                success: false,
                url: '',
                error: 'System error. Please try again later.',
            };
        }
    },

    /**
     * Check transaction status
     * Not actively used for VNPay as it relies on Redirect.
     */
    checkTransactionStatus: async (transactionId: string): Promise<TransactionResult> => {
        try {
            // transactionId here corresponds to vnp_TransactionNo passed in URL
            // We use the same pattern as createPaymentUrl for casting response
            const response = await http.get<ApiResponse<TransactionStatus>>(`/payment/status/${transactionId}`) as unknown as ApiResponse<TransactionStatus>;

            if (response.success && response.data) {
                return {
                    success: true,
                    data: response.data
                };
            }
            return {
                success: false,
                error: response.message || 'Transaction not found'
            };
        } catch (error) {
            console.error('Check transaction status error:', error);
            return {
                success: false,
                error: 'Failed to check transaction status'
            };
        }
    },

    /**
     * Get Latest Transaction
     */
    getLatestTransaction: async (): Promise<TransactionResult> => {
        // Placeholder
        return { success: false, error: 'Not implemented' };
    },
};
