/**
 * useOnboardingLogic Hook
 *
 * Custom hook for Onboarding page logic.
 * Updated to support 5-step flow with conditional TARGET step.
 *
 * @returns Step content, metadata, and navigation handlers
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingStep, requiresTargetStep } from '@/lib/constants/onboarding.constants';

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
    /** Current step number (1-5) */
    currentStep: number;
    /** Actual step count based on goal (4 or 5) */
    actualTotalSteps: number;
    /** Visual step for display (adjusted for skipped TARGET) */
    visualStep: number;
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
    /** Whether TARGET step should be shown */
    showTargetStep: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

/** Step metadata configuration */
const STEP_METADATA: Record<OnboardingStep, StepMeta> = {
    [OnboardingStep.GOAL]: {
        title: 'Bạn muốn đạt được điều gì?',
        description: 'Chọn mục tiêu chính của bạn để bắt đầu.',
    },
    [OnboardingStep.TARGET]: {
        title: 'Chi tiết mục tiêu',
        description: 'Thiết lập cân nặng mong muốn và tốc độ đạt mục tiêu.',
    },
    [OnboardingStep.INFO]: {
        title: 'Thông tin cơ bản',
        description: 'Cho chúng tôi biết thông tin để tính toán chính xác.',
    },
    [OnboardingStep.LIFESTYLE]: {
        title: 'Lối sống của bạn',
        description: 'Hoạt động, giấc ngủ và mức độ stress hàng ngày.',
    },
    [OnboardingStep.ANALYSIS]: {
        title: 'Phân tích sức khỏe',
        description: 'Xem các chỉ số BMI, TDEE và năng lượng của bạn.',
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
        nextStep,
        prevStep,
        skipStep,
        reset,
        getActualStepCount,
        getVisualStep,
        formData,
    } = useOnboardingStore();

    // Reset store on mount to ensure fresh start
    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Determine if TARGET step should be shown
    const showTargetStep = requiresTargetStep(formData.goal);

    // Get actual step count (4 or 5 based on goal)
    const actualTotalSteps = getActualStepCount();

    // Get visual step (adjusted for skipped TARGET)
    const visualStep = getVisualStep();

    // Memoized step metadata
    const stepMeta = useMemo<StepMeta>(() => {
        return STEP_METADATA[step as OnboardingStep] ?? DEFAULT_META;
    }, [step]);

    // Memoized progress calculation (based on visual step)
    const progress = useMemo(() => {
        return (visualStep / actualTotalSteps) * 100;
    }, [visualStep, actualTotalSteps]);

    // Navigation states
    const isFirstStep = step === OnboardingStep.GOAL;
    const isLastStep = step === OnboardingStep.ANALYSIS;

    // Callbacks for navigation (stable references)
    const goNext = useCallback(() => nextStep(), [nextStep]);
    const goBack = useCallback(() => prevStep(), [prevStep]);
    const skip = useCallback(() => skipStep(), [skipStep]);

    return {
        currentStep: step,
        actualTotalSteps,
        visualStep,
        progress,
        stepMeta,
        goNext,
        goBack,
        skip,
        isFirstStep,
        isLastStep,
        showTargetStep,
    };
};
