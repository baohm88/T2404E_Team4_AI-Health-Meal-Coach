/**
 * Onboarding Page
 *
 * Entry point for the onboarding flow.
 * Supports 5-step flow with conditional TARGET step.
 *
 * Flow:
 * 1. GOAL → Choose objective
 * 2. TARGET → (conditional) Weight goal details
 * 3. INFO → Body measurements
 * 4. LIFESTYLE → Activity, sleep, stress
 * 5. ANALYSIS → Health metrics dashboard
 *
 * @see /hooks/use-onboarding-logic.ts
 */

'use client';

import { useOnboardingLogic } from '@/hooks/use-onboarding-logic';
import { StepWrapper } from '@/components/onboarding/StepWrapper';
import { StepGoal } from '@/components/onboarding/StepGoal';
import { StepTarget } from '@/components/onboarding/StepTarget';
import { StepInfo } from '@/components/onboarding/StepInfo';
import { StepLifestyle } from '@/components/onboarding/StepLifestyle';
import { SummaryCard } from '@/components/onboarding/SummaryCard';
import { OnboardingStep } from '@/lib/constants/onboarding.constants';

// ============================================================
// STEP CONTENT COMPONENTS MAP
// ============================================================

/**
 * Map of step number to component
 * Using Record for type safety instead of switch statement
 */
const STEP_COMPONENTS: Record<OnboardingStep, React.ReactNode> = {
    [OnboardingStep.GOAL]: <StepGoal />,
    [OnboardingStep.TARGET]: <StepTarget />,
    [OnboardingStep.INFO]: <StepInfo />,
    [OnboardingStep.LIFESTYLE]: <StepLifestyle />,
    [OnboardingStep.ANALYSIS]: <SummaryCard />,
};

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function OnboardingPage() {
    // All logic extracted to custom hook
    const { currentStep, stepMeta, actualTotalSteps, visualStep } = useOnboardingLogic();

    // Get step content from map (fallback to Goal if invalid step)
    const stepContent = STEP_COMPONENTS[currentStep as OnboardingStep] ?? <StepGoal />;

    return (
        <StepWrapper
            title={stepMeta.title}
            description={stepMeta.description}
            visualStep={visualStep}
            totalSteps={actualTotalSteps}
        >
            {stepContent}
        </StepWrapper>
    );
}
