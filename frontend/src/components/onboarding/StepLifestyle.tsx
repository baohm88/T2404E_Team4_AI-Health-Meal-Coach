/**
 * StepLifestyle Component
 *
 * Merged lifestyle step containing:
 * - Activity Level selection
 * - Sleep Range selection with Lucide icons
 * - Stress Level selection with Lucide icons
 *
 * Used for TDEE and Energy Score calculations.
 */

'use client';

import React from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { ActivityLevel, SleepRange, StressLevel } from '@/lib/schemas/onboarding.schema';
import {
    ACTIVITY_LABELS,
    ACTIVITY_DESCRIPTIONS,
    SLEEP_LABELS,
    STRESS_LABELS,
} from '@/lib/constants/onboarding.constants';
import clsx from 'clsx';
import {
    Activity,
    Moon,
    Brain,
    BatteryLow,
    BatteryMedium,
    BatteryFull,
    CloudMoon,
    Smile,
    Zap,
    Flame,
    type LucideIcon,
} from 'lucide-react';

// ============================================================
// CONSTANTS
// ============================================================

const ACTIVITY_OPTIONS = [
    { id: ActivityLevel.SEDENTARY, label: ACTIVITY_LABELS[ActivityLevel.SEDENTARY], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.SEDENTARY] },
    { id: ActivityLevel.LIGHT, label: ACTIVITY_LABELS[ActivityLevel.LIGHT], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.LIGHT] },
    { id: ActivityLevel.MODERATE, label: ACTIVITY_LABELS[ActivityLevel.MODERATE], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.MODERATE] },
    { id: ActivityLevel.VERY_ACTIVE, label: ACTIVITY_LABELS[ActivityLevel.VERY_ACTIVE], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.VERY_ACTIVE] },
];

interface IconOption<T> {
    id: T;
    label: string;
    Icon: LucideIcon;
}

const SLEEP_OPTIONS: IconOption<SleepRange>[] = [
    { id: SleepRange.LESS_THAN_5, label: SLEEP_LABELS[SleepRange.LESS_THAN_5], Icon: BatteryLow },
    { id: SleepRange.FIVE_TO_7, label: SLEEP_LABELS[SleepRange.FIVE_TO_7], Icon: BatteryMedium },
    { id: SleepRange.SEVEN_TO_9, label: SLEEP_LABELS[SleepRange.SEVEN_TO_9], Icon: BatteryFull },
    { id: SleepRange.MORE_THAN_9, label: SLEEP_LABELS[SleepRange.MORE_THAN_9], Icon: CloudMoon },
];

const STRESS_OPTIONS: IconOption<StressLevel>[] = [
    { id: StressLevel.LOW, label: STRESS_LABELS[StressLevel.LOW], Icon: Smile },
    { id: StressLevel.MEDIUM, label: STRESS_LABELS[StressLevel.MEDIUM], Icon: Activity },
    { id: StressLevel.HIGH, label: STRESS_LABELS[StressLevel.HIGH], Icon: Zap },
    { id: StressLevel.VERY_HIGH, label: STRESS_LABELS[StressLevel.VERY_HIGH], Icon: Flame },
];

// ============================================================
// COMPONENT
// ============================================================

export function StepLifestyle() {
    const { formData, setFormData, nextStep, skipStep } = useOnboardingStore();

    const isValid = formData.activityLevel && formData.sleepRange && formData.stressLevel;

    return (
        <div className="flex flex-col h-full">
            {/* Activity Level Section */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-medium">Mức độ hoạt động</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {ACTIVITY_OPTIONS.map((item) => {
                        const isSelected = formData.activityLevel === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setFormData({ activityLevel: item.id })}
                                className={clsx(
                                    'p-3 rounded-xl border-2 transition-all text-left',
                                    isSelected
                                        ? 'border-primary ring-2 ring-primary ring-inset bg-primary/5'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
                                )}
                            >
                                <div className={clsx(
                                    'text-sm font-semibold',
                                    isSelected ? 'text-primary' : 'text-slate-700'
                                )}>
                                    {item.label}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sleep Range Section */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-medium">Giờ ngủ trung bình/ngày</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {SLEEP_OPTIONS.map((item) => {
                        const isSelected = formData.sleepRange === item.id;
                        const IconComponent = item.Icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setFormData({ sleepRange: item.id })}
                                className={clsx(
                                    'p-3 rounded-xl border-2 transition-all text-center',
                                    isSelected
                                        ? 'border-primary ring-2 ring-primary ring-inset bg-primary/5'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
                                )}
                            >
                                <IconComponent
                                    className={clsx(
                                        'w-6 h-6 mx-auto mb-1',
                                        isSelected ? 'text-primary' : 'text-slate-400'
                                    )}
                                    strokeWidth={1.5}
                                />
                                <div className={clsx(
                                    'text-xs font-medium',
                                    isSelected ? 'text-primary' : 'text-slate-600'
                                )}>
                                    {item.label}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stress Level Section */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-medium">Mức độ stress</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {STRESS_OPTIONS.map((item) => {
                        const isSelected = formData.stressLevel === item.id;
                        const IconComponent = item.Icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setFormData({ stressLevel: item.id })}
                                className={clsx(
                                    'p-3 rounded-xl border-2 transition-all text-center',
                                    isSelected
                                        ? 'border-primary ring-2 ring-primary ring-inset bg-primary/5'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
                                )}
                            >
                                <IconComponent
                                    className={clsx(
                                        'w-6 h-6 mx-auto mb-1',
                                        isSelected ? 'text-primary' : 'text-slate-400'
                                    )}
                                    strokeWidth={1.5}
                                />
                                <div className={clsx(
                                    'text-xs font-medium',
                                    isSelected ? 'text-primary' : 'text-slate-600'
                                )}>
                                    {item.label}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Buttons - No back button (using header back arrow) */}
            <div className="mt-auto pt-4 flex items-center justify-end">
                <div className="flex items-center gap-3">
                    <button
                        onClick={skipStep}
                        className="text-sm text-slate-500 hover:underline"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={!isValid}
                        className={clsx(
                            'px-6 py-3 rounded-2xl font-semibold shadow-md transition-all',
                            isValid
                                ? 'bg-primary text-white hover:shadow-lg'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        )}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
}
