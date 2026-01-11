/**
 * Health Metrics Calculator
 *
 * Provides functions to calculate BMI, BMR, TDEE, and Energy Score
 * based on user's onboarding data.
 *
 * Formulas:
 * - BMI: weight / (height_m)^2
 * - BMR (Mifflin-St Jeor): Standard medical formula
 * - TDEE: BMR × activity multiplier
 * - Energy Score: Simulated based on sleep and stress
 *
 * @see /lib/schemas/onboarding.schema.ts - Data types
 * @see /lib/constants/onboarding.constants.ts - Multipliers
 */

import {
    Gender,
    ActivityLevel,
    StressLevel,
    SleepRange,
    Goal,
    WeeklyGoal,
    OnboardingData,
} from '@/lib/schemas/onboarding.schema';
import {
    ACTIVITY_MULTIPLIERS,
    WEEKLY_GOAL_VALUES,
} from '@/lib/constants/onboarding.constants';

// ============================================================
// TYPES
// ============================================================

/** BMI category classification */
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

/** Complete health metrics result */
export interface HealthMetrics {
    /** Body Mass Index */
    bmi: number;
    /** BMI category classification */
    bmiCategory: BMICategory;
    /** Basal Metabolic Rate (kcal/day) */
    bmr: number;
    /** Total Daily Energy Expenditure (kcal/day) */
    tdee: number;
    /** Energy Score (0-100) based on sleep + stress */
    energyScore: number;
    /** Recommended daily calorie intake based on goal */
    dailyCalorieGoal: number;
    /** Estimated weeks to reach target weight */
    weeksToGoal: number | null;
}

/** Input data for health calculations */
export interface HealthCalculatorInput {
    weight: number;
    height: number;
    age: number;
    gender: Gender;
    activityLevel: ActivityLevel;
    goal: Goal;
    targetWeight?: number;
    weeklyGoal?: WeeklyGoal;
    stressLevel?: StressLevel;
    sleepRange?: SleepRange;
}

// ============================================================
// BMI CALCULATION
// ============================================================

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight(kg) / height(m)^2
 */
export const calculateBMI = (weight: number, heightCm: number): number => {
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
};

/**
 * Get BMI category based on WHO classification
 */
export const getBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
};

/**
 * Get Vietnamese label for BMI category
 */
export const getBMICategoryLabel = (category: BMICategory): string => {
    const labels: Record<BMICategory, string> = {
        underweight: 'Thiếu cân',
        normal: 'Bình thường',
        overweight: 'Thừa cân',
        obese: 'Béo phì',
    };
    return labels[category];
};

/**
 * Get color for BMI category (for UI)
 */
export const getBMICategoryColor = (category: BMICategory): string => {
    const colors: Record<BMICategory, string> = {
        underweight: '#3B82F6', // blue
        normal: '#22C55E',     // green
        overweight: '#F59E0B', // amber
        obese: '#EF4444',      // red
    };
    return colors[category];
};

// ============================================================
// BMR CALCULATION (Mifflin-St Jeor Equation)
// ============================================================

/**
 * Calculate BMR using Mifflin-St Jeor equation
 *
 * Male:   BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
 * Female: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
 *
 * @returns BMR in kcal/day
 */
export const calculateBMR = (
    weight: number,
    heightCm: number,
    age: number,
    gender: Gender
): number => {
    const base = (10 * weight) + (6.25 * heightCm) - (5 * age);

    switch (gender) {
        case Gender.MALE:
            return base + 5;
        case Gender.FEMALE:
            return base - 161;
        case Gender.OTHER:
            // Use average of male and female
            return base - 78;
        default:
            return base;
    }
};

// ============================================================
// TDEE CALCULATION
// ============================================================

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * Formula: BMR × Activity Multiplier
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
    return bmr * multiplier;
};

// ============================================================
// ENERGY SCORE CALCULATION
// ============================================================

/**
 * Sleep score mapping (0-30 points)
 * Optimal sleep (7-9h) gets highest score
 */
const SLEEP_SCORES: Record<SleepRange, number> = {
    [SleepRange.LESS_THAN_5]: 5,
    [SleepRange.FIVE_TO_7]: 20,
    [SleepRange.SEVEN_TO_9]: 30,   // Optimal
    [SleepRange.MORE_THAN_9]: 15,  // Oversleeping can be negative too
};

/**
 * Stress penalty mapping (0-30 points)
 * Lower stress = lower penalty
 */
const STRESS_PENALTIES: Record<StressLevel, number> = {
    [StressLevel.LOW]: 0,
    [StressLevel.MEDIUM]: 10,
    [StressLevel.HIGH]: 20,
    [StressLevel.VERY_HIGH]: 30,
};

