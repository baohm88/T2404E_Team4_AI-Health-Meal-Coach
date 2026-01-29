/**
 * Verify OTP Page
 * 
 * Displays 6-digit OTP input for email verification after registration.
 * Features:
 * - 6 individual input boxes for OTP digits
 * - Auto-submit when all 6 digits entered
 * - Resend OTP with 60s cooldown
 * - Matches login/register page styling
 * 
 * @see /hooks/use-auth-form.ts - useVerifyOtpForm hook
 */

'use client';

import { Suspense, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import { useVerifyOtpForm } from '@/hooks/use-auth-form';

// ============================================================
// OTP INPUT COMPONENT
// ============================================================

interface OtpInputProps {
    value: string;
    onChange: (otp: string) => void;
    disabled?: boolean;
}

const OtpInput = ({ value, onChange, disabled }: OtpInputProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(6, '').split('').slice(0, 6);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // Only allow digits
        if (val && !/^\d$/.test(val)) return;

        const newDigits = [...digits];
        newDigits[index] = val;
        const newOtp = newDigits.join('');
        onChange(newOtp);

        // Auto-focus next input
        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!digits[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            onChange(pastedData);
            // Focus last filled input or the next empty one
            const focusIndex = Math.min(pastedData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    return (
        <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[index] || ''}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
                        w-12 h-14 text-center text-2xl font-bold rounded-xl border-2
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                        transition-all duration-200
                        ${digits[index] ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white/50'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}
                    `}
                />
            ))}
        </div>
    );
};

// ============================================================
// VERIFY OTP CONTENT
// ============================================================

function VerifyOtpContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || '';

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            router.push('/register');
        }
    }, [email, router]);

    const {
        form: { setValue, handleSubmit, watch },
        onSubmit,
        isLoading,
        serverError,
        resendOtp,
        isResending,
        resendCooldown,
    } = useVerifyOtpForm(email);

    const otpValue = watch('otp') || '';

    // Auto-submit when 6 digits entered
    useEffect(() => {
        if (otpValue.length === 6) {
            handleSubmit(onSubmit)();
        }
    }, [otpValue, handleSubmit, onSubmit]);

    const handleOtpChange = (otp: string) => {
        setValue('otp', otp);
    };

    if (!email) {
        return null;
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-10 border border-white/50">
            {/* Header */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-block text-2xl font-bold text-slate-800 mb-2">
                    <span className="text-primary">AI</span>HealthCoach
                </Link>

                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-green-500/20 rounded-full flex items-center justify-center mt-4 mb-4">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-slate-800">Xác thực email</h1>
                <p className="text-slate-500 mt-2">
                    Chúng tôi đã gửi mã OTP 6 chữ số đến
                </p>
                <p className="text-primary font-semibold mt-1 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {email}
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                        Nhập mã xác thực
                    </label>
                    <OtpInput
                        value={otpValue}
                        onChange={handleOtpChange}
                        disabled={isLoading}
                    />
                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                        {serverError}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || otpValue.length < 6}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-green-600 text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang xác thực...
                        </>
                    ) : (
                        'Xác nhận'
                    )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                    <p className="text-slate-500 text-sm mb-2">
                        Không nhận được mã?
                    </p>
                    <button
                        type="button"
                        onClick={resendOtp}
                        disabled={isResending || resendCooldown > 0}
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang gửi...
                            </>
                        ) : resendCooldown > 0 ? (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Gửi lại ({resendCooldown}s)
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Gửi lại mã OTP
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Back to Register */}
            <p className="text-center mt-8 text-slate-600">
                Sai email?{' '}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                    Đăng ký lại
                </Link>
            </p>
        </div>
    );
}

// ============================================================
// FALLBACK LOADING
// ============================================================

function VerifyOtpFallback() {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-10 border border-white/50 animate-pulse">
            <div className="text-center">
                <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto mb-4" />
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4" />
                <div className="h-6 bg-slate-200 rounded w-2/3 mx-auto mb-2" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto" />
            </div>
        </div>
    );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<VerifyOtpFallback />}>
            <VerifyOtpContent />
        </Suspense>
    );
}
