/**
 * Onboarding Store
 *
 * Manages state for Onboarding flow using Zustand.
 * Simplified to 2-step flow: INFO → LIFESTYLE
 *
 * GUEST FIRST FLOW: Uses persist middleware to save data to localStorage
 * so guest users don't lose their data when registering.
 *
 * Architecture:
 * - State types defined clearly (OnboardingState)
 * - Actions in separate interface (OnboardingActions)
 * - Persist middleware for localStorage
 * - Selector hooks for performance optimization
 *
 * @see /lib/constants/onboarding.constants.ts - Step configuration
 * @see /hooks/use-onboarding-logic.ts - Logic hook
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    INITIAL_FORM_DATA,
    TOTAL_ONBOARDING_STEPS,
    FIRST_STEP,
    LAST_STEP,
    SKIP_DEFAULT_VALUES,
    OnboardingStep,
} from '@/lib/constants/onboarding.constants';
import { OnboardingData } from '@/lib/schemas/onboarding.schema';

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'onboarding-data';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * State interface for Onboarding Store
 */
interface OnboardingState {
    step: number;
    totalSteps: number;
    formData: Partial<OnboardingData>;
    isCompleted: boolean;
}

/**
 * Actions interface for Onboarding Store
 */
interface OnboardingActions {
    setFormData: (data: Partial<OnboardingData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    skipStep: () => void;
    reset: () => void;
    markCompleted: () => void;
    isComplete: () => boolean;
    hasPendingData: () => boolean;
    clearStorage: () => void;
    /** Get all guest data for syncing to server */
    getGuestData: () => Partial<OnboardingData> | null;
    /** Clear guest data after successful sync */
    clearGuestData: () => void;
}

/** Combined store type */
type OnboardingStore = OnboardingState & OnboardingActions;

// ============================================================
// SKIP STEP HANDLERS
// ============================================================

/**
 * Get default data for skipping a step
 */
function getSkipDataForStep(
    currentStep: number,
    currentData: Partial<OnboardingData>
): Partial<OnboardingData> {
    switch (currentStep) {
        case OnboardingStep.INFO:
            return {
                gender: currentData.gender ?? SKIP_DEFAULT_VALUES.gender,
                height: currentData.height ?? SKIP_DEFAULT_VALUES.height,
                weight: currentData.weight ?? SKIP_DEFAULT_VALUES.weight,
                age: currentData.age ?? SKIP_DEFAULT_VALUES.age,
            };
        case OnboardingStep.LIFESTYLE:
            return {
                activityLevel: currentData.activityLevel ?? SKIP_DEFAULT_VALUES.activityLevel,
                stressLevel: currentData.stressLevel ?? SKIP_DEFAULT_VALUES.stressLevel,
                sleepRange: currentData.sleepRange ?? SKIP_DEFAULT_VALUES.sleepRange,
            };
        default:
            return {};
    }
}

// ============================================================
// STORE IMPLEMENTATION WITH PERSIST
// ============================================================

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        (set, get) => ({
            // -------------------- STATE --------------------
            step: FIRST_STEP,
            totalSteps: TOTAL_ONBOARDING_STEPS,
            formData: { ...INITIAL_FORM_DATA },
            isCompleted: false,

            // -------------------- ACTIONS --------------------

            setFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data },
                })),

            nextStep: () => {
                const { step } = get();
                if (step < LAST_STEP) {
                    set({ step: step + 1 });
                }
            },

            prevStep: () => {
                const { step } = get();
                if (step > FIRST_STEP) {
                    set({ step: step - 1 });
                }
            },

            setStep: (step) => {
                if (step >= FIRST_STEP && step <= LAST_STEP) {
                    set({ step });
                }
            },

            skipStep: () => {
                const { step, formData } = get();
                const skipData = getSkipDataForStep(step, formData);

                set((state) => ({
                    formData: { ...state.formData, ...skipData },
                    step: Math.min(step + 1, LAST_STEP),
                }));
            },

            reset: () =>
                set({
                    step: FIRST_STEP,
                    formData: { ...INITIAL_FORM_DATA },
                    isCompleted: false,
                }),

            markCompleted: () => set({ isCompleted: true }),

            isComplete: () => {
                const { formData } = get();
                // Check required fields for both steps
                return !!(
                    formData.gender &&
                    formData.height &&
                    formData.weight &&
                    formData.age &&
                    formData.activityLevel &&
                    formData.stressLevel &&
                    formData.sleepRange
                );
            },

            /**
             * Check if there's pending guest onboarding data that needs to be saved
             */
            hasPendingData: () => {
                const { isComplete, isCompleted } = get();
                // Has complete data but not yet saved to backend
                return isComplete() && !isCompleted;
            },

            /**
             * Clear localStorage after successful save
             */
            clearStorage: () => {
                set({
                    step: FIRST_STEP,
                    formData: { ...INITIAL_FORM_DATA },
                    isCompleted: false,
                });
                // Also clear localStorage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(STORAGE_KEY);
                }
            },

            /**
             * Get guest data for syncing to server after registration
             * Returns null if data is incomplete
             */
            getGuestData: () => {
                const { formData, isComplete } = get();
                if (!isComplete()) return null;
                return formData;
            },

            /**
             * Clear guest data after successful sync to server
             */
            clearGuestData: () => {
                set({
                    step: FIRST_STEP,
                    formData: { ...INITIAL_FORM_DATA },
                    isCompleted: true, // Mark as completed so hasPendingData returns false
                });
                // Clear localStorage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(STORAGE_KEY);
                }
            },
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
            // Only persist formData and isCompleted, not step
            partialize: (state) => ({
                formData: state.formData,
                isCompleted: state.isCompleted,
            }),
        }
    )
);

// ============================================================
// SELECTOR HOOKS (Performance optimization)
// ============================================================

/** Selector: Get current step */
export const useCurrentStep = () => useOnboardingStore((state) => state.step);

/** Selector: Get form data only */
export const useFormData = () => useOnboardingStore((state) => state.formData);

/** Selector: Progress percentage (0-100) */
export const useProgress = () =>
    useOnboardingStore((state) => (state.step / state.totalSteps) * 100);

/** Selector: Check if on first step */
export const useIsFirstStep = () =>
    useOnboardingStore((state) => state.step === FIRST_STEP);

/** Selector: Check if on last step */
export const useIsLastStep = () =>
    useOnboardingStore((state) => state.step === LAST_STEP);

/** Selector: Check for pending onboarding data */
export const useHasPendingOnboarding = () =>
    useOnboardingStore((state) => state.hasPendingData());
