/**
 * useAuthForm Hook
 * 
 * Custom hook for authentication form logic (Login/Register).
 * Handles form state, validation, submission, and navigation.
 * 
 * POST-AUTH ONBOARDING FLOW:
 * 1. Login/Register → Get Token
 * 2. Check if user has HealthProfile
 * 3. If NO profile → Redirect to /onboarding
 * 4. If HAS profile → Redirect to /dashboard
 * 
 * @see /services/auth.service.ts - Auth API calls
 * @see /services/profile.service.ts - Profile API calls
 */

import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { loginSchema, registerSchema, LoginData, RegisterData } from '@/lib/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';

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
}

// ============================================================
// HELPER: Route based on profile status
// ============================================================

/**
 * Check if user has HealthProfile and redirect accordingly
 * @param router - Next.js router
 * @param redirectUrl - Optional URL to redirect to (from query param)
 */
async function routeBasedOnProfile(
    router: ReturnType<typeof useRouter>,
    redirectUrl?: string | null
): Promise<void> {
    try {
        const profileResponse = await profileService.getProfile();

        if (profileResponse.success && profileResponse.data) {
            // User has profile → go to dashboard (or redirect URL)
            router.push(redirectUrl || '/dashboard');
        } else {
            // No profile → go to onboarding
            router.push('/onboarding');
        }
    } catch {
        // Error checking profile → assume no profile, go to onboarding
        router.push('/onboarding');
    }
}

// ============================================================
// LOGIN FORM HOOK
// ============================================================

export const useLoginForm = (): UseAuthFormReturn<LoginData> => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

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

    const onSubmit = useCallback(async (data: LoginData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            // ========================================
            // STEP 1: LOGIN
            // ========================================
            const response = await authService.login(data);
            console.log('🔐 Login Result:', response);

            if (!response.success) {
                setServerError(response.error || 'Đăng nhập thất bại');
                return;
            }

            // ========================================
            // STEP 2: CHECK EXISTING PROFILE
            // ========================================
            console.log('🔐 Step 2: Checking existing profile...');
            let hasExistingProfile = false;
            try {
                const profileResponse = await profileService.getProfile();
                hasExistingProfile = profileResponse.success && !!profileResponse.data;
            } catch {
                // No profile or error - continue
            }

            // ========================================
            // STEP 3: CHECK FOR GUEST DATA & SYNC
            // ========================================
            console.log('🔐 Step 3: Checking for guest data...');
            const storedData = localStorage.getItem('onboarding-data');

            if (storedData && !hasExistingProfile) {
                // CASE A: New user with guest data → Sync to server
                try {
                    const parsed = JSON.parse(storedData);
                    const formData = parsed?.state?.formData;

                    if (formData && formData.gender && formData.activityLevel) {
                        console.log('🔐 Found guest data, syncing to server...');
                        const syncResponse = await profileService.createProfile(formData);

                        if (syncResponse.success) {
                            console.log('✅ Guest data synced successfully!');
                            localStorage.removeItem('onboarding-data');
                        } else {
                            console.warn('⚠️ Sync failed:', syncResponse.message);
                        }
                    }
                } catch (parseError) {
                    console.warn('⚠️ Could not parse guest data:', parseError);
                }

                router.push('/dashboard');
                return;
            }

            if (hasExistingProfile) {
                // CASE B: Existing user → Clear guest data, go to dashboard
                console.log('🔐 Existing profile found, going to dashboard');
                localStorage.removeItem('onboarding-data');
                router.push(redirectUrl || '/dashboard');
                return;
            }

            // CASE C: No profile, no guest data → Go to onboarding
            console.log('🔐 No profile found, going to onboarding');
            router.push('/onboarding');

        } catch {
            setServerError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    }, [router, redirectUrl]);

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
    };
};

// ============================================================
// REGISTER FORM HOOK
// ============================================================

export const useRegisterForm = (): UseAuthFormReturn<RegisterData> => {
    const router = useRouter();

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

    /**
     * Register with Auto-Login Flow:
     * 1. Register → Create account
     * 2. Auto-Login → Get token
     * 3. Redirect → /onboarding (new users always need onboarding)
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
            // STEP 2: ENSURE WE HAVE TOKEN
            // Skip login if register already returned token
            // ========================================
            let hasToken = !!registerResponse.accessToken;

            if (!hasToken) {
                console.log('📝 Step 2: Register didnt return token, trying auto-login...');
                const loginResponse = await authService.login({
                    email: data.email,
                    password: data.password,
                });
                console.log('📝 Login Response:', loginResponse);
                hasToken = loginResponse.success || !!loginResponse.accessToken;

                if (!hasToken) {
                    console.warn('⚠️ Auto-login failed, redirecting to login page');
                    router.push('/login');
                    return;
                }
            }

            console.log('✅ Authentication complete, proceeding to sync...');

            // ========================================
            // STEP 3: CHECK FOR PENDING ONBOARDING DATA
            // GUEST FIRST FLOW: Save data from localStorage
            // ========================================
            console.log('📝 Step 3: Checking for pending onboarding data...');

            // Get data from localStorage (Zustand persist)
            const storedData = localStorage.getItem('onboarding-data');

            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData);
                    const formData = parsed?.state?.formData;

                    // Check if onboarding was completed as guest
                    if (formData && formData.gender && formData.activityLevel) {
                        console.log('📝 Found pending onboarding data:', formData);
                        console.log('📝 Auto-saving profile...');

                        // Import profile service dynamically to avoid circular deps
                        const { profileService } = await import('@/services/profile.service');
                        const profileResponse = await profileService.createProfile(formData);

                        if (profileResponse.success) {
                            console.log('✅ Profile saved successfully!');
                            // Clear the localStorage data
                            localStorage.removeItem('onboarding-data');
                            // Redirect to dashboard
                            router.push('/dashboard');
                            return;
                        } else {
                            console.warn('⚠️ Failed to save profile:', profileResponse.message);
                        }
                    }
                } catch (parseError) {
                    console.warn('⚠️ Could not parse onboarding data:', parseError);
                }
            }

            // ========================================
            // STEP 4: NO PENDING DATA → GO TO ONBOARDING
            // ========================================
            console.log('📝 Step 4: No pending data, redirecting to onboarding...');
            router.push('/onboarding');

        } catch (error) {
            console.error('📝 Register Error:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            const msg = axiosError?.response?.data?.message || 'Lỗi kết nối server';
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

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
    };
};
