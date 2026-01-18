/**
 * Meal Schedule Service
 *
 * Handles API calls and mock data for meal scheduling feature.
 * Currently uses mock data for UI development.
 *
 * @see /types/meal-schedule.ts - Type definitions
 * @see /lib/constants/schedule.constants.ts - Constants
 */

import {
    WeeklySchedule,
    DaySummary,
    ScheduledMeal,
    ScheduleAdjustment,
    GenerateScheduleParams,
    ActualMealInput,
    DeviationParams,
    MealType,
} from '@/types/meal-schedule';
import {
    MEAL_TYPE_CONFIG,
    VIETNAMESE_DAYS,
    SCHEDULE_THRESHOLDS,
} from '@/lib/constants/schedule.constants';

// ============================================================
// MOCK DATA GENERATOR
// ============================================================

/**
 * Vietnamese meal database for generating realistic schedules
 */
const VIETNAMESE_MEALS: Record<MealType, Array<{
    title: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}>> = {
    breakfast: [
        { title: 'Phở bò tái', description: 'Phở bò tái + rau thơm + giá đỗ', calories: 450, protein: 25, carbs: 55, fat: 12 },
        { title: 'Bánh mì trứng', description: 'Bánh mì ốp la + sữa đậu nành', calories: 420, protein: 18, carbs: 50, fat: 15 },
        { title: 'Cháo gà', description: 'Cháo gà + hành phi + gừng', calories: 380, protein: 22, carbs: 45, fat: 10 },
        { title: 'Xôi gà', description: 'Xôi gà xé + hành phi', calories: 480, protein: 28, carbs: 52, fat: 16 },
        { title: 'Bánh cuốn', description: 'Bánh cuốn nhân thịt + chả quế', calories: 400, protein: 20, carbs: 48, fat: 14 },
        { title: 'Bún riêu cua', description: 'Bún riêu cua + đậu phụ + rau', calories: 420, protein: 22, carbs: 50, fat: 12 },
        { title: 'Hủ tiếu Nam Vang', description: 'Hủ tiếu + tôm + thịt + gan', calories: 460, protein: 26, carbs: 52, fat: 14 },
    ],
    lunch: [
        { title: 'Cơm gà xối mỡ', description: 'Cơm + đùi gà chiên giòn + canh rau', calories: 680, protein: 35, carbs: 70, fat: 25 },
        { title: 'Cơm sườn nướng', description: 'Cơm + sườn nướng + dưa chua + canh', calories: 720, protein: 38, carbs: 72, fat: 28 },
        { title: 'Bún chả Hà Nội', description: 'Bún + chả nướng + nem + rau sống', calories: 580, protein: 30, carbs: 60, fat: 22 },
        { title: 'Cơm tấm sườn', description: 'Cơm tấm + sườn bì chả + canh', calories: 700, protein: 36, carbs: 68, fat: 26 },
        { title: 'Mì xào bò', description: 'Mì trứng xào + bò + rau cải', calories: 620, protein: 32, carbs: 65, fat: 23 },
        { title: 'Cơm rang dương châu', description: 'Cơm rang + tôm + trứng + lạp xưởng', calories: 650, protein: 28, carbs: 72, fat: 24 },
        { title: 'Bún bò Huế', description: 'Bún bò + giò heo + chả cua', calories: 600, protein: 35, carbs: 58, fat: 22 },
    ],
    snack: [
        { title: 'Sữa chua Hy Lạp', description: 'Sữa chua + hạt chia + mật ong', calories: 180, protein: 12, carbs: 18, fat: 6 },
        { title: 'Trái cây hỗn hợp', description: 'Táo + chuối + cam', calories: 150, protein: 2, carbs: 35, fat: 1 },
        { title: 'Bánh protein', description: 'Protein bar homemade', calories: 200, protein: 15, carbs: 20, fat: 8 },
        { title: 'Sinh tố bơ', description: 'Bơ + sữa tươi + mật ong', calories: 250, protein: 8, carbs: 25, fat: 14 },
        { title: 'Hạt hạnh nhân', description: '30g hạt hạnh nhân rang', calories: 180, protein: 6, carbs: 6, fat: 16 },
        { title: 'Trứng luộc', description: '2 quả trứng gà luộc', calories: 156, protein: 12, carbs: 1, fat: 10 },
        { title: 'Chuối + bơ đậu phộng', description: '1 quả chuối + 1 muỗng bơ', calories: 220, protein: 6, carbs: 28, fat: 10 },
    ],
    dinner: [
        { title: 'Cá hồi nướng', description: 'Cá hồi nướng + salad + khoai lang', calories: 520, protein: 38, carbs: 35, fat: 22 },
        { title: 'Canh chua cá lóc', description: 'Canh chua + cơm gạo lứt + rau luộc', calories: 450, protein: 32, carbs: 45, fat: 12 },
        { title: 'Thịt kho tàu', description: 'Thịt kho + cơm + canh rau', calories: 580, protein: 30, carbs: 55, fat: 24 },
        { title: 'Gà hấp lá chanh', description: 'Gà hấp + cơm + rau luộc', calories: 480, protein: 35, carbs: 42, fat: 18 },
        { title: 'Đậu phụ sốt cà', description: 'Đậu phụ + cơm + canh rau', calories: 420, protein: 22, carbs: 50, fat: 14 },
        { title: 'Bò lúc lắc', description: 'Bò xào + khoai tây + salad', calories: 550, protein: 38, carbs: 38, fat: 25 },
        { title: 'Cá kho tộ', description: 'Cá kho + cơm + canh cải', calories: 500, protein: 34, carbs: 48, fat: 18 },
    ],
};

