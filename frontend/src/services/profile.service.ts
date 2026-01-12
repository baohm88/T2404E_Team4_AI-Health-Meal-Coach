/**
 * Profile Service
 *
 * Handles health profile API calls.
 * Includes mapper logic to convert frontend store data to backend API format.
 *
 * @see /lib/http.ts - HTTP client
 * @see /types/api.ts - Type definitions
 * @see /stores/useOnboardingStore.ts - Onboarding state
 */

import http from '@/lib/http';
import {
    ApiResponse,
    ApiGender,
    ApiGoal,
    ApiActivity,
    ApiStress,
    ApiSleep,
    CreateHealthProfileRequest,
    HealthProfileResponse,
} from '@/types/api';
import { OnboardingData, Goal, Gender, ActivityLevel, StressLevel, SleepRange } from '@/lib/schemas/onboarding.schema';

// ============================================================
// ENUM MAPPERS
// ============================================================

/**
 * Map frontend Gender to API Gender
 */
const mapGender = (gender: Gender | undefined): ApiGender => {
    switch (gender) {
        case Gender.MALE:
            return ApiGender.MALE;
        case Gender.FEMALE:
            return ApiGender.FEMALE;
        case Gender.OTHER:
            return ApiGender.OTHER;
        default:
            return ApiGender.MALE; // Default fallback
    }
};

/**
 * Map frontend Goal to API Goal
 * Note: MAINTENANCE → MAINTAIN
 */
const mapGoal = (goal: Goal | undefined): ApiGoal => {
    switch (goal) {
        case Goal.WEIGHT_LOSS:
            return ApiGoal.WEIGHT_LOSS;
        case Goal.MAINTENANCE:
            return ApiGoal.MAINTAIN; // Key difference
        case Goal.MUSCLE_GAIN:
            return ApiGoal.MUSCLE_GAIN;
        default:
            return ApiGoal.MAINTAIN; // Default fallback
    }
};

/**
 * Map frontend ActivityLevel to API Activity
 * Note: LIGHT → LIGHTLY_ACTIVE, MODERATE → MODERATELY_ACTIVE
 */
const mapActivityLevel = (level: ActivityLevel | undefined): ApiActivity => {
    switch (level) {
        case ActivityLevel.SEDENTARY:
            return ApiActivity.SEDENTARY;
        case ActivityLevel.LIGHT:
            return ApiActivity.LIGHTLY_ACTIVE;
        case ActivityLevel.MODERATE:
            return ApiActivity.MODERATELY_ACTIVE;
        case ActivityLevel.VERY_ACTIVE:
            return ApiActivity.VERY_ACTIVE;
        default:
            return ApiActivity.LIGHTLY_ACTIVE; // Default fallback
    }
};

/**
 * Map frontend StressLevel to API Stress
 */
const mapStressLevel = (level: StressLevel | undefined): ApiStress => {
    switch (level) {
        case StressLevel.LOW:
            return ApiStress.LOW;
        case StressLevel.MEDIUM:
            return ApiStress.MEDIUM;
        case StressLevel.HIGH:
            return ApiStress.HIGH;
        case StressLevel.VERY_HIGH:
            return ApiStress.VERY_HIGH;
        default:
            return ApiStress.MEDIUM; // Default fallback
    }
};

/**
 * Map frontend SleepRange to API Sleep
 * Note: LESS_THAN_5 → LESS_THAN_FIVE, etc.
 */
const mapSleepDuration = (range: SleepRange | undefined): ApiSleep => {
    switch (range) {
        case SleepRange.LESS_THAN_5:
            return ApiSleep.LESS_THAN_FIVE;
        case SleepRange.FIVE_TO_7:
            return ApiSleep.FIVE_TO_SEVEN;
        case SleepRange.SEVEN_TO_9:
            return ApiSleep.SEVEN_TO_NINE;
        case SleepRange.MORE_THAN_9:
            return ApiSleep.MORE_THAN_NINE;
        default:
            return ApiSleep.SEVEN_TO_NINE; // Default fallback (optimal)
    }
};

// ============================================================
// REQUEST MAPPER
// ============================================================

/**
 * Map OnboardingStore data to API CreateHealthProfileRequest
 */
const mapOnboardingToApiRequest = (
    data: Partial<OnboardingData>
): CreateHealthProfileRequest => ({
    gender: mapGender(data.gender),
    age: data.age ?? 25,
    height: data.height ?? 170,
    weight: data.weight ?? 65,
    goal: mapGoal(data.goal),
    activityLevel: mapActivityLevel(data.activityLevel),
    stressLevel: mapStressLevel(data.stressLevel),
    sleepDuration: mapSleepDuration(data.sleepRange),
});

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export interface ProfileServiceResponse {
    success: boolean;
    message: string;
    data?: HealthProfileResponse;
}

export const profileService = {
    /**
     * Create health profile from onboarding data
     * Maps frontend store data to backend API format
     *
     * @param storeData - Partial onboarding data from store
     * @returns Promise with API response
     */
    createProfile: async (
        storeData: Partial<OnboardingData>
    ): Promise<ProfileServiceResponse> => {
        try {
            const requestBody = mapOnboardingToApiRequest(storeData);

            // http.post returns ApiResponse<T> after interceptor unwrapping
            const response = await http.post('/health-profile', requestBody) as unknown as ApiResponse<HealthProfileResponse>;

            return {
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
            const errorMessage =
                axiosError.response?.data?.message ||
                'Không thể tạo hồ sơ sức khỏe. Vui lòng thử lại.';

            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    /**
     * Get current user's health profile
     */
    getProfile: async (): Promise<ProfileServiceResponse> => {
        try {
            // http.get returns ApiResponse<T> after interceptor unwrapping
            const response = await http.get('/health-profile') as unknown as ApiResponse<HealthProfileResponse>;

            return {
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
            const errorMessage =
                axiosError.response?.data?.message ||
                'Không thể tải hồ sơ sức khỏe.';

            return {
                success: false,
                message: errorMessage,
            };
        }
    },
};

// ============================================================
// LEGACY EXPORT (backward compatibility)
// ============================================================

/**
 * @deprecated Use profileService.createProfile instead
 */
export const submitOnboarding = async (
    data: OnboardingData
): Promise<{ success: boolean; message: string }> => {
    const result = await profileService.createProfile(data);
    return {
        success: result.success,
        message: result.message,
    };
};
