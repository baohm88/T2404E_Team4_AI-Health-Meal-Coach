/**
 * Meal Schedule Types
 *
 * Type definitions for the AI-powered meal scheduling feature.
 * Includes types for meals, daily summaries, weekly schedules, and AI adjustments.
 *
 * @see /lib/constants/schedule.constants.ts - Related constants
 * @see /services/meal-schedule.service.ts - Service implementation
 */

// ============================================================
// ENUMS & BASIC TYPES
// ============================================================

/**
 * Meal types for the schedule
 */
export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

/**
 * Meal completion status
 */
export type MealStatus = 'upcoming' | 'completed' | 'skipped' | 'modified';

// ============================================================
// COMPENSATION TYPES (Xử lý ăn lố)
// ============================================================

/**
 * Exercise suggestion for calorie compensation
 */
export interface ExerciseSuggestion {
    activity: string;        // VD: "Cardio - Đi bộ nhanh"
    duration: number;        // VD: 30 (phút)
    caloriesBurned: number;  // VD: 200
}

/**
 * Diet reduction for next day compensation
 */
export interface DietReduction {
    targetDate: string;      // ISO Date (thường là ngày mai)
    reducedCalories: number; // VD: 300
}

/**
 * Compensation suggestion when user eats over limit
 * Used for late-night deviation handling
 */
export interface CompensationSuggestion {
    type: 'exercise' | 'diet_reduction' | 'both';
    exercise?: ExerciseSuggestion;
    dietReduction?: DietReduction;
    reason: string;
}

// ============================================================
// MEAL INTERFACES
// ============================================================

/**
 * Actual meal consumed by user (when different from planned)
 */
export interface ActualMeal {
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    checkedInAt: string;
}

/**
 * Single scheduled meal item
 */
export interface ScheduledMeal {
    id: string;
    date: string;              // ISO date string YYYY-MM-DD
    mealType: MealType;
    title: string;             // Tên món ăn chính
    description: string;       // Chi tiết món ăn
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    status: MealStatus;
    scheduledTime: string;     // HH:mm format

    // ✅ AI Feedback inline cho từng bữa
    aiFeedback?: string;

    // ✅ Đánh dấu bữa ăn này đã bị AI sửa đổi do bữa trước ăn lố
    isAiAdjusted?: boolean;

    // ✅ Original calories before AI adjustment (for display)
    originalCalories?: number;

    actualMeal?: ActualMeal;   // Món người dùng thực sự ăn (nếu khác plan)
}

/**
 * Daily summary with all meals
 */
export interface DaySummary {
    date: string;
    dayOfWeek: string;         // Thứ 2, Thứ 3, etc.
    targetCalories: number;
    actualCalories: number;
    calorieDeviation: number;  // positive = over, negative = under
    isDeviated: boolean;       // Vượt threshold
    meals: ScheduledMeal[];
}

/**
 * 7-day meal schedule
 */
export interface WeeklySchedule {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    targetDailyCalories: number;
    days: DaySummary[];
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// AI ADJUSTMENT TYPES
// ============================================================

/**
 * AI adjustment response when user deviates from plan
 */
export interface ScheduleAdjustment {
    advice: string;              // Lời khuyên ngắn gọn
    adjustedDays: DaySummary[];  // 2 ngày điều chỉnh
    reason: string;              // Giải thích điều chỉnh
    originalDeviation: number;   // Calorie deviation that triggered adjustment

    // ✅ NEW: Compensation for late-night deviation
    compensation?: CompensationSuggestion;
    isLateNightDeviation?: boolean;
}

/**
 * Parameters for requesting AI adjustment
 */
export interface DeviationParams {
    userId: string;
    date: string;
    mealId: string;
    mealType: MealType;          // ✅ NEW: To detect late-night
    plannedCalories: number;
    actualCalories: number;
    totalDayCalories: number;
    targetDailyCalories: number;
}

// ============================================================
// ROADMAP TYPES (Macro View)
// ============================================================

/**
 * Phase within a goal roadmap
 */
export interface Phase {
    phaseNumber: number;
    name: string;               // "Tháng 1: Làm quen"
    targetWeightLoss: number;   // 2 (kg)
    targetCaloriesPerDay: number;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'completed';
    focus: string;              // "Cardio nhẹ + Thâm hụt calo"
}

/**
 * Long-term goal roadmap (3 months)
 */
export interface GoalRoadmap {
    id: string;
    userId: string;
    goal: string;               // "Giảm 7kg trong 3 tháng"
    startWeight: number;
    targetWeight: number;
    startDate: string;
    endDate: string;
    currentPhase: number;
    phases: Phase[];
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// GENERATION TYPES
// ============================================================

/**
 * Parameters for generating a new meal plan
 */
export interface GenerateScheduleParams {
    userId: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    weight: number;              // kg
    height: number;              // cm
    tdee: number;                // Total Daily Energy Expenditure
    targetCalories: number;      // Daily calorie target
    goal: 'WEIGHT_LOSS' | 'MAINTAIN' | 'MUSCLE_GAIN';
    preferences?: string;        // Sở thích ăn uống
    restrictions?: string;       // Dị ứng/không ăn được
    mealsPerDay: number;         // Số bữa ăn mong muốn (3-5)
    startDate?: string;          // Ngày bắt đầu (default: today)
}

/**
 * Input for checking in a meal with different food
 */
export interface ActualMealInput {
    title: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

// ============================================================
// VIEW TYPES
// ============================================================

/**
 * Calendar view type for Session Grid UI
 * - week: Spreadsheet-style grid (4 sessions × 7 days)
 * - day: Detailed vertical stack with macros
 * - list: Weekly agenda list view
 */
export type CalendarView = 'week' | 'day' | 'list';