/**
 * Generate a unique ID
 */
const generateId = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Get date string in YYYY-MM-DD format
 */
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

/**
 * Generate a single day's meals
 */
const generateDayMeals = (
    date: Date,
    targetCalories: number,
    mealsPerDay: number
): ScheduledMeal[] => {
    const mealTypes: MealType[] = mealsPerDay === 3
        ? ['breakfast', 'lunch', 'dinner']
        : mealsPerDay === 4
            ? ['breakfast', 'lunch', 'snack', 'dinner']
            : ['breakfast', 'snack', 'lunch', 'snack', 'dinner'];

    const dateStr = formatDate(date);
    const now = new Date();
    const isToday = formatDate(now) === dateStr;
    const isPast = date < now && !isToday;

    return mealTypes.map((mealType, index) => {
        const mealOptions = VIETNAMESE_MEALS[mealType];
        const meal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
        const config = MEAL_TYPE_CONFIG[mealType];

        // Adjust calories to fit target (rough distribution)
        const calorieMultiplier = targetCalories / 2400; // Base meals designed for ~2400 kcal
        const adjustedCalories = Math.round(meal.calories * calorieMultiplier);

        // Determine status based on date
        let status: ScheduledMeal['status'] = 'upcoming';
        if (isPast) {
            status = Math.random() > 0.1 ? 'completed' : 'skipped'; // 90% completion rate
        } else if (isToday) {
            const mealHour = parseInt(config.defaultTime.split(':')[0]);
            const currentHour = now.getHours();
            if (currentHour > mealHour + 1) {
                status = 'completed';
            }
        }

        return {
            id: generateId('meal'),
            date: dateStr,
            mealType,
            title: meal.title,
            description: meal.description,
            calories: adjustedCalories,
            protein: Math.round(meal.protein * calorieMultiplier),
            carbs: Math.round(meal.carbs * calorieMultiplier),
            fat: Math.round(meal.fat * calorieMultiplier),
            status,
            scheduledTime: config.defaultTime,
        };
    });
};

/**
 * Generate a 7-day meal schedule
 */
