/**
 * Schedule Constants
 *
 * Configuration constants for the meal scheduling feature.
 * Includes meal type metadata, status colors, thresholds, and calendar config.
 *
 * @see /types/meal-schedule.ts - Type definitions
 */

import { MealType, MealStatus } from '@/types/meal-schedule';

// ============================================================
// MEAL TYPE CONFIGURATION
// ============================================================

export const MEAL_TYPE_CONFIG: Record<MealType, {
    label: string;
    icon: string;
    color: string;
    bgColor: string;
    defaultTime: string;
}> = {
    breakfast: {
        label: 'Bữa sáng',
        icon: '🌅',
        color: '#F97316',      // orange-500
        bgColor: 'bg-orange-100',
        defaultTime: '07:00',
    },
    lunch: {
        label: 'Bữa trưa',
        icon: '☀️',
        color: '#3B82F6',      // blue-500
        bgColor: 'bg-blue-100',
        defaultTime: '12:00',
    },
    snack: {
        label: 'Bữa nhẹ',
        icon: '🍎',
        color: '#22C55E',      // green-500
        bgColor: 'bg-green-100',
        defaultTime: '15:30',
    },
    dinner: {
        label: 'Bữa tối',
        icon: '🌙',
        color: '#8B5CF6',      // violet-500
        bgColor: 'bg-violet-100',
        defaultTime: '19:00',
    },
} as const;

// ============================================================
// STATUS CONFIGURATION
// ============================================================

export const MEAL_STATUS_CONFIG: Record<MealStatus, {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
}> = {
    upcoming: {
        label: 'Sắp tới',
        color: '#64748B',      // slate-500
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
    },
    completed: {
        label: 'Đã ăn',
        color: '#22C55E',      // green-500
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
    },
    skipped: {
        label: 'Bỏ qua',
        color: '#F59E0B',      // amber-500
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-600',
    },
    modified: {
        label: 'Đổi món',
        color: '#EF4444',      // red-500
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
    },
} as const;

// ============================================================
// THRESHOLD & LIMITS
// ============================================================

export const SCHEDULE_THRESHOLDS = {
    /** Percentage of daily target to trigger adjustment alert */
    CALORIE_DEVIATION_PERCENT: 20,

    /** Minimum daily calories (BMR) - never cut below this */
    MIN_DAILY_CALORIES: 1600,

    /** Maximum daily calories - warning threshold */
    MAX_DAILY_CALORIES: 3500,

    /** Number of days to adjust after deviation */
    ADJUSTMENT_DAYS: 2,

    /** Minimum meals per day */
    MIN_MEALS_PER_DAY: 3,

    /** Maximum meals per day */
    MAX_MEALS_PER_DAY: 6,
} as const;

// ============================================================
// CALENDAR CONFIGURATION
// ============================================================

export const CALENDAR_CONFIG = {
    /** Default calendar view for Session Grid UI */
    DEFAULT_VIEW: 'week' as const,
} as const;


// ============================================================
// VIETNAMESE DAY NAMES
// ============================================================

export const VIETNAMESE_DAYS = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
] as const;

export const VIETNAMESE_DAYS_SHORT = [
    'CN',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
] as const;

// ============================================================
// MESSAGES & LABELS
// ============================================================

export const SCHEDULE_MESSAGES = {
    GENERATE_SUCCESS: 'Đã tạo Lộ trình dinh dưỡng 7 ngày thành công!',
    GENERATE_ERROR: 'Không thể tạo Lộ trình dinh dưỡng Vui lòng thử lại.',
    CHECKIN_SUCCESS: 'Đã check-in bữa ăn thành công!',
    CHECKIN_ERROR: 'Không thể check-in bữa ăn.',
    ADJUSTMENT_APPLIED: 'Đã áp dụng điều chỉnh Lộ trình dinh dưỡng.',
    DEVIATION_ALERT: 'Bạn đã vượt mức calo cho phép hôm nay!',
    NO_SCHEDULE: 'Chưa có Lộ trình dinh dưỡng. Hãy tạo lịch mới!',
    LOADING: 'Đang tải Lộ trình dinh dưỡng...',
} as const;

// ============================================================
// AI PROMPT TEMPLATES
// ============================================================

export const AI_PROMPT_TEMPLATES = {
    /** Template for generating initial 7-day meal plan */
    GENERATE_PLAN: `Role: Bạn là một chuyên gia dinh dưỡng AI (AI Nutrition Coach).

Input Data (Dữ liệu người dùng):
- Giới tính: {{gender}}
- Cân nặng: {{weight}}kg, Chiều cao: {{height}}cm
- TDEE (Năng lượng tiêu thụ mỗi ngày): {{tdee}} kcal
- Mục tiêu: {{goal}}, target calorie mỗi ngày là {{targetCalories}} kcal
- Sở thích: {{preferences}}
- Số bữa ăn mong muốn: {{mealsPerDay}} bữa

Task: Hãy tạo ra một thực đơn chi tiết trong 7 ngày. Các món ăn phải phù hợp với văn hóa ẩm thực Việt Nam (dễ nấu, nguyên liệu dễ tìm). Đảm bảo tổng calo mỗi ngày dao động quanh mức {{targetCalories}} kcal.

Output Format: Chỉ trả về kết quả dưới dạng JSON theo cấu trúc WeeklySchedule.`,

    /** Template for adjustment when user deviates */
    ADJUST_PLAN: `Context: Người dùng đang theo kế hoạch {{goal}} (Target {{targetCalories}} kcal/ngày).

Vấn đề: Hôm nay ({{dayOfWeek}}), vào {{mealType}}, người dùng đã ăn "{{actualMeal}}" (khoảng {{actualCalories}} kcal). 
Hậu quả: Tổng calo hôm nay đã lên {{totalDayCalories}} kcal (Vượt {{deviation}} kcal).

Task:
1. Đưa ra lời khuyên ngắn gọn ngay lập tức
2. Điều chỉnh lại thực đơn của 2 ngày tiếp theo để cân bằng lại lượng calo dư thừa
3. Không được cắt giảm quá mức gây mệt mỏi (không dưới BMR {{minCalories}} kcal)

Output: Trả về JSON với advice (string) và adjustedDays (2 ngày điều chỉnh).`,
} as const;
