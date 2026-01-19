/**
 * useOnboardingLogic Hook
 *
 * Custom hook for Onboarding page logic.
 * Simplified to 2-step flow: INFO → LIFESTYLE
 *
 * @returns Step content, metadata, and navigation handlers
 */

import { useMemo, useCallback } from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingStep, FIRST_STEP, LAST_STEP } from '@/lib/constants/onboarding.constants';

// ============================================================
// TYPES
// ============================================================

/** Metadata for each onboarding step */
interface StepMeta {
    title: string;
    description: string;
}

/** Return type of useOnboardingLogic hook */
interface UseOnboardingLogicReturn {
    /** Current step number (1-2) */
    currentStep: number;
    /** Total steps (always 2) */
    totalSteps: number;
    /** Progress percentage (0-100) */
    progress: number;
    /** Metadata for current step */
    stepMeta: StepMeta;
    /** Go to next step */
    goNext: () => void;
    /** Go to previous step */
    goBack: () => void;
    /** Skip current step with defaults */
    skip: () => void;
    /** Check if on first step */
    isFirstStep: boolean;
    /** Check if on last step */
    isLastStep: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

/** Step metadata configuration */
const STEP_METADATA: Record<OnboardingStep, StepMeta> = {
    [OnboardingStep.INFO]: {
        title: 'Thông tin cơ bản',
        description: 'Cho chúng tôi biết thông tin của bạn để tính toán chính xác.',
    },
    [OnboardingStep.LIFESTYLE]: {
        title: 'Lối sống của bạn',
        description: 'Hoạt động, giấc ngủ và mức độ stress hàng ngày.',
    },
};

/** Default metadata for unknown steps */
const DEFAULT_META: StepMeta = {
    title: '',
    description: '',
};

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export const useOnboardingLogic = (): UseOnboardingLogicReturn => {
    const {
        step,
        totalSteps,
        nextStep,
        prevStep,
        skipStep,
    } = useOnboardingStore();

    // Memoized step metadata
    const stepMeta = useMemo<StepMeta>(() => {
        return STEP_METADATA[step as OnboardingStep] ?? DEFAULT_META;
    }, [step]);

    // Memoized progress calculation
    const progress = useMemo(() => {
        return (step / totalSteps) * 100;
    }, [step, totalSteps]);

    // Navigation states
    const isFirstStep = step === FIRST_STEP;
    const isLastStep = step === LAST_STEP;

    // Callbacks for navigation (stable references)
    const goNext = useCallback(() => nextStep(), [nextStep]);
    const goBack = useCallback(() => prevStep(), [prevStep]);
    const skip = useCallback(() => skipStep(), [skipStep]);

    return {
        currentStep: step,
        totalSteps,
        progress,
        stepMeta,
        goNext,
        goBack,
        skip,
        isFirstStep,
        isLastStep,
    };
};