const generateMockSchedule = (params: GenerateScheduleParams): WeeklySchedule => {
    const startDate = params.startDate ? new Date(params.startDate) : new Date();
    startDate.setHours(0, 0, 0, 0);

    const days: DaySummary[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const meals = generateDayMeals(date, params.targetCalories, params.mealsPerDay);
        const actualCalories = meals.reduce((sum, meal) => {
            if (meal.status === 'completed') {
                return sum + (meal.actualMeal?.calories || meal.calories);
            }
            return sum;
        }, 0);

        const plannedCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
        const deviation = actualCalories - params.targetCalories;

        days.push({
            date: formatDate(date),
            dayOfWeek: VIETNAMESE_DAYS[date.getDay()],
            targetCalories: params.targetCalories,
            actualCalories,
            calorieDeviation: deviation,
            isDeviated: Math.abs(deviation) > (params.targetCalories * SCHEDULE_THRESHOLDS.CALORIE_DEVIATION_PERCENT / 100),
            meals,
        });
    }

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
        id: generateId('schedule'),
        userId: params.userId,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        targetDailyCalories: params.targetCalories,
        days,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

export interface MealScheduleServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

// In-memory storage for mock implementation
let currentSchedule: WeeklySchedule | null = null;

export const mealScheduleService = {
    /**
     * Get current week's schedule
     */
    getCurrentSchedule: async (): Promise<MealScheduleServiceResponse<WeeklySchedule>> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!currentSchedule) {
            // Generate default schedule if none exists
            currentSchedule = generateMockSchedule({
                userId: 'mock_user',
                gender: 'MALE',
                weight: 72,
                height: 174,
                tdee: 2930,
                targetCalories: 2400,
                goal: 'WEIGHT_LOSS',
                preferences: 'Thích ăn thịt gà',
                restrictions: 'Không ăn được hành tây',
                mealsPerDay: 4,
            });
        }

        return {
            success: true,
            message: 'Tải lịch ăn thành công',
            data: currentSchedule,
        };
    },

    /**
     * Generate new 7-day schedule via AI
     */
    generateSchedule: async (
        params: GenerateScheduleParams
    ): Promise<MealScheduleServiceResponse<WeeklySchedule>> => {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        currentSchedule = generateMockSchedule(params);

        return {
            success: true,
            message: 'Đã tạo lịch ăn 7 ngày thành công!',
            data: currentSchedule,
        };
    },

    /**
     * Check-in a meal (confirm actual consumption)
     */
    checkInMeal: async (
        mealId: string,
        actualMeal?: ActualMealInput
    ): Promise<MealScheduleServiceResponse<ScheduledMeal>> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!currentSchedule) {
            return {
                success: false,
                message: 'Không tìm thấy lịch ăn',
            };
        }

        // Find and update the meal
        for (const day of currentSchedule.days) {
            const meal = day.meals.find(m => m.id === mealId);
            if (meal) {
                if (actualMeal) {
                    meal.status = 'modified';
                    meal.actualMeal = {
                        ...actualMeal,
                        protein: actualMeal.protein ?? 0,
                        carbs: actualMeal.carbs ?? 0,
                        fat: actualMeal.fat ?? 0,
                        checkedInAt: new Date().toISOString(),
                    };
                    // Recalculate day totals
                    day.actualCalories = day.meals.reduce((sum, m) => {
                        if (m.status === 'completed' || m.status === 'modified') {
                            return sum + (m.actualMeal?.calories || m.calories);
                        }
                        return sum;
                    }, 0);
                    day.calorieDeviation = day.actualCalories - day.targetCalories;
                    day.isDeviated = Math.abs(day.calorieDeviation) >
                        (day.targetCalories * SCHEDULE_THRESHOLDS.CALORIE_DEVIATION_PERCENT / 100);
                } else {
                    meal.status = 'completed';
                    // Recalculate day totals
                    day.actualCalories = day.meals.reduce((sum, m) => {
                        if (m.status === 'completed' || m.status === 'modified') {
                            return sum + (m.actualMeal?.calories || m.calories);
                        }
                        return sum;
                    }, 0);
                }

                currentSchedule.updatedAt = new Date().toISOString();

                return {
                    success: true,
                    message: actualMeal ? 'Đã cập nhật bữa ăn' : 'Đã check-in thành công',
                    data: meal,
                };
            }
        }

        return {
            success: false,
            message: 'Không tìm thấy bữa ăn',
        };
    },

    /**
     * Skip a meal
     */
    skipMeal: async (mealId: string): Promise<MealScheduleServiceResponse<ScheduledMeal>> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!currentSchedule) {
            return {
                success: false,
                message: 'Không tìm thấy lịch ăn',
            };
        }

        for (const day of currentSchedule.days) {
            const meal = day.meals.find(m => m.id === mealId);
            if (meal) {
                meal.status = 'skipped';
                currentSchedule.updatedAt = new Date().toISOString();

                return {
                    success: true,
                    message: 'Đã bỏ qua bữa ăn',
                    data: meal,
                };
            }
        }

        return {
            success: false,
            message: 'Không tìm thấy bữa ăn',
        };
    },

    /**
     * Get AI adjustment when user deviates from plan
     */
    getAdjustment: async (
        params: DeviationParams
    ): Promise<MealScheduleServiceResponse<ScheduleAdjustment>> => {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const deviation = params.actualCalories - params.plannedCalories;
        const totalDeviation = params.totalDayCalories - params.targetDailyCalories;

        // Generate adjustment advice
        const advice = totalDeviation > 0
            ? `Hôm nay bạn đã nạp dư ${totalDeviation} kcal. Đừng lo, hãy uống nhiều nước, đi bộ nhẹ 30 phút, và đừng bỏ bữa sáng ngày mai. Tôi sẽ điều chỉnh 2 ngày tiếp theo cho bạn.`
            : `Bạn đang thiếu ${Math.abs(totalDeviation)} kcal. Hãy ăn thêm một bữa nhẹ giàu protein để đảm bảo đủ năng lượng.`;

        // Generate adjusted days (reduce ~500-700 kcal per day for 2 days)
        const reductionPerDay = Math.min(Math.ceil(totalDeviation / 2), 700);
        const adjustedTarget = Math.max(
            params.targetDailyCalories - reductionPerDay,
            SCHEDULE_THRESHOLDS.MIN_DAILY_CALORIES
        );

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        const adjustedDays: DaySummary[] = [tomorrow, dayAfter].map(date => {
            const meals = generateDayMeals(date, adjustedTarget, 4);
            return {
                date: formatDate(date),
                dayOfWeek: VIETNAMESE_DAYS[date.getDay()],
                targetCalories: adjustedTarget,
                actualCalories: 0,
                calorieDeviation: 0,
                isDeviated: false,
                meals,
            };
        });

        const adjustment: ScheduleAdjustment = {
            advice,
            adjustedDays,
            reason: `Điều chỉnh giảm ${reductionPerDay} kcal/ngày trong 2 ngày tới để cân bằng lại ${totalDeviation} kcal dư thừa.`,
            originalDeviation: totalDeviation,
        };

        return {
            success: true,
            message: 'Đã tạo kế hoạch điều chỉnh',
            data: adjustment,
        };
    },

    /**
     * Apply adjustment to upcoming days
     */
    applyAdjustment: async (
        adjustment: ScheduleAdjustment
    ): Promise<MealScheduleServiceResponse<WeeklySchedule>> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!currentSchedule) {
            return {
                success: false,
                message: 'Không tìm thấy lịch ăn',
            };
        }

        // Replace the days in schedule with adjusted days
        for (const adjustedDay of adjustment.adjustedDays) {
            const dayIndex = currentSchedule.days.findIndex(d => d.date === adjustedDay.date);
            if (dayIndex !== -1) {
                currentSchedule.days[dayIndex] = adjustedDay;
            }
        }

        currentSchedule.updatedAt = new Date().toISOString();

        return {
            success: true,
            message: 'Đã áp dụng điều chỉnh lịch ăn',
            data: currentSchedule,
        };
    },

    /**
     * Reset schedule (for testing)
     */
    resetSchedule: (): void => {
        currentSchedule = null;
    },
};
