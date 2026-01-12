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

import { loginSchema, registerSchema, LoginData, RegisterData } from '@/lib/schemas/auth.schema';
import { authService } from '@/services/auth.service';
// Note: useAuthStore disabled - backend doesn't return user info, will decode from JWT later
// import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { submitOnboarding } from '@/services/profile.service';
import { OnboardingData } from '@/lib/schemas/onboarding.schema';

// ============================================================
// TYPES
// ============================================================

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

            console.log('🔐 Login Result:', response); // Debug log

            // ✅ Chỉ cần check success - backend không trả về user
            if (response.success) {
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
    }, [onboardingData, hasPendingOnboarding, resetOnboarding, router]);

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

    /**
     * Register with Auto-Login Flow:
     * 1. Register → Create account
     * 2. Auto-Login → Get token (required for API calls)
     * 3. Save Onboarding → Send health profile data
     * 4. Redirect → Dashboard
     */
    const onSubmit = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            // ========================================
            // STEP 1: REGISTER
            // ========================================
            console.log('📝 Step 1: Registering user...');
            const registerResponse = await authService.register(data);
            console.log('📝 Register Response:', registerResponse);

            if (!registerResponse.success && !registerResponse.accessToken) {
                setServerError(registerResponse.error || 'Đăng ký thất bại');
                return;
            }

            // ========================================
            // STEP 2: AUTO-LOGIN (Get Token)
            // ========================================
            console.log('📝 Step 2: Auto-login to get token...');
            const loginResponse = await authService.login({
                email: data.email,
                password: data.password,
            });
            console.log('📝 Login Response:', loginResponse);

            if (!loginResponse.success && !loginResponse.accessToken) {
                // Registration succeeded but login failed - redirect to login page
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                router.push('/login');
                return;
            }

            // ========================================
            // STEP 3: SAVE ONBOARDING DATA (if any)
            // ========================================
            if (hasPendingOnboarding) {
                console.log('📝 Step 3: Saving onboarding data...');
                console.log('📝 Onboarding Data Payload:', onboardingData);

                try {
                    await submitOnboarding(onboardingData as OnboardingData);
                    console.log('📝 Onboarding data saved successfully!');
                    resetOnboarding();
                } catch (err) {
                    console.error('📝 Failed to save onboarding data:', err);
                    // Continue anyway - user can re-enter profile data later
                }
            }

            // ========================================
            // STEP 4: REDIRECT TO DASHBOARD
            // ========================================
            console.log('📝 Step 4: Redirecting to dashboard...');
            router.push('/dashboard');

        } catch (error) {
            console.error('📝 Register Error:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            const msg = axiosError?.response?.data?.message || 'Lỗi kết nối server';
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [router, hasPendingOnboarding, onboardingData, resetOnboarding]);

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

