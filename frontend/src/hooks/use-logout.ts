/**
 * useLogout Hook
 *
 * Handles logout logic including:
 * - Clear localStorage token
 * - Reset onboarding store
 * - Redirect to login page
 *
 * @see /services/auth.service.ts
 * @see /stores/useOnboardingStore.ts
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

interface UseLogoutReturn {
    logout: () => Promise<void>;
    isLoggingOut: boolean;
}

export const useLogout = (): UseLogoutReturn => {
    const router = useRouter();
    const resetOnboarding = useOnboardingStore((state) => state.reset);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = useCallback(async () => {
        setIsLoggingOut(true);

        try {
            // 1. Clear token from localStorage
            await authService.logout();

            // 2. Reset onboarding store
            resetOnboarding();

            // 3. Redirect to login (use replace to prevent back navigation)
            router.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if there's an error
            router.replace('/login');
        } finally {
            setIsLoggingOut(false);
        }
    }, [router, resetOnboarding]);

    return {
        logout,
        isLoggingOut,
    };
};
