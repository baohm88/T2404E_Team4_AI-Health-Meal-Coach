/**
 * Authentication Constants
 * Centralized configuration for auth module
 */

// ============================================================
// STORAGE KEYS
// ============================================================

/** Key for persisting auth state in localStorage */
export const AUTH_STORAGE_KEY = 'auth-storage';

// ============================================================
// API DELAYS (Mock)
// ============================================================

/** Simulated API delay in milliseconds */
export const API_DELAY_MS = 1500;

// ============================================================
// ERROR MESSAGES
// ============================================================

export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
    NETWORK_ERROR: 'Lỗi kết nối. Vui lòng thử lại.',
    SESSION_EXPIRED: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
    REGISTER_FAILED: 'Đăng ký thất bại. Vui lòng thử lại.',
} as const;

// ============================================================
// SUCCESS MESSAGES
// ============================================================

export const AUTH_SUCCESS = {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: 'Đăng ký thành công! Chào mừng bạn.',
    LOGOUT: 'Đã đăng xuất.',
} as const;

// ============================================================
// MOCK TOKENS (Development only)
// ============================================================

/** Prefix for mock tokens */
export const MOCK_TOKEN_PREFIX = 'mock_token_';

/** Generate a mock token */
export const generateMockToken = (): string => {
    return `${MOCK_TOKEN_PREFIX}${Date.now()}`;
};
