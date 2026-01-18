/**
 * AI Adjustment Utilities
 *
 * Contains algorithms for real-time meal adjustment when user deviates from plan.
 * Includes same-day recalculation and late-night compensation logic.
 *
 * @see /types/meal-schedule.ts - Type definitions
 * @see /hooks/use-meal-schedule.ts - Integration point
 */

import {
    ScheduledMeal,
    DaySummary,
    CompensationSuggestion,
    MealType,
} from '@/types/meal-schedule';
import { SCHEDULE_THRESHOLDS } from '@/lib/constants/schedule.constants';

// ============================================================
// CONSTANTS
// ============================================================

/** Minimum threshold to trigger adjustment (kcal) */
const MIN_DEVIATION_THRESHOLD = 50;

/** Meal order for determining "remaining" meals */
const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

// ============================================================
// SAME-DAY RECALCULATION
// ============================================================

/**
 * Result of same-day recalculation
 */
export interface RecalculationResult {
    updatedMeals: ScheduledMeal[];
    adjustedMealsCount: number;
    totalReduction: number;
    isLateNight: boolean;
    feedback: string;
}

/**
 * Tự động tính toán lại các bữa còn lại trong ngày khi có bữa ăn lố
 *
 * @param currentDay - Dữ liệu ngày hiện tại
 * @param deviatedMealId - ID của bữa ăn vừa bị check-in lố
 * @param deviationAmount - Lượng calo thừa (VD: +200)
 * @returns Updated meals array and metadata
 */
export const recalculateSameDayMeals = (
    currentDay: DaySummary,
    deviatedMealId: string,
    deviationAmount: number
): RecalculationResult => {
    // 1. If deviation is too small, don't adjust
    if (deviationAmount <= MIN_DEVIATION_THRESHOLD) {
        return {
            updatedMeals: currentDay.meals,
            adjustedMealsCount: 0,
            totalReduction: 0,
            isLateNight: false,
            feedback: '',
        };
    }

    // 2. Copy mảng bữa ăn để không mutate trực tiếp
    let updatedMeals = [...currentDay.meals];

    // 3. Tìm bữa ăn bị lố
    const deviatedMealIndex = updatedMeals.findIndex(m => m.id === deviatedMealId);
    if (deviatedMealIndex === -1) {
        return {
            updatedMeals,
            adjustedMealsCount: 0,
            totalReduction: 0,
            isLateNight: false,
            feedback: 'Không tìm thấy bữa ăn',
        };
    }

    const deviatedMeal = updatedMeals[deviatedMealIndex];

    // 4. Tìm các bữa ăn "Tương lai" (Sau bữa bị lố và chưa ăn)
    const remainingMeals = updatedMeals.filter((meal, index) =>
        index > deviatedMealIndex && meal.status === 'upcoming'
    );

    // 5. Check if this is late-night (dinner) deviation
    const isLateNight = deviatedMeal.mealType === 'dinner' || remainingMeals.length === 0;

    if (isLateNight) {
        // Case: Ăn lố bữa cuối ngày (Dinner) -> Cần xử lý Late-night logic
        return {
            updatedMeals,
            adjustedMealsCount: 0,
            totalReduction: 0,
            isLateNight: true,
            feedback: `Bạn đã nạp dư ${deviationAmount} kcal vào bữa tối. Cần bù trừ vào ngày mai.`,
        };
    }

    // 6. Phân bổ lượng calo cần cắt giảm
    const reductionPerMeal = Math.floor(deviationAmount / remainingMeals.length);

    // 7. Calculate minimum calories per meal (don't reduce below 30% of original)
    const MIN_MEAL_PERCENT = 0.3;

    let actualTotalReduction = 0;
    let adjustedCount = 0;

    // 8. Cập nhật các bữa còn lại
    updatedMeals = updatedMeals.map((meal, index) => {
        // Chỉ sửa các bữa nằm sau bữa lố và còn upcoming
        if (index > deviatedMealIndex && meal.status === 'upcoming') {
            const minCalories = Math.floor(meal.calories * MIN_MEAL_PERCENT);
            const maxReduction = meal.calories - minCalories;
            const actualReduction = Math.min(reductionPerMeal, maxReduction);
            const newCalories = meal.calories - actualReduction;

            actualTotalReduction += actualReduction;
            adjustedCount++;

            return {
                ...meal,
                originalCalories: meal.originalCalories || meal.calories, // Preserve original
                calories: newCalories,
                isAiAdjusted: true,
                aiFeedback: `Đã giảm ${actualReduction} kcal do bữa ${getMealTypeName(deviatedMeal.mealType)} nạp dư.`,
                title: actualReduction > 100
                    ? `${meal.title} (Khẩu phần nhỏ)`
                    : meal.title,
            };
        }
        return meal;
    });

    return {
        updatedMeals,
        adjustedMealsCount: adjustedCount,
        totalReduction: actualTotalReduction,
        isLateNight: false,
        feedback: `AI đã tự động giảm ${actualTotalReduction} kcal từ ${adjustedCount} bữa ăn còn lại.`,
    };
};

