/**
 * Onboarding Store
 *
 * Manages state for Onboarding flow using Zustand.
 * Updated to support 5-step flow with conditional TARGET step.
 *
 * Architecture:
 * - State types defined clearly (OnboardingState)
 * - Constants separated (onboarding.constants.ts)
 * - Skip logic handled per step with safe defaults
 * - Conditional navigation based on Goal selection
 *
 * @see /lib/constants/onboarding.constants.ts - Default values
 * @see /lib/schemas/onboarding.schema.ts - Zod schema & types
 */

import { create } from 'zustand';
import { OnboardingData, Goal } from '@/lib/schemas/onboarding.schema';
import {
    OnboardingStep,
    TOTAL_ONBOARDING_STEPS,
    FIRST_STEP,
    INITIAL_FORM_DATA,
    SKIP_DEFAULT_VALUES,
    requiresTargetStep,
} from '@/lib/constants/onboarding.constants';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * State interface for Onboarding Store
 * Uses Partial<OnboardingData> since user may not complete all fields
 */
interface OnboardingState {
    /** Current step (1-5) */
    step: number;
    /** Total number of steps (max) */
    totalSteps: number;
    /** Form data (may be incomplete) */
    formData: Partial<OnboardingData>;
}

/**
 * Actions interface for Onboarding Store
 */
interface OnboardingActions {
    /** Update partial form data */
    setFormData: (data: Partial<OnboardingData>) => void;
    /** Go to next step (with conditional logic) */
    nextStep: () => void;
    /** Go to previous step (with conditional logic) */
    prevStep: () => void;
    /** Set specific step */
    setStep: (step: number) => void;
    /** Skip current step with defaults */
    skipStep: () => void;
    /** Reset to initial state */
    reset: () => void;
    /** Check if form has minimum required data */
    isComplete: () => boolean;
    /** Get actual step count based on goal (4 or 5) */
    getActualStepCount: () => number;
    /** Get visual step number (adjusted for skipped TARGET) */
    getVisualStep: () => number;
}

/** Combined store type */
type OnboardingStore = OnboardingState & OnboardingActions;

// ============================================================
// STEP NAVIGATION HELPERS
// ============================================================

/**
 * Get the next step number considering conditional TARGET step
 */
const getNextStep = (currentStep: number, goal: Goal | undefined): number => {
    const maxStep = TOTAL_ONBOARDING_STEPS;

    // If on GOAL step and goal doesn't require target, skip TARGET
    if (currentStep === OnboardingStep.GOAL && !requiresTargetStep(goal)) {
        return OnboardingStep.INFO; // Skip TARGET (step 2), go to INFO (step 3)
    }

    return Math.min(currentStep + 1, maxStep);
};

/**
 * Get the previous step number considering conditional TARGET step
 */
const getPrevStep = (currentStep: number, goal: Goal | undefined): number => {
    // If on INFO step and goal doesn't require target, skip back to GOAL
    if (currentStep === OnboardingStep.INFO && !requiresTargetStep(goal)) {
        return OnboardingStep.GOAL; // Skip TARGET (step 2), go back to GOAL (step 1)
    }

    return Math.max(currentStep - 1, FIRST_STEP);
};

// ============================================================
// SKIP STEP HANDLERS
// ============================================================

/**
 * Get default data for skipping a step
 * Returns partial data to merge into formData
 */
const getSkipDataForStep = (
    currentStep: number,
    currentData: Partial<OnboardingData>
): Partial<OnboardingData> => {
    switch (currentStep) {
        case OnboardingStep.GOAL:
            // Default to MAINTENANCE (skip TARGET step)
            return { goal: SKIP_DEFAULT_VALUES.goal };

        case OnboardingStep.TARGET:
            // Set default target weight and weekly goal
            return {
                targetWeight: currentData.weight ?? SKIP_DEFAULT_VALUES.weight,
                weeklyGoal: SKIP_DEFAULT_VALUES.weeklyGoal,
            };

        case OnboardingStep.INFO:
            // Fill in missing body stats
            return {
                gender: currentData.gender ?? SKIP_DEFAULT_VALUES.gender,
                height: currentData.height ?? SKIP_DEFAULT_VALUES.height,
                weight: currentData.weight ?? SKIP_DEFAULT_VALUES.weight,
                age: currentData.age ?? SKIP_DEFAULT_VALUES.age,
            };

        case OnboardingStep.LIFESTYLE:
            // Set default lifestyle values
            return {
                activityLevel: currentData.activityLevel ?? SKIP_DEFAULT_VALUES.activityLevel,
                sleepRange: SKIP_DEFAULT_VALUES.sleepRange,
                stressLevel: SKIP_DEFAULT_VALUES.stressLevel,
            };

        default:
            // ANALYSIS step: no skip data needed
            return {};
    }
};

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
    // -------------------- STATE --------------------
    step: FIRST_STEP,
    totalSteps: TOTAL_ONBOARDING_STEPS,
    formData: { ...INITIAL_FORM_DATA },

    // -------------------- ACTIONS --------------------

    setFormData: (data) => {
        set((state) => ({
            formData: { ...state.formData, ...data },
        }));
    },

    nextStep: () => {
        const { step, formData } = get();
        const nextStep = getNextStep(step, formData.goal);
        set({ step: nextStep });
    },

    prevStep: () => {
        const { step, formData } = get();
        const prevStep = getPrevStep(step, formData.goal);
        set({ step: prevStep });
    },

    setStep: (step) => {
        const validStep = Math.max(FIRST_STEP, Math.min(step, TOTAL_ONBOARDING_STEPS));
        set({ step: validStep });
    },

    skipStep: () => {
        const { step, formData, totalSteps } = get();

        // Get default data for current step
        const skipData = getSkipDataForStep(step, formData);
        const updatedFormData = { ...formData, ...skipData };

        // Calculate next step (considering conditional logic)
        const nextStep = getNextStep(step, updatedFormData.goal);

        set({
            formData: updatedFormData,
            step: Math.min(nextStep, totalSteps),
        });
    },

    reset: () => {
        set({
            step: FIRST_STEP,
            formData: { ...INITIAL_FORM_DATA },
        });
    },

    isComplete: () => {
        const { formData } = get();
        // Minimum required fields for health calculation
        return !!(
            formData.goal &&
            formData.gender &&
            formData.height &&
            formData.weight &&
            formData.age &&
            formData.activityLevel
        );
    },

    getActualStepCount: () => {
        const { formData } = get();
        // If MAINTENANCE, TARGET step is skipped (4 steps instead of 5)
        return requiresTargetStep(formData.goal) ? 5 : 4;
    },

    getVisualStep: () => {
        const { step, formData } = get();
        // If MAINTENANCE and past GOAL, subtract 1 from step number
        if (!requiresTargetStep(formData.goal) && step > OnboardingStep.GOAL) {
            return step - 1;
        }
        return step;
    },
}));

// ============================================================
// SELECTOR HOOKS (Performance optimization)
// ============================================================

/** Selector: Get current step */
export const useCurrentStep = () => useOnboardingStore((state) => state.step);

/** Selector: Get form data only */
export const useFormData = () => useOnboardingStore((state) => state.formData);

/** Selector: Progress percentage (0-100), adjusted for actual step count */
export const useProgress = () =>
    useOnboardingStore((state) => {
        const actualSteps = state.getActualStepCount();
        const visualStep = state.getVisualStep();
        return (visualStep / actualSteps) * 100;
    });

/** Selector: Check if TARGET step should be shown */
export const useShowTargetStep = () =>
    useOnboardingStore((state) => requiresTargetStep(state.formData.goal));
