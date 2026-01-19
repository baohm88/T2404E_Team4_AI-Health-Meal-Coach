/**
 * StepWrapper Component
 *
 * Layout wrapper for onboarding steps with:
 * - Progress bar with visual step count
 * - Back button navigation
 * - Animated step transitions
 *
 * Updated to accept visual step props for conditional step flow.
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { ChevronLeft } from 'lucide-react';

interface StepWrapperProps {
    children: React.ReactNode;
    title: string;
    description: string;
    /** Visual step number (adjusted for skipped steps) */
    visualStep?: number;
    /** Actual total steps based on goal */
    totalSteps?: number;
}

export function StepWrapper({
    children,
    title,
    description,
    visualStep,
    totalSteps,
}: StepWrapperProps) {
    const { step, totalSteps: storeTotalSteps, prevStep } = useOnboardingStore();

    // Use props if provided, otherwise fall back to store values
    const displayStep = visualStep ?? step;
    const displayTotal = totalSteps ?? storeTotalSteps;

    const progress = (displayStep / displayTotal) * 100;
    const isFirstStep = step === 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-cream-light)] via-[var(--color-cream-pink)] to-[var(--color-cream-blue)] flex items-center justify-center p-6 font-inter">
            <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: Visual panel */}
                <div className="hidden md:flex flex-col justify-center items-center rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-white to-[var(--color-cream-pink)] p-8">
                    <div className="w-full h-12 flex items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                                AI
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800">AI Health Coach</div>
                                <div className="text-xs text-slate-500">Onboarding</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex-1 w-full flex items-center justify-center">
                        <div className="relative w-64 h-64 rounded-3xl bg-gradient-to-tr from-primary to-accent shadow-[0_30px_60px_rgba(124,92,250,0.12)] p-4 flex items-center justify-center">
                            <div className="w-44 h-44 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg">
                                <div className="text-3xl font-extrabold text-primary">🍎</div>
                                <div className="text-sm text-slate-600 mt-2 font-medium">Healthy habits</div>
                            </div>
                            <div className="absolute -right-8 -bottom-6 w-24 h-24 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-xs text-slate-700 font-medium shadow-sm">
                                Personal
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center px-6">
                        <h3 className="text-lg font-semibold text-slate-800">Thiết kế cho bạn</h3>
                        <p className="text-sm text-slate-500 mt-2">
                            AI Coach cá nhân hóa kế hoạch dinh dưỡng dựa trên dữ liệu của bạn.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Form card */}
                <div className="rounded-3xl p-6 md:p-10 bg-white/60 backdrop-blur-md shadow-2xl flex flex-col">
                    {/* Stepper with Back Arrow */}
                    <div className="flex items-center gap-3 mb-6">
                        {/* Back Arrow */}
                        <button
                            onClick={prevStep}
                            disabled={isFirstStep}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isFirstStep
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                                }`}
                            aria-label="Quay lại"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Progress Bar */}
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                        </div>

                        {/* Step Indicator */}
                        <div className="text-sm text-slate-500 whitespace-nowrap">
                            Bước <span>{displayStep}</span>/{displayTotal}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                        <motion.h2
                            key={`title-${step}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-slate-800"
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            key={`desc-${step}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-slate-500 mt-2"
                        >
                            {description}
                        </motion.p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative overflow-hidden min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
