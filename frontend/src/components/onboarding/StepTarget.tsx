/**
 * StepTarget Component
 *
 * Conditional step for setting target weight and weekly goal pace.
 * Only shown when Goal is WEIGHT_LOSS or MUSCLE_GAIN.
 *
 * Features:
 * - Target weight input with validation
 * - Weekly goal pace selection (0.25/0.5/0.8 kg/week)
 * - Calculates and displays estimated time to goal
 * - Smooth height transitions to prevent layout shift
 */

'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Goal, WeeklyGoal } from '@/lib/schemas/onboarding.schema';
import {
    WEEKLY_GOAL_VALUES,
    GOAL_LABELS,
} from '@/lib/constants/onboarding.constants';
import clsx from 'clsx';
import { Target, TrendingDown, TrendingUp, Clock } from 'lucide-react';

// ============================================================
// TYPES & CONSTANTS
// ============================================================

interface WeeklyGoalOption {
    id: WeeklyGoal;
    label: string;
    value: number;
    description: string;
}

const WEEKLY_GOAL_OPTIONS: WeeklyGoalOption[] = [
    {
        id: WeeklyGoal.SLOW,
        label: 'Chậm & Bền vững',
        value: WEEKLY_GOAL_VALUES[WeeklyGoal.SLOW],
        description: '0.25 kg/tuần',
    },
    {
        id: WeeklyGoal.NORMAL,
        label: 'Vừa phải',
        value: WEEKLY_GOAL_VALUES[WeeklyGoal.NORMAL],
        description: '0.5 kg/tuần',
    },
    {
        id: WeeklyGoal.FAST,
        label: 'Nhanh',
        value: WEEKLY_GOAL_VALUES[WeeklyGoal.FAST],
        description: '0.8 kg/tuần',
    },
];

// ============================================================
// COMPONENT
// ============================================================

export function StepTarget() {
    const { formData, setFormData, nextStep, skipStep } = useOnboardingStore();

    const isLosing = formData.goal === Goal.WEIGHT_LOSS;
    const goalLabel = GOAL_LABELS[formData.goal as Goal] ?? 'Mục tiêu';

    // Calculate weeks to goal
    const weeksToGoal = useMemo(() => {
        if (!formData.weight || !formData.targetWeight || !formData.weeklyGoal) {
            return null;
        }
        const diff = Math.abs(formData.weight - formData.targetWeight);
        const weeklyRate = WEEKLY_GOAL_VALUES[formData.weeklyGoal];
        return Math.ceil(diff / weeklyRate);
    }, [formData.weight, formData.targetWeight, formData.weeklyGoal]);

    const isValid = formData.targetWeight && formData.weeklyGoal;

    // Validate target weight direction
    const targetWeightError = useMemo(() => {
        if (!formData.targetWeight || !formData.weight) return null;

        if (isLosing && formData.targetWeight >= formData.weight) {
            return 'Cân nặng mục tiêu phải nhỏ hơn cân hiện tại';
        }
        if (!isLosing && formData.targetWeight <= formData.weight) {
            return 'Cân nặng mục tiêu phải lớn hơn cân hiện tại';
        }
        return null;
    }, [formData.targetWeight, formData.weight, isLosing]);

    return (
        <div className="flex flex-col h-full min-h-[480px]">
            {/* Header with goal icon */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                {isLosing ? (
                    <TrendingDown className="w-5 h-5 text-primary" />
                ) : (
                    <TrendingUp className="w-5 h-5 text-primary" />
                )}
                <span className="text-sm text-slate-700">
                    Bạn đã chọn: <strong className="text-primary">{goalLabel}</strong>
                </span>
            </div>

            {/* Target Weight Input */}
            <div className="mb-6">
                <label className="flex flex-col">
                    <span className="text-sm text-slate-600 font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Cân nặng mục tiêu (kg)
                    </span>
                    <input
                        type="number"
                        min="30"
                        max="250"
                        step="0.5"
                        value={formData.targetWeight ?? ''}
                        onChange={(e) => setFormData({ targetWeight: Number(e.target.value) })}
                        placeholder={isLosing ? 'Ví dụ: 60' : 'Ví dụ: 75'}
                        className={clsx(
                            'p-4 rounded-2xl border-2 text-lg font-semibold transition-all',
                            'focus:outline-none focus:ring-2 focus:ring-inset',
                            targetWeightError
                                ? 'border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50'
                                : 'border-slate-200 focus:border-primary focus:ring-primary/20 bg-white'
                        )}
                    />
                    {targetWeightError && (
                        <span className="text-xs text-red-500 mt-1">{targetWeightError}</span>
                    )}
                    {formData.weight && (
                        <span className="text-xs text-slate-400 mt-1">
                            Cân nặng hiện tại: {formData.weight} kg
                        </span>
                    )}
                </label>
            </div>

            {/* Weekly Goal Selection */}
            <div className="mb-6">
                <span className="text-sm text-slate-600 font-medium mb-3 block">
                    Tốc độ {isLosing ? 'giảm' : 'tăng'} mong muốn
                </span>
                <div className="grid grid-cols-3 gap-3">
                    {WEEKLY_GOAL_OPTIONS.map((option) => {
                        const isSelected = formData.weeklyGoal === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setFormData({ weeklyGoal: option.id })}
                                className={clsx(
                                    'p-4 rounded-2xl border-2 transition-all text-center',
                                    isSelected
                                        ? 'border-primary ring-2 ring-primary ring-inset bg-primary/5'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
                                )}
                            >
                                <div className={clsx(
                                    'text-sm font-semibold mb-1',
                                    isSelected ? 'text-primary' : 'text-slate-700'
                                )}>
                                    {option.label}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {option.description}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Estimate - Animated */}
            <AnimatePresence mode="wait">
                {weeksToGoal && !targetWeightError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                            <div className="flex items-center gap-3 text-blue-700">
                                <Clock className="w-5 h-5" />
                                <div>
                                    <div className="font-semibold">
                                        Ước tính: ~{weeksToGoal} tuần
                                    </div>
                                    <div className="text-xs text-blue-500">
                                        Khoảng {Math.ceil(weeksToGoal / 4)} tháng để đạt mục tiêu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons - No back button (using header back arrow) */}
            <div className="mt-auto pt-6 flex items-center justify-end">
                <div className="flex items-center gap-3">
                    <button
                        onClick={skipStep}
                        className="text-sm text-slate-500 hover:underline"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={!isValid || !!targetWeightError}
                        className={clsx(
                            'px-6 py-3 rounded-2xl font-semibold shadow-md transition-all',
                            isValid && !targetWeightError
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
