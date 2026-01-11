import { OnboardingData } from '@/lib/schemas/onboarding.schema';

export const submitOnboarding = async (data: OnboardingData): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Submitting onboarding data:', data);
            resolve({ success: true, message: 'Onboarding completed successfully' });
        }, 2000);
    });
};
