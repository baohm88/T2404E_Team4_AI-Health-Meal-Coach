/**
 * Auth Store
 * 
 * Manages authentication state using Zustand with persistence.
 * 
 * @see /lib/constants/auth.constants.ts - Auth configuration
 * @see /services/auth.service.ts - Auth API calls
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_USER } from '@/lib/mock-data';
import { AUTH_STORAGE_KEY, generateMockToken } from '@/lib/constants/auth.constants';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/** User entity type */
export interface User {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
}

/** Auth state interface */
interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

/** Auth actions interface */
interface AuthActions {
    /** Set user after successful login */
    loginSuccess: (user: User, token: string) => void;
    /** Mock login for development */
    loginAsGuest: () => void;
    /** Clear auth state */
    logout: () => void;
    /** Update user profile */
    updateUser: (userData: Partial<User>) => void;
}

/** Combined store type */
type AuthStore = AuthState & AuthActions;

// ============================================================
// INITIAL STATE
// ============================================================

const INITIAL_STATE: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // -------------------- STATE --------------------
            ...INITIAL_STATE,

            // -------------------- ACTIONS --------------------

            loginSuccess: (user, token) => {
                set({
                    user,
                    accessToken: token,
                    isAuthenticated: true,
                });
            },

            loginAsGuest: () => {
                set({
                    user: {
                        id: MOCK_USER.id,
                        email: MOCK_USER.email,
                        fullName: MOCK_USER.name,
                        avatar: MOCK_USER.avatar,
                    },
                    accessToken: generateMockToken(),
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set(INITIAL_STATE);
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                }));
            },
        }),
        {
            name: AUTH_STORAGE_KEY,
        }
    )
);

// ============================================================
// SELECTOR HOOKS (Performance optimization)
// ============================================================

/** Selector: Get current user (avoids re-render when token changes) */
export const useCurrentUser = () => useAuthStore((state) => state.user);

/** Selector: Check if authenticated */
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

/** Selector: Get access token */
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
