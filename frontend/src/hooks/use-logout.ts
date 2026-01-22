/**
 * useLogout Hook
 *
 * Handles logout logic including:
 * - Clear localStorage token
 * - Clear persisted auth store
 * - Reset onboarding store
 * - Redirect to login page
 *
 * @see /services/auth.service.ts
 * @see /stores/useOnboardingStore.ts
 * @see /stores/useAuthStore.ts
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface UseLogoutReturn {
    logout: () => Promise<void>;
    isLoggingOut: boolean;
}

export const useLogout = (): UseLogoutReturn => {
    const router = useRouter();
    const resetOnboarding = useOnboardingStore((state) => state.reset);
    const logoutAuthStore = useAuthStore((state) => state.logout);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = useCallback(async () => {
        setIsLoggingOut(true);

        try {
            console.log('🚪 Logging out...');

            // 1. Clear token from localStorage & cookies
            await authService.logout();

            // 2. Reset auth store (this also clears persisted state)
            logoutAuthStore();

            // 3. Manually clear auth storage to be sure
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-storage');
            }

            // 4. Reset onboarding store
            resetOnboarding();

            console.log('✅ Logout complete, redirecting to login');

            // 5. Redirect to login (use replace to prevent back navigation)
            router.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if there's an error
            router.replace('/login');
        } finally {
            setIsLoggingOut(false);
        }
    }, [router, resetOnboarding, logoutAuthStore]);

    return {
        logout,
        isLoggingOut,
    };
};

