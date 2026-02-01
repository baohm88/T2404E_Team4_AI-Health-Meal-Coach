/**
 * StepLifestyle Component
 *
 * Final step of the onboarding flow containing:
 * - Activity Level selection (Grid 2x2 with descriptions)
 * - Sleep Range selection (Compact horizontal pills)
 * - Stress Level selection (Compact horizontal pills)
 *
 * Optimized for compact layout - fits without scrolling.
 * On submit: Saves profile and redirects to /onboarding/plan-proposal
 */

'use client';

import {
  ACTIVITY_DESCRIPTIONS,
  ACTIVITY_LABELS,
  SLEEP_LABELS,
  STRESS_LABELS,
} from '@/lib/constants/onboarding.constants';
import { ActivityLevel, SleepRange, StressLevel } from '@/lib/schemas/onboarding.schema';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import clsx from 'clsx';
import {
  Activity,
  Brain,
  Loader2,
  Moon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

// ============================================================
// CONSTANTS
// ============================================================

const ACTIVITY_OPTIONS = [
    { id: ActivityLevel.SEDENTARY, label: ACTIVITY_LABELS[ActivityLevel.SEDENTARY], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.SEDENTARY] },
    { id: ActivityLevel.LIGHT, label: ACTIVITY_LABELS[ActivityLevel.LIGHT], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.LIGHT] },
    { id: ActivityLevel.MODERATE, label: ACTIVITY_LABELS[ActivityLevel.MODERATE], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.MODERATE] },
    { id: ActivityLevel.VERY_ACTIVE, label: ACTIVITY_LABELS[ActivityLevel.VERY_ACTIVE], desc: ACTIVITY_DESCRIPTIONS[ActivityLevel.VERY_ACTIVE] },
];

// Compact options for Sleep (no descriptions, no icons)
const SLEEP_OPTIONS = [
    { id: SleepRange.LESS_THAN_5, label: SLEEP_LABELS[SleepRange.LESS_THAN_5] },
    { id: SleepRange.FIVE_TO_7, label: SLEEP_LABELS[SleepRange.FIVE_TO_7] },
    { id: SleepRange.SEVEN_TO_9, label: SLEEP_LABELS[SleepRange.SEVEN_TO_9] },
    { id: SleepRange.MORE_THAN_9, label: SLEEP_LABELS[SleepRange.MORE_THAN_9] },
];

// Compact options for Stress (no descriptions, no icons)
const STRESS_OPTIONS = [
    { id: StressLevel.LOW, label: STRESS_LABELS[StressLevel.LOW] },
    { id: StressLevel.MEDIUM, label: STRESS_LABELS[StressLevel.MEDIUM] },
    { id: StressLevel.HIGH, label: STRESS_LABELS[StressLevel.HIGH] },
    { id: StressLevel.VERY_HIGH, label: STRESS_LABELS[StressLevel.VERY_HIGH] },
];

// ============================================================
// COMPONENT
// ============================================================

export function StepLifestyle() {
    const router = useRouter();
    const { formData, setFormData, skipStep } = useOnboardingStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = formData.activityLevel && formData.sleepRange && formData.stressLevel;

    /**
     * GUEST FIRST FLOW: Just redirect to result page
     * Profile will be saved after user registers
     */
    const handleSubmit = useCallback(async () => {
        if (!isValid) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Check if user is authenticated
            const { getToken } = require('@/lib/http'); // Import dynamically or at top level to avoid circular issues if any
            const token = getToken();

            if (token) {
                // Determine user is logged in, call API to save/analyze immediately
                const { aiService } = require('@/services/ai.service');
                const res = await aiService.analyzeHealth(formData);
                
                if (!res.success) {
                    throw new Error(res.error || 'Phân tích thất bại');
                }
            } else {
            }

            // Navigate to result page
            router.push('/onboarding/result');
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            setIsSubmitting(false);
        }
    }, [formData, isValid, router]);

    return (
        <div className="flex flex-col h-full">
            {/* Activity Level Section - Grid 2x2 with descriptions */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
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
                                disabled={isSubmitting}
                                className={clsx(
                                    'p-2.5 rounded-xl border-2 transition-all text-left',
                                    isSelected
                                        ? 'border-primary ring-2 ring-primary ring-inset bg-primary/5'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white active:scale-[0.98] cursor-pointer',
                                    isSubmitting && 'opacity-50 cursor-not-allowed'
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

            {/* Sleep Range Section - Compact horizontal pills */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-medium">Giờ ngủ/ngày</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                    {SLEEP_OPTIONS.map((item) => {
                        const isSelected = formData.sleepRange === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setFormData({ sleepRange: item.id })}
                                disabled={isSubmitting}
                                className={clsx(
                                    'py-2.5 px-2 rounded-lg border-2 transition-all text-center',
                                    isSelected
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white text-slate-600 active:scale-[0.98] cursor-pointer',
                                    isSubmitting && 'opacity-50 cursor-not-allowed'
                                )}
                            >
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

            {/* Stress Level Section - Compact horizontal pills */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-medium">Mức độ stress</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                    {STRESS_OPTIONS.map((item) => {
                        const isSelected = formData.stressLevel === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setFormData({ stressLevel: item.id })}
                                disabled={isSubmitting}
                                className={clsx(
                                    'py-2.5 px-2 rounded-lg border-2 transition-all text-center',
                                    isSelected
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white text-slate-600 active:scale-[0.98] cursor-pointer',
                                    isSubmitting && 'opacity-50 cursor-not-allowed'
                                )}
                            >
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

            {/* Error Message */}
            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-auto pt-3 flex items-center justify-end">
                <div className="flex items-center gap-3">
                    <button
                        onClick={skipStep}
                        disabled={isSubmitting}
                        className="text-sm text-slate-500 hover:underline disabled:opacity-50"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        className={clsx(
                            'px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer',
                            isValid && !isSubmitting
                                ? 'bg-primary text-white hover:shadow-lg'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            'Hoàn tất'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
