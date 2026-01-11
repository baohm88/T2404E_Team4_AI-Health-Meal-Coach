/**
 * useAuthForm Hook
 * 
 * Custom hook for authentication form logic (Login/Register).
 * Handles form state, validation, submission, and navigation.
 * 
 * @see /services/auth.service.ts - Auth API calls
 * @see /stores/useAuthStore.ts - Auth state management
 */

import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { loginSchema, registerSchema, LoginData, RegisterData } from '@/lib/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { submitOnboarding } from '@/services/profile.service';
import { OnboardingData } from '@/lib/schemas/onboarding.schema';

// ============================================================
// TYPES
// ============================================================

type AuthMode = 'login' | 'register';

interface UseAuthFormReturn<T extends LoginData | RegisterData> {
    /** React Hook Form instance */
    form: UseFormReturn<T>;
    /** Form submission handler */
    onSubmit: (data: T) => Promise<void>;
    /** Loading state */
    isLoading: boolean;
    /** Server-side error message */
    serverError: string | null;
    /** Password visibility toggle */
    showPassword: boolean;
    /** Toggle password visibility */
    togglePasswordVisibility: () => void;
    /** Check if user has pending onboarding data */
    hasPendingOnboarding: boolean;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

/**
 * Login form hook
 */
export const useLoginForm = (): UseAuthFormReturn<LoginData> => {
    const router = useRouter();
    const loginSuccess = useAuthStore((state) => state.loginSuccess);
    const { formData: onboardingData, reset: resetOnboarding } = useOnboardingStore();

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const hasPendingOnboarding = !!onboardingData.goal;

    const onSubmit = useCallback(async (data: LoginData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await authService.login(data);

            if (response.success && response.user && response.accessToken) {
                loginSuccess(response.user, response.accessToken);

                // Handle pending onboarding data
                if (hasPendingOnboarding) {
                    await submitOnboarding(onboardingData as OnboardingData);
                    resetOnboarding();
                }

                router.push('/dashboard');
            } else {
                setServerError(response.error || 'Đăng nhập thất bại');
            }
        } catch {
            setServerError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    }, [loginSuccess, onboardingData, hasPendingOnboarding, resetOnboarding, router]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return {
        form,
        onSubmit,
        isLoading,
        serverError,
        showPassword,
        togglePasswordVisibility,
        hasPendingOnboarding,
    };
};

/**
 * Register form hook
 */
export const useRegisterForm = (): UseAuthFormReturn<RegisterData> => {
    const router = useRouter();
    const loginSuccess = useAuthStore((state) => state.loginSuccess);
    const { formData: onboardingData, reset: resetOnboarding } = useOnboardingStore();

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const hasPendingOnboarding = !!onboardingData.goal;

    const onSubmit = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await authService.register(data);

            if (response.success && response.user && response.accessToken) {
                loginSuccess(response.user, response.accessToken);

                // Handle pending onboarding data
                if (hasPendingOnboarding) {
                    await submitOnboarding(onboardingData as OnboardingData);
                    resetOnboarding();
                }

                router.push('/dashboard');
            } else {
                setServerError(response.error || 'Đăng ký thất bại');
            }
        } catch {
            setServerError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    }, [loginSuccess, onboardingData, hasPendingOnboarding, resetOnboarding, router]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return {
        form,
        onSubmit,
        isLoading,
        serverError,
        showPassword,
        togglePasswordVisibility,
        hasPendingOnboarding,
    };
};
