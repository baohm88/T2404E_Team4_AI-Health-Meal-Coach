/**
 * Auth Service
 *
 * Handles all authentication API calls.
 * Endpoints: POST /auth/login, POST /auth/register
 *
 * @see /lib/http.ts - HTTP client
 * @see /types/api.ts - Type definitions
 */

import http, { saveToken, removeToken } from '@/lib/http';
import {
    ApiResponse,
    LoginRequest,
    RegisterRequest,
    AuthData,
} from '@/types/api';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/** Standard auth API response for hook consumption */
export interface AuthResponse {
    success: boolean;
    accessToken?: string;
    error?: string;
}

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export const authService = {
    /**
     * Login with email and password
     * @param data - Login credentials
     * @returns Promise with auth response
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        try {
            // http.post returns ApiResponse<T> after interceptor unwrapping
            const response = await http.post('/auth/login', data) as unknown as ApiResponse<AuthData>;

            console.log('🔐 Login API Response:', response); // Debug log

            if (response.success && response.data?.token) {
                const { token } = response.data;

                // Save token to localStorage
                saveToken(token);

                return {
                    success: true,
                    accessToken: token,
                };
            }

            return {
                success: false,
                error: response.message || 'Đăng nhập thất bại',
            };
        } catch (error) {
            console.error('🔐 Login Error:', error); // Debug log

            // Extract error message from API response
            const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
            const errorMessage = axiosError.response?.data?.message
                || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';

            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    /**
     * Register new user
     * @param data - Registration data
     * @returns Promise with auth response
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        try {
            // http.post returns ApiResponse<T> after interceptor unwrapping
            const response = await http.post('/auth/register', data) as unknown as ApiResponse<AuthData>;

            console.log('📝 Register API Response:', response); // Debug log

            if (response.success && response.data?.token) {
                const { token } = response.data;

                // Save token to localStorage
                saveToken(token);

                return {
                    success: true,
                    accessToken: token,
                };
            }

            return {
                success: false,
                error: response.message || 'Đăng ký thất bại',
            };
        } catch (error) {
            console.error('📝 Register Error:', error); // Debug log

            // Extract detailed error info
            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: ApiResponse<unknown>;
                };
                message?: string;
            };

            const status = axiosError.response?.status;
            const backendMessage = axiosError.response?.data?.message;

            // Show specific error based on status code
            let errorMessage = 'Đăng ký thất bại.';
            if (status === 500) {
                errorMessage = backendMessage || 'Lỗi server (500). Backend đang có vấn đề.';
            } else if (status === 409 || backendMessage?.toLowerCase().includes('exist')) {
                errorMessage = 'Email này đã được sử dụng.';
            } else if (status === 400) {
                errorMessage = backendMessage || 'Dữ liệu không hợp lệ.';
            } else if (backendMessage) {
                errorMessage = backendMessage;
            }

            console.error(`📝 Register failed [${status}]: ${errorMessage}`);

            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    /**
     * Logout user (clear session)
     * @returns Promise<void>
     */
    logout: async (): Promise<void> => {
        removeToken();
        // Optional: Call logout endpoint if backend has one
        // await http.post('/auth/logout');
    },

    /**
     * Verify if token is still valid
     * @returns Promise<boolean>
     */
    verifyToken: async (): Promise<boolean> => {
        try {
            // Call a protected endpoint to verify token
            await http.get('/auth/me');
            return true;
        } catch {
            return false;
        }
    },
};