/**
 * Calculate Energy Score (0-100)
 *
 * Formula: Base(70) + SleepBonus(0-30) - StressPenalty(0-30)
 *
 * Example scores:
 * - 7-9h sleep + Low stress = 70 + 30 - 0 = 100
 * - 7-9h sleep + High stress = 70 + 30 - 20 = 80
 * - <5h sleep + Very High stress = 70 + 5 - 30 = 45
 */
export const calculateEnergyScore = (
    sleepRange: SleepRange = SleepRange.SEVEN_TO_9,
    stressLevel: StressLevel = StressLevel.MEDIUM
): number => {
    const baseScore = 70;
    const sleepBonus = SLEEP_SCORES[sleepRange];
    const stressPenalty = STRESS_PENALTIES[stressLevel];

    const score = baseScore + sleepBonus - stressPenalty;

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
};

/**
 * Get energy level description based on score
 */
export const getEnergyLevelLabel = (score: number): string => {
    if (score >= 85) return 'Tràn đầy năng lượng';
    if (score >= 70) return 'Năng lượng tốt';
    if (score >= 50) return 'Năng lượng trung bình';
    if (score >= 30) return 'Năng lượng thấp';
    return 'Kiệt sức';
};

/**
 * Get color for energy score (for UI gradient)
 */
export const getEnergyScoreColor = (score: number): string => {
    if (score >= 85) return '#22C55E'; // green
    if (score >= 70) return '#84CC16'; // lime
    if (score >= 50) return '#F59E0B'; // amber
    if (score >= 30) return '#F97316'; // orange
    return '#EF4444'; // red
};

// ============================================================
// CALORIE GOAL CALCULATION
// ============================================================

/** Calories per kg of body weight change */
const CALORIES_PER_KG = 7700;

/**
 * Calculate daily calorie goal based on TDEE and goal
 *
 * - WEIGHT_LOSS: TDEE - deficit (based on weekly goal)
 * - MAINTENANCE: TDEE
 * - MUSCLE_GAIN: TDEE + surplus (based on weekly goal)
 */
export const calculateDailyCalorieGoal = (
    tdee: number,
    goal: Goal,
    weeklyGoal: WeeklyGoal = WeeklyGoal.NORMAL
): number => {
    const weeklyChange = WEEKLY_GOAL_VALUES[weeklyGoal];
    const dailyChange = (weeklyChange * CALORIES_PER_KG) / 7;

    switch (goal) {
        case Goal.WEIGHT_LOSS:
            return Math.round(tdee - dailyChange);
        case Goal.MUSCLE_GAIN:
            return Math.round(tdee + dailyChange);
        case Goal.MAINTENANCE:
        default:
            return Math.round(tdee);
    }
};

/**
 * Calculate estimated weeks to reach target weight
 *
 * @returns Number of weeks, or null if maintaining
 */
export const calculateWeeksToGoal = (
    currentWeight: number,
    targetWeight: number | undefined,
    weeklyGoal: WeeklyGoal = WeeklyGoal.NORMAL,
    goal: Goal
): number | null => {
    if (goal === Goal.MAINTENANCE || !targetWeight) {
        return null;
    }

    const weightDifference = Math.abs(currentWeight - targetWeight);
    const weeklyChange = WEEKLY_GOAL_VALUES[weeklyGoal];

    return Math.ceil(weightDifference / weeklyChange);
};

// ============================================================
// MAIN CALCULATOR FUNCTION
// ============================================================

/**
 * Calculate all health metrics from onboarding data
 *
 * @param data - Partial onboarding data
 * @returns Complete health metrics, or null if required data missing
 */
export const calculateHealthMetrics = (
    data: Partial<OnboardingData>
): HealthMetrics | null => {
    // Validate required fields
    if (
        data.weight === undefined ||
        data.height === undefined ||
        data.age === undefined ||
        !data.gender ||
        !data.activityLevel ||
        !data.goal
    ) {
        return null;
    }

    const { weight, height, age, gender, activityLevel, goal } = data;

    // Calculate BMI
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);

    // Calculate BMR
    const bmr = calculateBMR(weight, height, age, gender);

    // Calculate TDEE
    const tdee = calculateTDEE(bmr, activityLevel);

    // Calculate Energy Score (with defaults if not provided)
    const energyScore = calculateEnergyScore(
        data.sleepRange ?? SleepRange.SEVEN_TO_9,
        data.stressLevel ?? StressLevel.MEDIUM
    );

    // Calculate daily calorie goal
    const dailyCalorieGoal = calculateDailyCalorieGoal(
        tdee,
        goal,
        data.weeklyGoal ?? WeeklyGoal.NORMAL
    );

    // Calculate weeks to goal
    const weeksToGoal = calculateWeeksToGoal(
        weight,
        data.targetWeight,
        data.weeklyGoal ?? WeeklyGoal.NORMAL,
        goal
    );

    return {
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        energyScore,
        dailyCalorieGoal,
        weeksToGoal,
    };
};
