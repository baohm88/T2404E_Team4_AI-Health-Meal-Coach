/**
 * Data Mapper Utilities
 *
 * Maps frontend onboarding data to backend API format.
 * 
 * IMPORTANT: Backend expects specific field names:
 * - heightCm (not height)
 * - weightKg (not weight)
 * - Specific enum values (see below)
 *
 * @see AiHealthCoach/src/.../dto/request/AiHealthAnalysisRequest.java
 */

import { Gender, Goal, ActivityLevel, StressLevel, SleepRange } from '@/lib/schemas/onboarding.schema';

// ============================================================
// BACKEND ENUM MAPPINGS
// ============================================================

/**
 * Maps frontend enum values to backend enum values
 * Backend: AiHealthCoach/src/.../enums/*.java
 */
const BACKEND_ENUMS = {
    // Gender: MALE, FEMALE, OTHER
    gender: {
        [Gender.MALE]: 'MALE',
        [Gender.FEMALE]: 'FEMALE',
        [Gender.OTHER]: 'OTHER',
    },
    // GoalType: WEIGHT_LOSS, MAINTENANCE, MUSCLE_GAIN
    goal: {
        [Goal.WEIGHT_LOSS]: 'WEIGHT_LOSS',
        [Goal.MAINTENANCE]: 'MAINTENANCE',
        [Goal.MUSCLE_GAIN]: 'MUSCLE_GAIN',
    },
    // ActivityLevel: SEDENTARY, LIGHT, MODERATE, VERY_ACTIVE
    activityLevel: {
        [ActivityLevel.SEDENTARY]: 'SEDENTARY',
        [ActivityLevel.LIGHT]: 'LIGHT',
        [ActivityLevel.MODERATE]: 'MODERATE',
        [ActivityLevel.VERY_ACTIVE]: 'VERY_ACTIVE',
    },
    // StressLevel: LOW, MEDIUM, HIGH, VERY_HIGH
    stressLevel: {
        [StressLevel.LOW]: 'LOW',
        [StressLevel.MEDIUM]: 'MEDIUM',
        [StressLevel.HIGH]: 'HIGH',
        [StressLevel.VERY_HIGH]: 'VERY_HIGH',
    },
    // SleepDuration: LESS_THAN_FIVE, FIVE_TO_SEVEN, SEVEN_TO_NINE, MORE_THAN_NINE
    sleepDuration: {
        [SleepRange.LESS_THAN_5]: 'LESS_THAN_FIVE',
        [SleepRange.FIVE_TO_7]: 'FIVE_TO_SEVEN',
        [SleepRange.SEVEN_TO_9]: 'SEVEN_TO_NINE',
        [SleepRange.MORE_THAN_9]: 'MORE_THAN_NINE',
    },
} as const;

// ============================================================
// FRONTEND → BACKEND MAPPING
// ============================================================

/**
 * Map frontend onboarding data to backend HealthProfileRequest format
 *
 * Frontend: { gender, age, height, weight, goal, activityLevel, stressLevel, sleepRange }
 * Backend:  { gender, age, height, weight, activityLevel, sleepDuration, stressLevel }
 * 
 * NOTE: Backend HealthProfileRequest does NOT have 'goal' field!
 */
export function mapFrontendToBackend(data: Record<string, unknown>): Record<string, unknown> {
    const mapped = {
        // Integer fields
        age: Number(data.age),

        // Double fields - Backend uses "height" and "weight" (NOT heightCm/weightKg)
        height: Number(data.height),
        weight: Number(data.weight),

        // Enum fields
        gender: BACKEND_ENUMS.gender[data.gender as Gender],
        activityLevel: BACKEND_ENUMS.activityLevel[data.activityLevel as ActivityLevel],
        sleepDuration: BACKEND_ENUMS.sleepDuration[data.sleepRange as SleepRange],
        stressLevel: BACKEND_ENUMS.stressLevel[data.stressLevel as StressLevel],

        // NOTE: 'goal' is stored separately or derived from other data
        // Backend HealthProfileRequest does not include 'goal' field
    };

    console.log('📋 [mapFrontendToBackend] Input:', data);
    console.log('📋 [mapFrontendToBackend] Output:', mapped);

    return mapped;
}

// ============================================================
// BACKEND → FRONTEND MAPPING (for loading existing profile)
// ============================================================

export function mapBackendToFrontend(data: Record<string, unknown>): Record<string, unknown> {
    const reverseGender = Object.fromEntries(
        Object.entries(BACKEND_ENUMS.gender).map(([k, v]) => [v, k])
    );
    const reverseGoal = Object.fromEntries(
        Object.entries(BACKEND_ENUMS.goal).map(([k, v]) => [v, k])
    );
    const reverseActivity = Object.fromEntries(
        Object.entries(BACKEND_ENUMS.activityLevel).map(([k, v]) => [v, k])
    );
    const reverseStress = Object.fromEntries(
        Object.entries(BACKEND_ENUMS.stressLevel).map(([k, v]) => [v, k])
    );
    const reverseSleep = Object.fromEntries(
        Object.entries(BACKEND_ENUMS.sleepDuration).map(([k, v]) => [v, k])
    );

    return {
        gender: reverseGender[data.gender as string] || Gender.MALE,
        age: data.age,
        height: data.heightCm || data.height,
        weight: data.weightKg || data.weight,
        goal: reverseGoal[data.goal as string] || Goal.MAINTENANCE,
        activityLevel: reverseActivity[data.activityLevel as string] || ActivityLevel.LIGHT,
        stressLevel: reverseStress[data.stressLevel as string] || StressLevel.MEDIUM,
        sleepRange: reverseSleep[data.sleepDuration as string] || SleepRange.SEVEN_TO_9,
    };
}
