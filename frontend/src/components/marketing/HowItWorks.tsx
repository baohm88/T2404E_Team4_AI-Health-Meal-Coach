/**
 * How It Works Component
 * 
 * Displays 3-step process timeline for onboarding users
 */

'use client';

import { ClipboardCheck, Brain, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const STEPS = [
    {
        number: 1,
        icon: ClipboardCheck,
        title: 'Làm bài test sức khỏe',
        description: 'Trả lời các câu hỏi về thói quen ăn uống, mục tiêu và lối sống của bạn',
    },
    {
        number: 2,
        icon: Brain,
        title: 'Nhận lộ trình AI',
        description: 'AI phân tích dữ liệu và tạo kế hoạch dinh dưỡng cá nhân hóa cho bạn',
    },
    {
        number: 3,
        icon: TrendingUp,
        title: 'Theo dõi & Cải thiện',
        description: 'Ghi nhận tiến độ hàng ngày và nhận gợi ý điều chỉnh từ AI',
    },
];

export function HowItWorks() {
    return (
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Cách hoạt động
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Chỉ 3 bước đơn giản để bắt đầu hành trình sức khỏe của bạn
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.number}
                                className="relative"
                            >
                                {/* Connector Line (Desktop only) */}
                                {index < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-emerald-200 to-transparent z-0" />
                                )}

                                {/* Step Card */}
                                <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 z-10">
                                    {/* Step Number Badge */}
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg mb-6">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Link href="/onboarding">
                        <Button
                            variant="primary"
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 from-emerald-600 to-emerald-600 shadow-lg shadow-emerald-600/30"
                        >
                            Tạo lộ trình miễn phí
                        </Button>
                    </Link>
                    <p className="text-sm text-slate-500 mt-4">
                        Không cần thẻ tín dụng • Hoàn toàn miễn phí
                    </p>
                </div>
            </div>
        </section>
    );
}
