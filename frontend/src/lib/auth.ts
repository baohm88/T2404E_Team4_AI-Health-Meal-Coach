/**
 * Auth Utilities
 *
 * Helper functions for authentication including JWT token decoding.
 *
 * @see /lib/http.ts - HTTP client with token management
 */

import { jwtDecode } from 'jwt-decode';

// ============================================================
// TYPES
// ============================================================

/** JWT Token Payload structure (matches backend) */
interface JwtPayload {
    sub?: string;       // Email or user identifier
    userId?: number;
    email?: string;
    fullName?: string;
    role?: string;
    exp?: number;       // Expiration timestamp
    iat?: number;       // Issued at timestamp
}

/** User info extracted from token */
export interface TokenUser {
    id: string;
    email: string;
    fullName: string;
    role?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const TOKEN_KEY = 'accessToken';

// ============================================================
// FUNCTIONS
// ============================================================

/**
 * Get user info by decoding JWT token from localStorage
 * @returns User object or null if no valid token
 */
export const getUserFromToken = (): TokenUser | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return null;
        }

        const decoded = jwtDecode<JwtPayload>(token);

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.warn('Token expired');
            localStorage.removeItem(TOKEN_KEY);
            return null;
        }

        // Extract user info from payload
        // Backend may use different field names, so we check multiple options
        const email = decoded.email || decoded.sub || '';
        const id = decoded.userId?.toString() || decoded.sub || '';
        const fullName = decoded.fullName || email.split('@')[0] || 'User';
        const role = decoded.role;

        return {
            id,
            email,
            fullName,
            role,
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Check if user is currently authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
    return getUserFromToken() !== null;
};

/**
 * Get user's display name from token
 * @returns Display name or 'Guest' if not logged in
 */
export const getDisplayName = (): string => {
    const user = getUserFromToken();
    return user?.fullName || user?.email?.split('@')[0] || 'Guest';
};

/**
 * Get user's email from token
 * @returns Email or empty string if not logged in
 */
export const getUserEmail = (): string => {
    const user = getUserFromToken();
    return user?.email || '';
};
