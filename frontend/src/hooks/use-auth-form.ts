import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { loginSchema, registerSchema, LoginData, RegisterData } from '@/lib/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';
import { aiService } from '@/services/ai.service';
import { mapFrontendToBackend } from '@/lib/utils/data-mapper';
import { saveToken } from '@/lib/http';

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

    // Nếu không có dữ liệu khách -> Vẫn đẩy về result (để user chọn dashboard hoặc premium)
    if (!guestData) {
        router.push('/onboarding/result');
        return;
    }

    try {
        const mapped = mapFrontendToBackend(guestData);

        // 1. Lưu Profile
        const profileRes = await profileService.createProfile(mapped);
        if (!profileRes.success) {
            console.warn('Profile sync failed:', profileRes.message);
        }

        // 2. Chạy AI phân tích
        const aiResult = await aiService.analyzeHealth(mapped);

        // 3. Lưu kết quả AI vào DB (Stringify trước khi gửi)
        if (aiResult.success && aiResult.data) {
            console.log('💾 [syncGuestData] Saving AI result to DB...');
            const jsonString = JSON.stringify(aiResult.data);
            const saveRes = await aiService.saveHealthAnalysis(jsonString);
            if (!saveRes.success) {
                console.warn('Save AI result failed:', saveRes.error);
            }
        }

        // 4. Xóa localStorage sau khi sync xong
        localStorage.removeItem('onboarding-data');
    } catch (e) {
        console.error('Error during guest sync:', e);
    } finally {
        // Dù thành công hay thất bại, luôn chuyển hướng về trang Kết quả
        router.push('/onboarding/result');
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

            console.log('🚀 [useLoginForm] Redirecting...');
            await syncGuestDataAndRedirect(loginRes.accessToken ?? '', router);
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
                return;
            }

            const token = registerRes.accessToken;
            if (token) {
                saveToken(token);
                // 🔥 FIX RACE CONDITION: Chờ 100ms để Cookie kịp lưu
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                // Fallback: Tự động login nếu register không trả về token (tuỳ backend)
                const loginRes = await authService.login({ email: data.email, password: data.password });
                if (loginRes.success && loginRes.accessToken) {
                    saveToken(loginRes.accessToken);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            await syncGuestDataAndRedirect(token ?? '', router);
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