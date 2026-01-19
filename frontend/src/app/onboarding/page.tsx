/**
 * Onboarding Page
 *
 * Entry point for the onboarding flow.
 * Simplified to 2-step flow: INFO → LIFESTYLE
 *
 * Flow:
 * 1. INFO → Body measurements (Age, Gender, Height, Weight)
 * 2. LIFESTYLE → Activity, sleep, stress
 * 3. Submit → Save profile → Redirect to /onboarding/plan-proposal
 *
 * @see /hooks/use-onboarding-logic.ts
 */

'use client';

import { useOnboardingLogic } from '@/hooks/use-onboarding-logic';
import { StepWrapper } from '@/components/onboarding/StepWrapper';
import { StepInfo } from '@/components/onboarding/StepInfo';
import { StepLifestyle } from '@/components/onboarding/StepLifestyle';
import { OnboardingStep } from '@/lib/constants/onboarding.constants';

// ============================================================
// STEP CONTENT COMPONENTS MAP
// ============================================================

/**
 * Map of step number to component
 * Only 2 steps: INFO and LIFESTYLE
 */
const STEP_COMPONENTS: Record<OnboardingStep, React.ReactNode> = {
    [OnboardingStep.INFO]: <StepInfo />,
    [OnboardingStep.LIFESTYLE]: <StepLifestyle />,
};

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function OnboardingPage() {
    // All logic extracted to custom hook
    const { currentStep, stepMeta, totalSteps } = useOnboardingLogic();

    // Get step content from map (fallback to Info if invalid step)
    const stepContent = STEP_COMPONENTS[currentStep as OnboardingStep] ?? <StepInfo />;

    return (
        <StepWrapper
            title={stepMeta.title}
            description={stepMeta.description}
            visualStep={currentStep}
            totalSteps={totalSteps}
        >
            {stepContent}
        </StepWrapper>
    );
}
