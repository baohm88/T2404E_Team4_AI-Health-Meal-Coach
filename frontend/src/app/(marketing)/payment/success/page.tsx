/**
 * Payment Success Page
 * 
 * Displays success message with confetti animation after payment.
 * Features "Kích hoạt lộ trình chi tiết" button to dashboard.
 * 
 * Route: /payment/success?transactionId={id}
 */

'use client';

import { paymentService } from '@/services/payment.service';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';

// ============================================================
// SUCCESS CONTENT COMPONENT
// ============================================================

function SuccessContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId') || 'N/A';

    // Sound Effect
    const playSuccessSound = () => {
        try {
            const audio = new Audio('/sounds/success.mp3'); // We need to ensure this file exists or use a CDN
            // Fallback if local file doesn't exist, try a CDN or base64? 
            // For now, let's assume valid URL or handle error silently.
            // Using a simple short beep base64 for reliability if file missing is risky.
            // But user asked for "music". Let's try a standard upbeat sound.
            // Actually, I'll use a reliable external URL or placeholder.
            // Better: I will assume the user puts a file in public/sounds, 
            // OR I will create a simple synth beep using Web Audio API to avoid external deps.
            
            // Web Audio API Beep (Celebratory Chord)
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const playNote = (freq: number, delay: number, type: 'sine' | 'triangle' = 'triangle') => {
                     const osc = ctx.createOscillator();
                     const gain = ctx.createGain();
                     osc.type = type;
                     osc.frequency.value = freq;
                     osc.connect(gain);
                     gain.connect(ctx.destination);
                     osc.start(ctx.currentTime + delay);
                     gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
                     gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + delay + 0.5);
                     osc.stop(ctx.currentTime + delay + 0.5);
                };
                
                // C Major Chord Arpeggio
                playNote(523.25, 0); // C5
                playNote(659.25, 0.1); // E5
                playNote(783.99, 0.2); // G5
                playNote(1046.50, 0.4); // C6
            }
            
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    useEffect(() => {
        // 1. Verify Transaction
        if (transactionId && transactionId !== 'N/A') {
            paymentService.checkTransactionStatus(transactionId).then((result) => {
                console.log('Transaction verified:', result);
            });
        }

        // 2. Confetti Explosion
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // 3. Play Sound
        playSuccessSound();

        // 4. Toast Notification
        toast.success('Nâng cấp Premium thành công!', {
            description: 'Chúc mừng bạn! Bạn đã có thể tạo lộ trình dinh dưỡng chi tiết.',
            duration: 5000,
            icon: <Sparkles className="w-5 h-5 text-amber-500" />
        });

        return () => clearInterval(interval);
    }, [transactionId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8, bounce: 0.5 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                            <CheckCircle className="w-16 h-16 text-white" />
                        </div>
                        {/* Sparkle decorations */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-2 -right-2"
                        >
                            <Sparkles className="w-8 h-8 text-amber-400" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className="absolute -bottom-1 -left-3"
                        >
                            <Sparkles className="w-6 h-6 text-pink-400" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
                        🎉 Thanh toán thành công!
                    </h1>
                    <p className="text-lg text-slate-600 max-w-md mx-auto mb-2">
                        Chúc mừng bạn đã trở thành thành viên Premium!
                    </p>
                    <p className="text-sm text-slate-500">
                        Mã giao dịch: <span className="font-mono font-semibold">{transactionId}</span>
                    </p>
                </motion.div>

                {/* Benefits Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-8 max-w-md w-full"
                >
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Bạn đã mở khóa:
                    </h3>
                    <ul className="space-y-3">
                        {[
                            'Thực đơn chi tiết từng ngày',
                            'Công thức nấu ăn hoàn chỉnh',
                            'AI Coach hỗ trợ 24/7',
                            'Lịch tập gym cá nhân hóa',
                            'Báo cáo dinh dưỡng nâng cao',
                        ].map((benefit, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                className="flex items-center gap-3 text-slate-700"
                            >
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                {benefit}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <button
                        onClick={async () => {
                            const toastId = toast.loading('Đang khởi tạo lộ trình cá nhân hóa...');
                            try {
                                const res = await import('@/services/meal-plan.service').then(m => m.mealPlanService.regenerateMealPlan());
                                if (res.success) {
                                    toast.success('Đã tạo lộ trình thành công!', { id: toastId });
                                    window.location.href = '/dashboard/schedule';
                                } else {
                                    toast.error('Có lỗi khi tạo lộ trình: ' + res.message, { id: toastId });
                                    // Still redirect or stay? Let's stay so they can try again or go to dashboard manually.
                                    // User said "call... + redirect". If fails, maybe we shouldn't redirect blindly.
                                    // But to be safe, if fail, we might want to let them go to dashboard anyway.
                                    // For now, let's stop on error.
                                }
                            } catch (e) {
                                toast.error('Lỗi kết nối.', { id: toastId });
                            }
                        }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        Kích hoạt lộ trình chi tiết
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>

                {/* Secondary Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 text-slate-500 text-sm"
                >
                    Hoặc{' '}
                    <Link href="/dashboard" className="text-emerald-600 hover:underline font-medium">
                        quay về Dashboard
                    </Link>
                </motion.p>
            </div>
        </div>
    );
}

// ============================================================
// MAIN PAGE WITH SUSPENSE
// ============================================================

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-emerald-50">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}
