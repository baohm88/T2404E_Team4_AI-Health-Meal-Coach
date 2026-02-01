import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { saveToken } from '@/lib/http';
import { LoginData, loginSchema, RegisterData, registerSchema, VerifyOtpData, verifyOtpSchema } from '@/lib/schemas/auth.schema';
import { mapFrontendToBackend } from '@/lib/utils/data-mapper';
import { aiService } from '@/services/ai.service';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';

interface UseAuthFormReturn<T extends LoginData | RegisterData> {
    form: UseFormReturn<T>;
    onSubmit: (data: T) => Promise<void>;
    isLoading: boolean;
    serverError: string | null;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
}

/** Helper: Lấy dữ liệu onboarding từ localStorage */
function getGuestData(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem('onboarding-data');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return parsed?.state?.formData ?? null;
    } catch {
        return null;
    }
}

/**
 * Hàm đồng bộ dữ liệu và chuyển hướng
 */
async function syncGuestDataAndRedirect(token: string, router: ReturnType<typeof useRouter>) {
    const guestData = getGuestData();

    // 1. Kiểm tra xem user đã có Profile chưa (Tránh spam AI và đè dữ liệu cũ)
    const existingProfile = await profileService.getProfile();

    if (existingProfile.success && existingProfile.data) {
        console.log('✅ User already has profile. Skipping onboarding sync.');
        // Xóa dữ liệu rác nếu có
        if (guestData) {
            console.log('🧹 Clearing stale guest data.');
            localStorage.removeItem('onboarding-data');
        }
        router.push('/dashboard/schedule');
        return;
    }

    // 2. Nếu User MỚI (chưa có profile) mà KHÔNG có guestData -> Về Dashboard (để tạo mới từ đầu) hoặc Schedule
    if (!guestData) {
        // Tùy logic: Chưa có profile mà vào dashboard sẽ bị redirect sang onboarding (nếu logic dashboard xử lý)
        // Nhưng ở đây ta cứ cho vào dashboard để user tự xử lý
        router.push('/dashboard/schedule');
        return;
    }

    // 3. User MỚI + Có GuestData -> Sync và tạo Profile
    try {
        console.log('🚀 Syncing guest data for new user...');
        const mapped = mapFrontendToBackend(guestData);

        // Lưu Profile
        const profileRes = await profileService.createProfile(mapped);
        if (!profileRes.success) {
            console.warn('Profile sync warning:', profileRes.message);
        }

        // Chạy AI phân tích
        await aiService.analyzeHealth(mapped);

        // Xóa localStorage
        localStorage.removeItem('onboarding-data');

        // Redirect về Result
        router.push('/onboarding/result');
    } catch (e) {
        console.error('Error during guest sync:', e);
        // Fallback về dashboard nếu lỗi
        router.push('/dashboard/schedule');
    }
}

/** LOGIN FORM HOOK */
export const useLoginForm = (): UseAuthFormReturn<LoginData> => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = useCallback(async (data: LoginData) => {
        setIsLoading(true);
        setServerError(null);
        try {
            const loginRes = await authService.login(data);

            if (!loginRes.success) {
                setServerError(loginRes.error || 'Đăng nhập thất bại');
                return;
            }

            if (loginRes.accessToken) {
                saveToken(loginRes.accessToken);

                // Verify token was saved
                const savedToken = localStorage.getItem('accessToken');

                // 🔥 FIX RACE CONDITION: Chờ 100ms để Cookie kịp lưu trước khi gọi API tiếp theo
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                // No accessToken in response!
            }

            toast.success('Đăng nhập thành công!');

            // Check Role & Redirect
            const { getUserRole, UserRole } = require('@/lib/utils/auth'); // Import dynamically to avoid cycle if any
            const role = getUserRole(loginRes.accessToken || '');

            if (role === UserRole.ADMIN) {

                // Update Auth Store
                const { useAuthStore } = require('@/stores/useAuthStore');

                useAuthStore.getState().loginSuccess({
                    id: loginRes.user?.id || '0',
                    email: loginRes.user?.email || data.email,
                    fullName: loginRes.user?.fullName || 'Admin',
                }, loginRes.accessToken || '');

                router.push('/admin');
            } else {

                // Update Auth Store
                const { useAuthStore } = require('@/stores/useAuthStore');

                useAuthStore.getState().loginSuccess({
                    id: loginRes.user?.id || '0',
                    email: loginRes.user?.email || data.email,
                    fullName: loginRes.user?.fullName || 'User',
                }, loginRes.accessToken || '');

                await syncGuestDataAndRedirect(loginRes.accessToken ?? '', router);
            }
        } catch (err) {
            console.error('❌ [useLoginForm] Error:', err);
            setServerError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const togglePasswordVisibility = useCallback(() => setShowPassword((p) => !p), []);

    return { form, onSubmit, isLoading, serverError, showPassword, togglePasswordVisibility };
};

/** REGISTER FORM HOOK */
export const useRegisterForm = (): UseAuthFormReturn<RegisterData> => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        setServerError(null);
        try {
            const registerRes = await authService.register(data);
            if (!registerRes.success) {
                setServerError(registerRes.error || 'Đăng ký thất bại');
                setIsLoading(false);
                return;
            }

            // Thông báo và chuyển hướng đến trang xác thực OTP
            toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.');
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } catch (err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            const msg = axiosErr.response?.data?.message || 'Lỗi kết nối server';
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const togglePasswordVisibility = useCallback(() => setShowPassword((p) => !p), []);

    return { form, onSubmit, isLoading, serverError, showPassword, togglePasswordVisibility };
};

// ============================================================
// VERIFY OTP FORM HOOK
// ============================================================

interface UseVerifyOtpFormReturn {
    form: UseFormReturn<VerifyOtpData>;
    onSubmit: (data: VerifyOtpData) => Promise<void>;
    isLoading: boolean;
    serverError: string | null;
    resendOtp: () => Promise<void>;
    isResending: boolean;
    resendCooldown: number;
}

export const useVerifyOtpForm = (email: string): UseVerifyOtpFormReturn => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    const form = useForm<VerifyOtpData>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: { email: email, otp: '' },
    });

    // Cooldown timer effect
    React.useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onSubmit = useCallback(async (data: VerifyOtpData) => {
        setIsLoading(true);
        setServerError(null);
        try {
            const verifyRes = await authService.verifyOtp(data.email, data.otp);

            if (!verifyRes.success) {
                setServerError(verifyRes.error || 'Xác thực OTP thất bại');
                setIsLoading(false);
                return;
            }

            toast.success('Xác thực email thành công! Hãy đăng nhập để tiếp tục.');
            router.push('/login');
        } catch (err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            const msg = axiosErr.response?.data?.message || 'Có lỗi xảy ra';
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const resendOtp = useCallback(async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        setServerError(null);
        try {
            const resendRes = await authService.resendOtp(email);

            if (!resendRes.success) {
                setServerError(resendRes.error || 'Gửi lại OTP thất bại');
                return;
            }

            toast.success('Đã gửi lại mã OTP. Vui lòng kiểm tra email.');
            setResendCooldown(60); // 60 seconds cooldown
        } catch (err) {
            setServerError('Không thể gửi lại mã OTP');
        } finally {
            setIsResending(false);
        }
    }, [email, resendCooldown]);

    return { form, onSubmit, isLoading, serverError, resendOtp, isResending, resendCooldown };
};

// Import React for useEffect
import * as React from 'react';