// ============================================================
// LATE-NIGHT COMPENSATION
// ============================================================

/**
 * Generate compensation suggestion for late-night deviation
 *
 * @param deviation - Amount of calories over limit
 * @param tomorrowDate - ISO date string for tomorrow
 * @returns Compensation suggestion
 */
export const generateLateNightCompensation = (
    deviation: number,
    tomorrowDate: string
): CompensationSuggestion => {
    const bmr = SCHEDULE_THRESHOLDS.MIN_DAILY_CALORIES;

    if (deviation <= 300) {
        // Nhỏ: Chỉ cần giảm calo ngày mai
        return {
            type: 'diet_reduction',
            dietReduction: {
                targetDate: tomorrowDate,
                reducedCalories: deviation,
            },
            reason: `Giảm ${deviation} kcal vào ngày mai để cân bằng. Đừng lo, bạn vẫn đang trên đường đúng hướng!`,
        };
    } else if (deviation <= 600) {
        // Trung bình: Kết hợp tập và giảm ăn
        const exerciseCalories = 200;
        const dietCalories = deviation - exerciseCalories;

        return {
            type: 'both',
            exercise: {
                activity: 'Cardio - Đi bộ nhanh',
                duration: 30,
                caloriesBurned: exerciseCalories,
            },
            dietReduction: {
                targetDate: tomorrowDate,
                reducedCalories: dietCalories,
            },
            reason: `Đi bộ 30 phút sáng mai (đốt ${exerciseCalories} kcal) + giảm ${dietCalories} kcal trong ngày.`,
        };
    } else if (deviation <= 1000) {
        // Cao: Cardio mạnh hơn + giảm ăn 2 ngày
        const exerciseCalories = 300;
        const dietCalories = Math.ceil((deviation - exerciseCalories) / 2);

        return {
            type: 'both',
            exercise: {
                activity: 'HIIT - Tập cường độ cao',
                duration: 25,
                caloriesBurned: exerciseCalories,
            },
            dietReduction: {
                targetDate: tomorrowDate,
                reducedCalories: dietCalories,
            },
            reason: `Tập HIIT 25 phút (đốt ${exerciseCalories} kcal) + giảm ${dietCalories} kcal/ngày trong 2 ngày tới.`,
        };
    } else {
        // Rất cao (buffet, tiệc): Cần effort nhiều hơn
        const exerciseCalories = 400;
        const dietCalories = Math.ceil((deviation - exerciseCalories) / 2);

        return {
            type: 'both',
            exercise: {
                activity: 'Cardio mạnh - Chạy bộ/Đạp xe',
                duration: 45,
                caloriesBurned: exerciseCalories,
            },
            dietReduction: {
                targetDate: tomorrowDate,
                reducedCalories: Math.min(dietCalories, 500), // Max 500 per day
            },
            reason: `Wow, bữa tiệc thịnh soạn! 🎉 Cardio 45 phút sáng mai + ăn nhẹ 2 ngày tới. Đừng bỏ bữa sáng nhé!`,
        };
    }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get Vietnamese name for meal type
 */
export const getMealTypeName = (type: MealType): string => {
    const names: Record<MealType, string> = {
        breakfast: 'sáng',
        lunch: 'trưa',
        snack: 'nhẹ',
        dinner: 'tối',
    };
    return names[type];
};

/**
 * Check if a meal is the last meal of the day
 */
export const isLastMealOfDay = (meal: ScheduledMeal, allMeals: ScheduledMeal[]): boolean => {
    const remainingUpcoming = allMeals.filter(
        m => m.scheduledTime > meal.scheduledTime && m.status === 'upcoming'
    );
    return remainingUpcoming.length === 0;
};

/**
 * Calculate total deviation for a day
 */
export const calculateDayDeviation = (day: DaySummary): number => {
    const actualTotal = day.meals.reduce((sum, meal) => {
        if (meal.status === 'completed' || meal.status === 'modified') {
            return sum + (meal.actualMeal?.calories || meal.calories);
        }
        return sum;
    }, 0);

    return actualTotal - day.targetCalories;
};

/**
 * Get tomorrow's date as ISO string
 */
export const getTomorrowDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

/**
 * Check if deviation exceeds threshold percentage
 */
export const isDeviationSignificant = (
    deviation: number,
    targetCalories: number,
    thresholdPercent: number = SCHEDULE_THRESHOLDS.CALORIE_DEVIATION_PERCENT
): boolean => {
    return Math.abs(deviation) > (targetCalories * thresholdPercent / 100);
};
