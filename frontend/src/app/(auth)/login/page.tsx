/**
 * Login Page
 * 
 * UI-only component - all logic in useLoginForm hook.
 * 
 * @see /hooks/use-auth-form.ts
 */

'use client';

import Link from 'next/link';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLoginForm } from '@/hooks/use-auth-form';

// ============================================================
// COMPONENT
// ============================================================

export default function LoginPage() {
    const {
        form: { register, handleSubmit, formState: { errors } },
        onSubmit,
        isLoading,
        serverError,
        showPassword,
        togglePasswordVisibility,
        hasPendingOnboarding,
    } = useLoginForm();

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-10 border border-white/50">
            {/* Header */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-block text-2xl font-bold text-slate-800 mb-2">
                    <span className="text-primary">AI</span>HealthCoach
                </Link>
                <h1 className="text-2xl font-bold text-slate-800 mt-4">Đăng nhập</h1>
                <p className="text-slate-500 mt-2">Chào mừng bạn quay trở lại!</p>
            </div>

            {/* Pending Onboarding Notice */}
            {hasPendingOnboarding && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                    📋 Bạn đã hoàn thành bài test. Đăng nhập để lưu kết quả vào tài khoản.
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            {...register('email')}
                            className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-primary'
                                } focus:outline-none focus:ring-2 bg-white/50 transition-all`}
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-primary'
                                } focus:outline-none focus:ring-2 bg-white/50 transition-all`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {serverError}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-green-600 text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang đăng nhập...
                        </>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
            </form>

            {/* Social Login Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-sm text-slate-400">hoặc</span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-4">
                <SocialButton provider="google" />
                <SocialButton provider="facebook" />
            </div>

            {/* Register Link */}
            <p className="text-center mt-8 text-slate-600">
                Bạn chưa có tài khoản?{' '}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface SocialButtonProps {
    provider: 'google' | 'facebook';
}

const SocialButton = ({ provider }: SocialButtonProps) => {
    const icons = {
        google: (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
        ),
        facebook: (
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    };

    const labels = {
        google: 'Google',
        facebook: 'Facebook',
    };

    return (
        <button className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            {icons[provider]}
            {labels[provider]}
        </button>
    );
};
