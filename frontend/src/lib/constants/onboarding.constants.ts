/**
 * Onboarding Constants
 *
 * Contains all default values, labels, and configuration for Onboarding flow.
 * Updated to support 5-step flow with conditional Target step.
 *
 * @see /lib/schemas/onboarding.schema.ts - Zod schema & types
 */
import {
    Goal,
    ActivityLevel,
    Gender,
    StressLevel,
    WeeklyGoal,
    SleepRange,
    OnboardingData
} from '@/lib/schemas/onboarding.schema';

// ============================================================
// STEP CONFIGURATION
// ============================================================

/**
 * Enum for onboarding steps
 * Order: Basic Info → Goals → Target (conditional) → Lifestyle → Summary
 * Note: TARGET step is conditional (only shown for WEIGHT_LOSS/MUSCLE_GAIN)
 */
export enum OnboardingStep {
    INFO = 1,        // Basic info: Age, Gender, Height, Weight
    GOAL = 2,        // Goals: Weight loss, Maintenance, Muscle gain
    TARGET = 3,      // Conditional: Target weight, Weekly goal
    LIFESTYLE = 4,   // Activity level, Sleep, Stress
    ANALYSIS = 5,    // Summary/Analysis
}

/** Total number of steps (max, including conditional) */
export const TOTAL_ONBOARDING_STEPS = 5;

/** Step đầu tiên */
export const FIRST_STEP = 1;

// ============================================================
// DEFAULT VALUES
// ============================================================

/**
 * Initial form data when user starts onboarding
 * - Required fields: undefined (must select/enter)
 * - Optional fields with sensible defaults
 */
export const INITIAL_FORM_DATA: Partial<OnboardingData> = {
    goal: undefined,
    height: 170,
    weight: 65,
    age: 25,
    gender: undefined,
    activityLevel: undefined,
    targetWeight: undefined,
    weeklyGoal: undefined,
    stressLevel: undefined,
    sleepRange: undefined,
} as const;

/**
 * Default values when user clicks "Skip"
 * Safe values for AI Coach calculations
 */
export const SKIP_DEFAULT_VALUES: Required<OnboardingData> = {
    goal: Goal.MAINTENANCE,
    gender: Gender.MALE,
    height: 170,
    weight: 65,
    age: 30,
    activityLevel: ActivityLevel.LIGHT,
    targetWeight: 65, // Same as current weight for maintenance
    weeklyGoal: WeeklyGoal.NORMAL,
    stressLevel: StressLevel.MEDIUM,
    sleepRange: SleepRange.SEVEN_TO_9,
} as const;

// ============================================================
// UI LABELS (Vietnamese)
// ============================================================

export const GOAL_LABELS: Record<Goal, string> = {
    [Goal.WEIGHT_LOSS]: 'Giảm cân',
    [Goal.MAINTENANCE]: 'Duy trì',
    [Goal.MUSCLE_GAIN]: 'Tăng cân',
} as const;

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
    [ActivityLevel.SEDENTARY]: 'Ít vận động',
    [ActivityLevel.LIGHT]: 'Hoạt động nhẹ',
    [ActivityLevel.MODERATE]: 'Trung bình',
    [ActivityLevel.VERY_ACTIVE]: 'Rất năng động',
} as const;

export const ACTIVITY_DESCRIPTIONS: Record<ActivityLevel, string> = {
    [ActivityLevel.SEDENTARY]: 'Ngồi nhiều, ít tập luyện',
    [ActivityLevel.LIGHT]: 'Tập 1-3 lần/tuần',
    [ActivityLevel.MODERATE]: 'Tập 3-5 lần/tuần',
    [ActivityLevel.VERY_ACTIVE]: 'Tập hàng ngày',
} as const;

export const GENDER_LABELS: Record<Gender, string> = {
    [Gender.MALE]: 'Nam',
    [Gender.FEMALE]: 'Nữ',
    [Gender.OTHER]: 'Khác',
} as const;

export const STRESS_LABELS: Record<StressLevel, string> = {
    [StressLevel.LOW]: 'Thư giãn',
    [StressLevel.MEDIUM]: 'Bình thường',
    [StressLevel.HIGH]: 'Căng thẳng',
    [StressLevel.VERY_HIGH]: 'Rất căng thẳng',
} as const;

export const STRESS_EMOJIS: Record<StressLevel, string> = {
    [StressLevel.LOW]: '😊',
    [StressLevel.MEDIUM]: '😐',
    [StressLevel.HIGH]: '😓',
    [StressLevel.VERY_HIGH]: '😰',
} as const;

export const SLEEP_LABELS: Record<SleepRange, string> = {
    [SleepRange.LESS_THAN_5]: '< 5 giờ',
    [SleepRange.FIVE_TO_7]: '5-7 giờ',
    [SleepRange.SEVEN_TO_9]: '7-9 giờ',
    [SleepRange.MORE_THAN_9]: '> 9 giờ',
} as const;

export const WEEKLY_GOAL_LABELS: Record<WeeklyGoal, string> = {
    [WeeklyGoal.SLOW]: 'Chậm (0.25 kg/tuần)',
    [WeeklyGoal.NORMAL]: 'Vừa (0.5 kg/tuần)',
    [WeeklyGoal.FAST]: 'Nhanh (0.8 kg/tuần)',
} as const;

export const WEEKLY_GOAL_VALUES: Record<WeeklyGoal, number> = {
    [WeeklyGoal.SLOW]: 0.25,
    [WeeklyGoal.NORMAL]: 0.5,
    [WeeklyGoal.FAST]: 0.8,
} as const;

// ============================================================
// ACTIVITY MULTIPLIERS (for TDEE calculation)
// ============================================================

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHT]: 1.375,
    [ActivityLevel.MODERATE]: 1.55,
    [ActivityLevel.VERY_ACTIVE]: 1.725,
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Get Vietnamese label for goal */
export const getGoalLabel = (goal: Goal | undefined): string => {
    return goal ? GOAL_LABELS[goal] : 'Chưa chọn';
};

/** Get Vietnamese label for activity level */
export const getActivityLabel = (level: ActivityLevel | undefined): string => {
    return level ? ACTIVITY_LABELS[level] : 'Chưa chọn';
};

/** Get Vietnamese label for gender */
export const getGenderLabel = (gender: Gender | undefined): string => {
    return gender ? GENDER_LABELS[gender] : 'Chưa chọn';
};

/** Get Vietnamese label for stress level */
export const getStressLabel = (level: StressLevel | undefined): string => {
    return level ? STRESS_LABELS[level] : 'Chưa chọn';
};

/** Get emoji for stress level */
export const getStressEmoji = (level: StressLevel | undefined): string => {
    return level ? STRESS_EMOJIS[level] : '❓';
};

/** Get Vietnamese label for sleep range */
export const getSleepLabel = (range: SleepRange | undefined): string => {
    return range ? SLEEP_LABELS[range] : 'Chưa chọn';
};

/** Get Vietnamese label for weekly goal */
export const getWeeklyGoalLabel = (goal: WeeklyGoal | undefined): string => {
    return goal ? WEEKLY_GOAL_LABELS[goal] : 'Chưa chọn';
};

/** Check if goal requires target weight step */
export const requiresTargetStep = (goal: Goal | undefined): boolean => {
    return goal === Goal.WEIGHT_LOSS || goal === Goal.MUSCLE_GAIN;
};
