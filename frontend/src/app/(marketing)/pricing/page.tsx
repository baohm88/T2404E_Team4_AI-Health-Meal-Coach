/**
 * Pricing Page
 * 
 * Displays 3 subscription plans (1 month, 6 months, 1 year)
 * with "Phổ biến" badge on the 6-month plan.
 * 
 * Route: /pricing (within marketing layout)
 */

'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// ============================================================
// CONSTANTS
// ============================================================

interface PricingPlan {
    id: string;
    name: string;
    duration: string;
    price: number;
    pricePerMonth: number;
    discount?: number;
    badge?: string;
    popular?: boolean;
    icon: React.ReactNode;
    features: string[];
    color: string;
    bgGradient: string;
}

const PRICING_PLANS: PricingPlan[] = [
    {
        id: '1-month',
        name: 'Gói 1 tháng',
        duration: '1 tháng',
        price: 199000,
        pricePerMonth: 199000,
        icon: <Star className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        bgGradient: 'from-blue-50 to-blue-100',
        features: [
            'Thực đơn chi tiết từng ngày',
            'Công thức nấu ăn đầy đủ',
            'AI Coach hỗ trợ 24/7',
            'Báo cáo dinh dưỡng nâng cao',
            'Nhắc nhở thông minh',
        ],
    },
    {
        id: '6-months',
        name: 'Gói 6 tháng',
        duration: '6 tháng',
        price: 899000,
        pricePerMonth: Math.round(899000 / 6),
        discount: 25,
        badge: 'Phổ biến',
        popular: true,
        icon: <Crown className="w-6 h-6" />,
        color: 'from-emerald-500 to-emerald-600',
        bgGradient: 'from-emerald-50 to-emerald-100',
        features: [
            'Tất cả tính năng gói 1 tháng',
            'Lịch tập gym cá nhân hóa',
            'Meal prep hàng tuần',
            'Ưu tiên hỗ trợ nhanh',
            'Báo cáo tiến độ chi tiết',
            'Tiết kiệm 25%',
        ],
    },
    {
        id: '12-months',
        name: 'Gói 1 năm',
        duration: '12 tháng',
        price: 1499000,
        pricePerMonth: Math.round(1499000 / 12),
        discount: 37,
        badge: 'Tiết kiệm nhất',
        icon: <Zap className="w-6 h-6" />,
        color: 'from-purple-500 to-purple-600',
        bgGradient: 'from-purple-50 to-purple-100',
        features: [
            'Tất cả tính năng gói 6 tháng',
            'Tư vấn 1-1 với chuyên gia dinh dưỡng',
            'Phân tích DNA (sắp ra mắt)',
            'Ưu đãi đặc biệt từ đối tác',
            'Truy cập sớm tính năng mới',
            'Tiết kiệm 37%',
        ],
    },
];

// ============================================================
// FORMAT HELPERS
// ============================================================

const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫';
};

// ============================================================
// PRICING CARD COMPONENT
// ============================================================

interface PricingCardProps {
    plan: PricingPlan;
    index: number;
}

const PricingCard = ({ plan, index }: PricingCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${isHovered
                    ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20 scale-105 z-10'
                    : 'border border-slate-200 shadow-lg'
                }`}
        >
            {/* Popular Badge */}
            {plan.badge && (
                <div
                    className={`absolute top-0 right-0 px-4 py-2 rounded-bl-xl text-sm font-bold text-white bg-gradient-to-r ${plan.color}`}
                >
                    {plan.badge}
                </div>
            )}

            {/* Card Content */}
            <div className="bg-white p-8 flex flex-col h-full">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${plan.bgGradient} text-${plan.color.split('-')[1]}-600`}
                    >
                        {plan.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="text-sm text-slate-500">{plan.duration}</p>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">
                            {formatPrice(plan.price)}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        ~{formatPrice(plan.pricePerMonth)}/tháng
                    </p>
                    {plan.discount && (
                        <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                            Tiết kiệm {plan.discount}%
                        </span>
                    )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-600 text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <Link
                    href={`/checkout?plan=${plan.id}`}
                    className={`block w-full py-4 px-6 text-center rounded-xl font-bold text-lg transition-all duration-300 mt-auto ${plan.popular
                        ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]`
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]'
                        }`}
                >
                    <motion.span
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                    >
                        Chọn gói này
                    </motion.span>
                </Link>
            </div>
        </motion.div>
    );
};

// ============================================================
// MAIN PAGE
// ============================================================

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                        💎 Nâng cấp Premium
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
                        Chọn gói phù hợp với bạn
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Mở khóa toàn bộ tính năng và nhận lộ trình chi tiết được cá nhân hóa
                        cho hành trình sức khỏe của bạn.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8">
                    {PRICING_PLANS.map((plan, index) => (
                        <PricingCard key={plan.id} plan={plan} index={index} />
                    ))}
                </div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <p className="text-slate-500 text-sm mb-4">Thanh toán an toàn qua</p>
                    <div className="flex justify-center items-center gap-6">
                        <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="font-bold text-blue-600">VNPay</span>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="font-bold text-red-600">Momo</span>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="font-bold text-slate-700">Bank Transfer</span>
                        </div>
                    </div>
                    <p className="mt-6 text-slate-400 text-xs">
                        🔒 Bảo mật SSL 256-bit • Hoàn tiền trong 7 ngày
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
