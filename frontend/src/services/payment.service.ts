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
            const response = await http.get<ApiResponse<string>>('/payment/create-url', {
                params: {
                    userId,
                    amount
                }
            });

            if (response.data && response.data.success) {
                console.log('✅ VNPay URL generated:', response.data.data);
                return {
                    success: true,
                    url: response.data.data,
                };
            }

            return {
                success: false,
                url: '',
                error: response.data?.message || 'Failed to generate URL'
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
        // Placeholder
        return { success: false, error: 'Not implemented' };
    },

    /**
     * Get Latest Transaction
     */
    getLatestTransaction: async (): Promise<TransactionResult> => {
        // Placeholder
        return { success: false, error: 'Not implemented' };
    },
};
