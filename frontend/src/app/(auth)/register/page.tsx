/**
 * Register Page
 * 
 * UI-only component - all logic in useRegisterForm hook.
 * 
 * @see /hooks/use-auth-form.ts
 */

'use client';

import { useRegisterForm } from '@/hooks/use-auth-form';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ============================================================
// COMPONENT
// ============================================================

import { Suspense } from 'react';

function RegisterContent() {
    const {
        form: { register, handleSubmit, formState: { errors } },
        onSubmit,
        isLoading,
        serverError,
        showPassword,
        togglePasswordVisibility,
    } = useRegisterForm();

    const searchParams = useSearchParams();
    const isFromOnboarding = searchParams.get('from') === 'onboarding';

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-10 border border-white/50">
            {/* Header */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-block text-2xl font-bold text-slate-800 mb-2">
                    <span className="text-primary">AI</span>HealthCoach
                </Link>
                <h1 className="text-2xl font-bold text-slate-800 mt-4">Tạo tài khoản</h1>
                <p className="text-slate-500 mt-2">
                    Bất đầu hành trình sức khỏe của bạn
                </p>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name Field */}
                <FormField
                    label="Họ và tên"
                    icon={<User className="w-5 h-5" />}
                    error={errors.fullName?.message}
                >
                    <input
                        type="text"
                        {...register('fullName')}
                        className={inputClassName(!!errors.fullName)}
                        placeholder="Nguyễn Văn A"
                    />
                </FormField>

                {/* Email Field */}
                <FormField
                    label="Email"
                    icon={<Mail className="w-5 h-5" />}
                    error={errors.email?.message}
                >
                    <input
                        type="email"
                        {...register('email')}
                        className={inputClassName(!!errors.email)}
                        placeholder="name@example.com"
                    />
                </FormField>

                {/* Password Field */}
                <FormField
                    label="Mật khẩu"
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.password?.message}
                    rightElement={
                        <PasswordToggle visible={showPassword} onToggle={togglePasswordVisibility} />
                    }
                >
                    <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className={inputClassName(!!errors.password, true)}
                        placeholder="Ít nhất 6 ký tự"
                    />
                </FormField>

                {/* Confirm Password Field */}
                <FormField
                    label="Xác nhận mật khẩu"
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.confirmPassword?.message}
                    rightElement={
                        <PasswordToggle visible={showPassword} onToggle={togglePasswordVisibility} />
                    }
                >
                    <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className={inputClassName(!!errors.confirmPassword, true)}
                        placeholder="Nhập lại mật khẩu"
                    />
                </FormField>

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
                    className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-green-600 text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang tạo tài khoản...
                        </>
                    ) : (
                        'Đăng ký'
                    )}
                </button>
            </form>

            {/* Login Link */}
            {!isFromOnboarding && (
                <p className="text-center mt-8 text-slate-600">
                    Bạn đã có tài khoản?{' '}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            )}
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <RegisterContent />
        </Suspense>
    );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface FormFieldProps {
    label: string;
    icon: React.ReactNode;
    error?: string;
    rightElement?: React.ReactNode;
    children: React.ReactNode;
}

const FormField = ({ label, icon, error, rightElement, children }: FormFieldProps) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </span>
            {children}
            {rightElement}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
);

interface PasswordToggleProps {
    visible: boolean;
    onToggle: () => void;
}

const PasswordToggle = ({ visible, onToggle }: PasswordToggleProps) => (
    <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
    >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
);

// ============================================================
// UTILITIES
// ============================================================

const inputClassName = (hasError: boolean, hasRightElement = false): string => {
    const baseClasses = 'w-full pl-12 py-3.5 rounded-xl border focus:outline-none focus:ring-2 bg-white/50 transition-all';
    const rightPadding = hasRightElement ? 'pr-12' : 'pr-4';
    const borderColor = hasError ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-primary';

    return `${baseClasses} ${rightPadding} ${borderColor}`;
};
