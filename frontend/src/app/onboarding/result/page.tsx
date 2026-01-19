/**
 * Public Result Page (Guest First Flow)
 *
 * Shows onboarding results WITHOUT requiring login.
 * Calculates BMI/BMR client-side from localStorage data.
 *
 * Flow: Onboarding → This Page → Register → Dashboard
 *
 * @route /onboarding/result
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Loader2,
    Heart,
    Flame,
    Activity,
    Brain,
    Target,
    Calendar,
    UserPlus,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Gender, ActivityLevel, StressLevel } from '@/lib/schemas/onboarding.schema';

// ============================================================
// TYPES
// ============================================================

interface HealthStats {
    bmi: number;
    bmiCategory: string;
    bmiColor: string;
    bmr: number;
    tdee: number;
    dailyTarget: number;
}

interface RoadmapPhase {
    month: number;
    title: string;
    subtitle: string;
    description: string;
    targetCalories: number;
    icon: string;
}

// ============================================================
// CALCULATIONS
// ============================================================

function calculateBMI(weight: number, height: number): number {
    const heightM = height / 100;
    return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

function getBMICategory(bmi: number): { category: string; color: string } {
    if (bmi < 18.5) return { category: 'Thiếu cân', color: 'text-blue-600' };
    if (bmi < 23) return { category: 'Bình thường', color: 'text-emerald-600' };
    if (bmi < 25) return { category: 'Thừa cân nhẹ', color: 'text-amber-600' };
    if (bmi < 30) return { category: 'Thừa cân', color: 'text-orange-600' };
    return { category: 'Béo phì', color: 'text-red-600' };
}

function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
    // Mifflin-St Jeor Equation
    if (gender === Gender.MALE) {
        return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multipliers = {
        [ActivityLevel.SEDENTARY]: 1.2,
        [ActivityLevel.LIGHT]: 1.375,
        [ActivityLevel.MODERATE]: 1.55,
        [ActivityLevel.VERY_ACTIVE]: 1.725,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

function generateRoadmap(tdee: number, stressLevel: StressLevel): RoadmapPhase[] {
    // Adjust deficit based on stress
    const deficit = stressLevel === StressLevel.VERY_HIGH || stressLevel === StressLevel.HIGH
        ? 300 // Gentler for high stress
        : 450; // More aggressive for low stress

    return [
        {
            month: 1,
            title: 'Tháng 1',
            subtitle: 'Thích nghi',
            description: 'Làm quen với chế độ ăn mới, ổn định năng lượng',
            targetCalories: tdee - Math.round(deficit * 0.6),
            icon: '🌱',
        },
        {
            month: 2,
            title: 'Tháng 2',
            subtitle: 'Tăng tốc',
            description: 'Đẩy mạnh giảm mỡ, tăng cường vận động',
            targetCalories: tdee - deficit,
            icon: '🔥',
        },
        {
            month: 3,
            title: 'Tháng 3',
            subtitle: 'Duy trì',
            description: 'Xây dựng thói quen bền vững, củng cố kết quả',
            targetCalories: tdee - Math.round(deficit * 0.8),
            icon: '💪',
        },
    ];
}

// ============================================================
// LOADING STATE
// ============================================================

const ANALYZING_TEXTS = [
    'Đang tính toán BMI...',
    'Đang phân tích lối sống...',
    'Đang thiết kế lộ trình...',
    'Hoàn tất!',
];

function AnalyzingState({ currentTextIndex }: { currentTextIndex: number }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
            >
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center"
                    >
                        <Brain className="w-12 h-12 text-white" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border-4 border-emerald-200 border-t-emerald-500 rounded-full"
                    />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Đang phân tích
                </h1>
                <p className="text-slate-500 mb-8">
                    Vui lòng đợi trong giây lát...
                </p>

                <div className="h-8">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentTextIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-emerald-600 font-medium flex items-center justify-center gap-2"
                        >
                            {currentTextIndex < ANALYZING_TEXTS.length - 1 ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            {ANALYZING_TEXTS[currentTextIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    {ANALYZING_TEXTS.map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                'w-2 h-2 rounded-full transition-all',
                                i <= currentTextIndex ? 'bg-emerald-500' : 'bg-slate-200'
                            )}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

// ============================================================
// STATS CARD
// ============================================================

function StatCard({
    icon: Icon,
    label,
    value,
    unit,
    subtext,
    color,
}: {
    icon: typeof Heart;
    label: string;
    value: string | number;
    unit?: string;
    subtext?: string;
    color: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
        >
            <div className="flex items-center gap-2 mb-2">
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-slate-500">{label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
                {value}
                {unit && <span className="text-sm font-normal text-slate-400"> {unit}</span>}
            </div>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </motion.div>
    );
}

// ============================================================
// ROADMAP TIMELINE
// ============================================================

function RoadmapTimeline({ phases }: { phases: RoadmapPhase[] }) {
    return (
        <div className="space-y-3">
            {phases.map((phase, index) => (
                <motion.div
                    key={phase.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={clsx(
                        'relative pl-12 py-4 pr-4 rounded-xl border',
                        index === 0
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-slate-50 border-slate-100'
                    )}
                >
                    <div
                        className={clsx(
                            'absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-lg',
                            index === 0 ? 'bg-emerald-500' : 'bg-slate-300'
                        )}
                    >
                        {phase.icon}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className={clsx(
                                        'font-bold',
                                        index === 0 ? 'text-emerald-700' : 'text-slate-600'
                                    )}
                                >
                                    {phase.title}:
                                </span>
                                <span
                                    className={clsx(
                                        'text-sm font-medium',
                                        index === 0 ? 'text-emerald-600' : 'text-slate-500'
                                    )}
                                >
                                    {phase.subtitle}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">{phase.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-sm font-semibold text-slate-700">
                                {phase.targetCalories} kcal
                            </div>
                            <div className="text-xs text-slate-400">mỗi ngày</div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// ============================================================
// RESULT CONTENT
// ============================================================

function ResultContent({
    healthStats,
    roadmap,
}: {
    healthStats: HealthStats;
    roadmap: RoadmapPhase[];
}) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pb-28">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-8 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        Kết quả phân tích
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold mb-2"
                    >
                        Lộ trình dành riêng cho bạn!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-emerald-100"
                    >
                        Đăng ký để lưu lộ trình và theo dõi tiến độ
                    </motion.p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-6">
                {/* Health Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <StatCard
                        icon={Heart}
                        label="BMI"
                        value={healthStats.bmi}
                        subtext={healthStats.bmiCategory}
                        color="bg-pink-500"
                    />
                    <StatCard
                        icon={Flame}
                        label="TDEE"
                        value={healthStats.tdee}
                        unit="kcal"
                        subtext="Năng lượng/ngày"
                        color="bg-orange-500"
                    />
                    <StatCard
                        icon={Activity}
                        label="BMR"
                        value={healthStats.bmr}
                        unit="kcal"
                        subtext="Trao đổi chất cơ bản"
                        color="bg-violet-500"
                    />
                    <StatCard
                        icon={Target}
                        label="Mục tiêu"
                        value={healthStats.dailyTarget}
                        unit="kcal"
                        subtext="Khuyến nghị/ngày"
                        color="bg-emerald-500"
                    />
                </div>

                {/* Roadmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <h2 className="font-semibold text-slate-800">Lộ trình 3 tháng</h2>
                    </div>
                    <RoadmapTimeline phases={roadmap} />
                </motion.div>

                {/* Call to Action Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 text-center"
                >
                    <UserPlus className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-1">
                        Đăng ký để lưu kết quả này
                    </h3>
                    <p className="text-sm text-slate-500">
                        Tạo tài khoản miễn phí để lưu lộ trình, theo dõi tiến độ và nhận gợi ý hàng ngày từ AI.
                    </p>
                </motion.div>
            </div>

            {/* CTA Button - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
                <div className="max-w-2xl mx-auto">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => router.push('/register?from=onboarding')}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                    >
                        <UserPlus className="w-5 h-5" />
                        Đăng ký để lưu lộ trình
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function OnboardingResultPage() {
    const router = useRouter();
    const { formData, isComplete } = useOnboardingStore();

    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    // Calculate health stats from form data
    const healthStats = useMemo<HealthStats | null>(() => {
        if (!formData.weight || !formData.height || !formData.age || !formData.gender || !formData.activityLevel) {
            return null;
        }

        const bmi = calculateBMI(formData.weight, formData.height);
        const { category, color } = getBMICategory(bmi);
        const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.gender);
        const tdee = calculateTDEE(bmr, formData.activityLevel);
        const dailyTarget = tdee - 400; // Default calorie deficit

        return {
            bmi,
            bmiCategory: category,
            bmiColor: color,
            bmr,
            tdee,
            dailyTarget,
        };
    }, [formData]);

    // Generate roadmap
    const roadmap = useMemo<RoadmapPhase[]>(() => {
        if (!healthStats || !formData.stressLevel) return [];
        return generateRoadmap(healthStats.tdee, formData.stressLevel);
    }, [healthStats, formData.stressLevel]);

    // Check if data is complete
    useEffect(() => {
        if (!isComplete()) {
            // No data, redirect back to onboarding
            router.replace('/onboarding');
        }
    }, [isComplete, router]);

    // Animate through analyzing texts
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => {
                if (prev >= ANALYZING_TEXTS.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setIsAnalyzing(false), 500);
                    return prev;
                }
                return prev + 1;
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    if (isAnalyzing) {
        return <AnalyzingState currentTextIndex={currentTextIndex} />;
    }

    if (!healthStats) {
        return null;
    }

    return <ResultContent healthStats={healthStats} roadmap={roadmap} />;
}
