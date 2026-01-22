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
 * Save token to localStorage and cookie
 * Cookie is required for Next.js middleware (server-side auth check)
 */
export const saveToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        // 1. Save to localStorage for client-side API calls
        localStorage.setItem(TOKEN_KEY, token);

        // 2. Save to cookie for middleware (server-side)
        // Set path to / so it's available on all routes
        // Set secure=true if on https
        const isSecure = window.location.protocol === 'https:';
        document.cookie = `access_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; ${isSecure ? 'Secure;' : ''} SameSite=Lax`;
    }
};

/**
 * Remove token from localStorage and cookie
 */
export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        // 1. Remove from localStorage
        localStorage.removeItem(TOKEN_KEY);

        // 2. Remove from cookie by setting expiry to past
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
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
