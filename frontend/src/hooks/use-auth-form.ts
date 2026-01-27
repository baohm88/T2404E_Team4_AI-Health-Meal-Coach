import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { saveToken } from '@/lib/http';
import { LoginData, loginSchema, RegisterData, registerSchema } from '@/lib/schemas/auth.schema';
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
            console.log('🔐 [useLoginForm] Calling authService.login...');
            const loginRes = await authService.login(data);
            console.log('🔐 [useLoginForm] Login response:', loginRes);

            if (!loginRes.success) {
                console.error('❌ [useLoginForm] Login failed:', loginRes.error);
                setServerError(loginRes.error || 'Đăng nhập thất bại');
                return;
            }

            console.log('✅ [useLoginForm] Login successful, token:', loginRes.accessToken);

            if (loginRes.accessToken) {
                console.log('💾 [useLoginForm] Saving token to localStorage...');
                saveToken(loginRes.accessToken);

                // Verify token was saved
                const savedToken = localStorage.getItem('accessToken');
                console.log('🔍 [useLoginForm] Token in localStorage after save:', savedToken);

                // 🔥 FIX RACE CONDITION: Chờ 100ms để Cookie kịp lưu trước khi gọi API tiếp theo
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                console.warn('⚠️ [useLoginForm] No accessToken in response!');
            }

            toast.success('Đăng nhập thành công!');
            console.log('🚀 [useLoginForm] Redirecting...');

            // Check Role & Redirect
            const { getUserRole, UserRole } = require('@/lib/utils/auth'); // Import dynamically to avoid cycle if any
            const role = getUserRole(loginRes.accessToken || '');
            
            if (role === UserRole.ADMIN) {
                 console.log('🛡️ User is ADMIN -> Redirecting to /admin');
                 
                 // Update Auth Store
                 const { useAuthStore } = require('@/stores/useAuthStore');
                 
                 useAuthStore.getState().loginSuccess({
                     id: loginRes.user?.id || '0',
                     email: loginRes.user?.email || data.email,
                     fullName: loginRes.user?.fullName || 'Admin',
                 }, loginRes.accessToken || '');

                 router.push('/admin');
            } else {
                 console.log('👤 User is MEMBER -> Checking onboarding data');
                 
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

            // Thông báo và chuyển hướng
            toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            router.push('/login');
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
