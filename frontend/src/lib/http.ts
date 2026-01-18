/**
 * HTTP Client
 *
 * Axios instance configured for backend API communication.
 * Handles token attachment and error responses.
 *
 * @see /types/api.ts - Type definitions
 * @see /services/*.ts - Service implementations
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api';

// ============================================================
// CONSTANTS
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const TOKEN_KEY = 'accessToken';

// ============================================================
// AXIOS INSTANCE
// ============================================================

export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Only run in browser environment
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

http.interceptors.response.use(
    // Success: Unwrap data from ApiResponse wrapper
    (response) => {
        // Return the wrapped data structure
        return response.data;
    },
    // Error handling
    (error: AxiosError<ApiResponse<unknown>>) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = '/login';
            }
        }

        // Re-throw for service layer to handle
        return Promise.reject(error);
    }
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Save token to localStorage
 */
export const saveToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export default http;
