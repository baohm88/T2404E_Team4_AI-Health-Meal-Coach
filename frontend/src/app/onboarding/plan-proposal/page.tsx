/**
 * AI Plan Proposal Page
 *
 * "Chốt sales" page showing AI analysis results after onboarding.
 * 
 * States:
 * - State A: AI Analyzing (Loading with animated text)
 * - State B: Proposal Result (Health stats + AI Analysis + Roadmap)
 *
 * @route /onboarding/plan-proposal
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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
    TrendingDown,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';

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
    bodyAge: number;
    realAge: number;
}

interface RoadmapPhase {
    month: number;
    title: string;
    subtitle: string;
    description: string;
    targetCalories: number;
    focus: string;
    icon: string;
}

interface AIProposal {
    userName: string;
    healthStats: HealthStats;
    aiAnalysis: string;
    recommendedGoal: string;
    roadmap: RoadmapPhase[];
}

// ============================================================
// MOCK DATA SERVICE
// ============================================================

const ANALYZING_TEXTS = [
    'Đang tính toán BMI...',
    'Đang phân tích chỉ số Stress...',
    'Đang đánh giá mức năng lượng...',
    'Đang thiết kế thực đơn cá nhân...',
    'Đang tối ưu lộ trình 3 tháng...',
    'Hoàn tất phân tích!',
];

function generateMockProposal(): AIProposal {
    return {
        userName: 'bạn',
        healthStats: {
            bmi: 24.5,
            bmiCategory: 'Thừa cân nhẹ',
            bmiColor: 'text-amber-600',
            bmr: 1650,
            tdee: 2270,
            dailyTarget: 1820,
            bodyAge: 28,
            realAge: 25,
        },
        aiAnalysis: `Dù BMI của bạn ở mức bình thường (24.5), nhưng chỉ số **Stress cao** đang cản trở quá trình trao đổi chất. 

Lộ trình này sẽ ưu tiên **phục hồi năng lượng** trong tháng đầu trước khi đẩy mạnh đốt mỡ. Điều này giúp bạn giảm cân bền vững mà không bị kiệt sức.`,
        recommendedGoal: 'Giảm cân bền vững',
        roadmap: [
            {
                month: 1,
                title: 'Tháng 1',
                subtitle: 'Phục hồi',
                description: 'Cân bằng năng lượng, giảm stress, làm quen chế độ mới',
                targetCalories: 1900,
                focus: 'Giảm 1-2kg, ổn định giấc ngủ',
                icon: '🌱',
            },
            {
                month: 2,
                title: 'Tháng 2',
                subtitle: 'Đốt mỡ',
                description: 'Tăng cường Cardio, thâm hụt calo sâu hơn',
                targetCalories: 1750,
                focus: 'Giảm 2-3kg, tăng sức bền',
                icon: '🔥',
            },
            {
                month: 3,
                title: 'Tháng 3',
                subtitle: 'Siết cơ',
                description: 'Duy trì cân nặng mới, xây dựng thói quen lâu dài',
                targetCalories: 1800,
                focus: 'Duy trì, định hình cơ thể',
                icon: '💪',
            },
        ],
    };
}

// ============================================================
// COMPONENTS
// ============================================================

/** Loading State with animated text */
function AnalyzingState({ currentTextIndex }: { currentTextIndex: number }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
            >
                {/* Animated Brain Icon */}
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
                    AI đang phân tích
                </h1>
                <p className="text-slate-500 mb-8">
                    Vui lòng đợi trong giây lát...
                </p>

                {/* Animated Text */}
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

                {/* Progress dots */}
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

/** Stats Card */
function StatCard({
    icon: Icon,
    label,
    value,
    unit,
    subtext,
    color
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
            {subtext && (
                <p className="text-xs text-slate-400 mt-1">{subtext}</p>
            )}
        </motion.div>
    );
}

/** Roadmap Timeline */
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
                    {/* Icon */}
                    <div className={clsx(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-lg',
                        index === 0 ? 'bg-emerald-500' : 'bg-slate-300'
                    )}>
                        {phase.icon}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={clsx(
                                    'font-bold',
                                    index === 0 ? 'text-emerald-700' : 'text-slate-600'
                                )}>
                                    {phase.title}:
                                </span>
                                <span className={clsx(
                                    'text-sm font-medium',
                                    index === 0 ? 'text-emerald-600' : 'text-slate-500'
                                )}>
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

/** Main Proposal Content */
function ProposalResult({ proposal }: { proposal: AIProposal }) {
    const router = useRouter();

    const handleStartJourney = useCallback(() => {
        // Set flag in localStorage to mark onboarding complete
        localStorage.setItem('onboarding_complete', 'true');
        router.push('/dashboard');
    }, [router]);

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
                        Phân tích hoàn tất
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold mb-2"
                    >
                        Kế hoạch dành riêng cho {proposal.userName}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-emerald-100"
                    >
                        Dựa trên thông tin bạn cung cấp, AI đã thiết kế lộ trình tối ưu
                    </motion.p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-6">
                {/* Health Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <StatCard
                        icon={Heart}
                        label="BMI"
                        value={proposal.healthStats.bmi}
                        subtext={proposal.healthStats.bmiCategory}
                        color="bg-pink-500"
                    />
                    <StatCard
                        icon={Flame}
                        label="TDEE"
                        value={proposal.healthStats.tdee}
                        unit="kcal"
                        subtext="Năng lượng/ngày"
                        color="bg-orange-500"
                    />
                    <StatCard
                        icon={TrendingDown}
                        label="Mục tiêu"
                        value={proposal.healthStats.dailyTarget}
                        unit="kcal"
                        subtext="Calo khuyến nghị"
                        color="bg-emerald-500"
                    />
                    <StatCard
                        icon={Activity}
                        label="Tuổi cơ thể"
                        value={proposal.healthStats.bodyAge}
                        unit="tuổi"
                        subtext={`Tuổi thật: ${proposal.healthStats.realAge}`}
                        color="bg-violet-500"
                    />
                </div>

                {/* AI Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="font-semibold text-slate-800">Nhận xét từ AI Coach</h2>
                    </div>
                    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {proposal.aiAnalysis}
                    </div>
                </motion.div>

                {/* Recommended Goal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white mb-6"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5" />
                        <span className="text-sm opacity-90">Mục tiêu đề xuất</span>
                    </div>
                    <h3 className="text-xl font-bold">{proposal.recommendedGoal}</h3>
                </motion.div>

                {/* Roadmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <h2 className="font-semibold text-slate-800">Lộ trình 3 tháng</h2>
                    </div>
                    <RoadmapTimeline phases={proposal.roadmap} />
                </motion.div>
            </div>

            {/* CTA Button - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
                <div className="max-w-2xl mx-auto">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleStartJourney}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                    >
                        Bắt đầu hành trình ngay
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

export default function PlanProposalPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [proposal, setProposal] = useState<AIProposal | null>(null);

    useEffect(() => {
        // Animate through analyzing texts
        const textInterval = setInterval(() => {
            setCurrentTextIndex((prev) => {
                if (prev >= ANALYZING_TEXTS.length - 1) {
                    clearInterval(textInterval);
                    // Show result after last text
                    setTimeout(() => {
                        setProposal(generateMockProposal());
                        setIsAnalyzing(false);
                    }, 500);
                    return prev;
                }
                return prev + 1;
            });
        }, 600);

        return () => clearInterval(textInterval);
    }, []);

    if (isAnalyzing) {
        return <AnalyzingState currentTextIndex={currentTextIndex} />;
    }

    if (proposal) {
        return <ProposalResult proposal={proposal} />;
    }

    return null;
}
