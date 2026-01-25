/**
 * Payment Success Page
 * 
 * Displays success message with confetti animation after payment.
 * Features "Kích hoạt lộ trình chi tiết" button to dashboard.
 * 
 * Route: /payment/success?transactionId={id}
 */

'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { paymentService } from '@/services/payment.service';

// ============================================================
// CONFETTI CANVAS COMPONENT
// ============================================================

interface ConfettiParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
}

const CONFETTI_COLORS = [
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#F59E0B', // amber-500
    '#EC4899', // pink-500
    '#8B5CF6', // violet-500
    '#EF4444', // red-500
];

function ConfettiCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        const particles: ConfettiParticle[] = [];
        const particleCount = 150;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 8 + 4,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
            });
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Add gravity
                p.vy += 0.1;

                // Draw particle
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
                ctx.restore();

                // Reset if off screen
                if (p.y > canvas.height + 50) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                    p.vy = Math.random() * 3 + 2;
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Stop after 5 seconds
        const stopTimeout = setTimeout(() => {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 5000);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
            clearTimeout(stopTimeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
}

// ============================================================
// SUCCESS CONTENT COMPONENT
// ============================================================

function SuccessContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId') || 'N/A';

    // Optionally verify transaction status
    useEffect(() => {
        if (transactionId && transactionId !== 'N/A') {
            paymentService.checkTransactionStatus(transactionId).then((result) => {
                console.log('Transaction verified:', result);
            });
        }
    }, [transactionId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
            {/* Confetti */}
            <ConfettiCanvas />

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
                    <Link
                        href="/dashboard/plan-overview"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        Kích hoạt lộ trình chi tiết
                        <ArrowRight className="w-5 h-5" />
                    </Link>
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
