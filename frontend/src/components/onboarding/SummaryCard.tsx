/**
 * SummaryCard Component (Analysis Step)
 *
 * Final step displaying health metrics dashboard:
 * - BMI with circular indicator and category
 * - BMR and TDEE values
 * - Energy Score with progress bar
 * - Daily calorie goal
 * - Summary of user selections
 *
 * @see /lib/calculator.ts - Health calculations
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Flame, Battery, Scale, Activity } from 'lucide-react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import {
    calculateHealthMetrics,
    getBMICategoryLabel,
    getBMICategoryColor,
    getEnergyLevelLabel,
    getEnergyScoreColor,
} from '@/lib/calculator';
import {
    getGoalLabel,
    getActivityLabel,
    getGenderLabel,
} from '@/lib/constants/onboarding.constants';
import { Goal, ActivityLevel, Gender } from '@/lib/schemas/onboarding.schema';

// ============================================================
// CONSTANTS
// ============================================================

const PROCESSING_DELAY_MS = 1000;

// ============================================================
// COMPONENT
// ============================================================

export function SummaryCard() {
    const { formData, prevStep } = useOnboardingStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Calculate health metrics
    const metrics = useMemo(() => calculateHealthMetrics(formData), [formData]);

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        // Simulate brief processing
        await new Promise((resolve) => setTimeout(resolve, PROCESSING_DELAY_MS));
        // Redirect to register page to save results
        router.push('/register');
    }, [router]);

    return (
        <div className="flex flex-col h-full">
            {/* Success Message */}
            <SuccessMessage />

            {/* Health Metrics Dashboard */}
            {metrics ? (
                <div className="space-y-4">
                    {/* Top Row: BMI + Energy Score */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* BMI Card */}
                        <BMICard
                            bmi={metrics.bmi}
                            category={metrics.bmiCategory}
                        />

                        {/* Energy Score Card */}
                        <EnergyScoreCard score={metrics.energyScore} />
                    </div>

                    {/* Calorie Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard
                            icon={<Flame className="w-4 h-4 text-orange-500" />}
                            label="TDEE"
                            value={`${metrics.tdee.toLocaleString()}`}
                            unit="kcal/ngày"
                            sublabel="Năng lượng tiêu hao"
                        />
                        <MetricCard
                            icon={<Activity className="w-4 h-4 text-blue-500" />}
                            label="Mục tiêu"
                            value={`${metrics.dailyCalorieGoal.toLocaleString()}`}
                            unit="kcal/ngày"
                            sublabel={getCalorieGoalDescription(formData.goal)}
                        />
                    </div>

                    {/* User Info Summary */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <SummaryItem label="Mục tiêu" value={getGoalLabel(formData.goal as Goal)} />
                            <SummaryItem label="Giới tính" value={getGenderLabel(formData.gender as Gender)} />
                            <SummaryItem label="Tuổi" value={formData.age ? `${formData.age} tuổi` : '-'} />
                            <SummaryItem label="Hoạt động" value={getActivityLabel(formData.activityLevel as ActivityLevel)} />
                            {metrics.weeksToGoal && (
                                <SummaryItem
                                    label="Thời gian dự kiến"
                                    value={`~${metrics.weeksToGoal} tuần`}
                                    className="col-span-2"
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // Fallback if metrics can't be calculated
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                    Thiếu thông tin để tính toán. Vui lòng quay lại điền đầy đủ.
                </div>
            )}

            {/* Navigation */}
            <div className="mt-auto pt-4 flex items-center justify-between">
                <button
                    onClick={prevStep}
                    className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
                >
                    ← Quay lại
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !metrics}
                    className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            Đang xử lý...
                        </>
                    ) : (
                        'Hoàn tất & Đăng ký'
                    )}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const SuccessMessage = () => (
    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center gap-2 text-green-700 text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">
                Hoàn tất! Xem kết quả phân tích dưới đây.
            </span>
        </div>
    </div>
);

interface BMICardProps {
    bmi: number;
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
}

const BMICard = ({ bmi, category }: BMICardProps) => {
    const color = getBMICategoryColor(category);
    const label = getBMICategoryLabel(category);

    // Calculate circumference for circular progress
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    // BMI typically ranges from 15-40, normalize to 0-100
    const normalizedBMI = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));
    const strokeDashoffset = circumference - (normalizedBMI / 100) * circumference;

    return (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <svg width="72" height="72" className="-rotate-90">
                        <circle
                            cx="36"
                            cy="36"
                            r={radius}
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="6"
                        />
                        <circle
                            cx="36"
                            cy="36"
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-800">{bmi}</span>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        BMI
                    </div>
                    <div
                        className="text-sm font-semibold"
                        style={{ color }}
                    >
                        {label}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface EnergyScoreCardProps {
    score: number;
}

const EnergyScoreCard = ({ score }: EnergyScoreCardProps) => {
    const color = getEnergyScoreColor(score);
    const label = getEnergyLevelLabel(score);

    return (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Battery className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">Energy Score</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold" style={{ color }}>{score}</span>
                <span className="text-xs text-slate-400">/100</span>
            </div>
            <div className="mt-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${score}%`,
                            backgroundColor: color,
                        }}
                    />
                </div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
        </div>
    );
};

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    unit: string;
    sublabel: string;
}

const MetricCard = ({ icon, label, value, unit, sublabel }: MetricCardProps) => (
    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1">
            {icon}
            <span className="text-xs text-slate-500">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">{value}</span>
            <span className="text-xs text-slate-400">{unit}</span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{sublabel}</div>
    </div>
);

interface SummaryItemProps {
    label: string;
    value: string;
    className?: string;
}

const SummaryItem = ({ label, value, className }: SummaryItemProps) => (
    <div className={className}>
        <span className="text-slate-500">{label}: </span>
        <span className="font-medium text-slate-700">{value}</span>
    </div>
);

// ============================================================
// HELPERS
// ============================================================

const getCalorieGoalDescription = (goal: Goal | undefined): string => {
    switch (goal) {
        case Goal.WEIGHT_LOSS:
            return 'Thâm hụt để giảm cân';
        case Goal.MUSCLE_GAIN:
            return 'Thặng dư để tăng cân';
        default:
            return 'Duy trì cân nặng';
    }
};
