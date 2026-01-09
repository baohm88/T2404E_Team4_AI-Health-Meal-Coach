/**
 * Auth Service
 * 
 * Handles all authentication API calls.
 * Currently uses mock data - replace with real API in production.
 * 
 * @see /lib/schemas/auth.schema.ts - Validation schemas
 * @see /lib/constants/auth.constants.ts - Configuration
 */

import { LoginData, RegisterData } from '@/lib/schemas/auth.schema';
import { API_DELAY_MS, generateMockToken } from '@/lib/constants/auth.constants';
import { User } from '@/stores/useAuthStore';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/** Standard auth API response */
export interface AuthResponse {
    success: boolean;
    accessToken?: string;
    user?: User;
    error?: string;
}

/** Error response for failed requests */
interface AuthError {
    success: false;
    error: string;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** 
 * Simulate API delay (remove in production)
 */
const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create successful auth response
 */
const createSuccessResponse = (user: User): AuthResponse => ({
    success: true,
    accessToken: generateMockToken(),
    user,
});

/**
 * Create error response
 */
const createErrorResponse = (error: string): AuthError => ({
    success: false,
    error,
});

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const authService = {
    /**
     * Login with email and password
     * @param data - Login credentials
     * @returns Promise with auth response
     */
    login: async (data: LoginData): Promise<AuthResponse> => {
        await delay(API_DELAY_MS);

        // Mock validation - accept any credentials for demo
        // In production: call actual API endpoint
        try {
            const user: User = {
                id: `user_${Date.now()}`,
                email: data.email,
                fullName: data.email.split('@')[0], // Extract name from email
            };

            return createSuccessResponse(user);
        } catch {
            return createErrorResponse('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    },

    /**
     * Register new user
     * @param data - Registration data
     * @returns Promise with auth response
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        await delay(API_DELAY_MS);

        try {
            const user: User = {
                id: `user_${Date.now()}`,
                email: data.email,
                fullName: data.fullName,
            };

            return createSuccessResponse(user);
        } catch {
            return createErrorResponse('Đăng ký thất bại. Vui lòng thử lại.');
        }
    },

    /**
     * Logout user (clear session on server)
     * @returns Promise<void>
     */
    logout: async (): Promise<void> => {
        await delay(500);
        // In production: call logout endpoint to invalidate token
    },

    /**
     * Verify if token is still valid
     * @param token - Access token to verify
     * @returns Promise<boolean>
     */
    verifyToken: async (token: string): Promise<boolean> => {
        await delay(300);
        // In production: call token verification endpoint
        return token.startsWith('mock_token_');
    },
};
