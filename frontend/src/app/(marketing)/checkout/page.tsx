/**
 * Checkout Page (Mock)
 * 
 * Displays order summary and VNPay payment button.
 * Reads plan from URL query params and redirects to success page.
 * 
 * Route: /checkout?plan={planId}
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { paymentService } from '@/services/payment.service';

// ============================================================
// CONSTANTS
// ============================================================

interface PlanDetails {
    id: string;
    name: string;
    duration: string;
    price: number;
}

const PLAN_DETAILS: Record<string, PlanDetails> = {
    '1-month': {
        id: '1-month',
        name: 'Gói Premium 1 tháng',
        duration: '1 tháng',
        price: 199000,
    },
    '6-months': {
        id: '6-months',
        name: 'Gói Premium 6 tháng',
        duration: '6 tháng',
        price: 899000,
    },
    '12-months': {
        id: '12-months',
        name: 'Gói Premium 1 năm',
        duration: '12 tháng',
        price: 1499000,
    },
};

// ============================================================
// FORMAT HELPERS
// ============================================================

const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫';
};

// ============================================================
// CHECKOUT CONTENT COMPONENT
// ============================================================

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams.get('plan') || '6-months';
    const plan = PLAN_DETAILS[planId] || PLAN_DETAILS['6-months'];

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const result = await paymentService.createPaymentUrl(plan.price);

            if (result.success && result.url) {
                // Redirect to success page (mock VNPay redirect)
                router.push(result.url);
            } else {
                setError('Không thể tạo link thanh toán. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Back Button */}
                <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại trang giá
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                        Xác nhận đơn hàng
                    </h1>
                    <p className="text-slate-600">
                        Kiểm tra thông tin trước khi thanh toán
                    </p>
                </motion.div>

                {/* Order Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-6"
                >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Tóm tắt đơn hàng
                        </h2>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-6">
                        {/* Product */}
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500">Thời hạn: {plan.duration}</p>
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                {formatPrice(plan.price)}
                            </span>
                        </div>

                        {/* Features included */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">Bao gồm:</p>
                            <ul className="space-y-2">
                                {[
                                    'Thực đơn chi tiết từng ngày',
                                    'Công thức nấu ăn đầy đủ',
                                    'AI Coach hỗ trợ 24/7',
                                    'Báo cáo dinh dưỡng nâng cao',
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                            <span className="text-lg font-bold text-slate-900">Tổng thanh toán</span>
                            <span className="text-2xl font-extrabold text-emerald-600">
                                {formatPrice(plan.price)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Payment Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Thanh toán qua VNPay
                        </>
                    )}
                </motion.button>

                {/* Security Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Giao dịch được bảo mật bởi VNPay</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                        Hoàn tiền 100% trong vòng 7 ngày nếu không hài lòng
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN PAGE WITH SUSPENSE
// ============================================================

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
