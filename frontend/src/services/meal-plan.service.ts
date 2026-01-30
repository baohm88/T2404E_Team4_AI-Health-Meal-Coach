import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface Meal {
    id: number;
    plannedMealId?: number;
    mealName: string;
    quantity: string;
    calories: number;
    plannedCalories: number;
    type: string;
    checkedIn?: boolean;
}

export interface DayPlan {
    day: number;
    meals: Meal[];
    totalCalories: number;
    totalPlannedCalories: number;
}

export interface MonthDetail {
    month: number;
    title: string;
    dailyCalories: number;
    note: string;
}

export interface MonthlyPlan {
    goal: string;
    totalTargetWeightChangeKg: number;
    months: MonthDetail[];
}

export interface MealPlanResponse {
    startDate: string;
    totalDays: number;
    mealPlan: DayPlan[];
    monthlyPlan?: MonthlyPlan;
}

export const mealPlanService = {
    /**
     * Lấy kế hoạch bữa ăn hiện tại của người dùng
     */
    getMealPlan: async (): Promise<ApiResponse<MealPlanResponse>> => {
        return http.get('/meal-plans');
    },

    /**
     * Tạo kế hoạch bữa ăn mới
     */
    generateMealPlan: async (): Promise<ApiResponse<MealPlanResponse>> => {
        return http.post('/meal-plans');
    },

    /**
     * Tái tạo kế hoạch bữa ăn
     */
    regenerateMealPlan: async (): Promise<ApiResponse<MealPlanResponse>> => {
        return http.put('/meal-plans');
    },

    /**
     * Mở rộng kế hoạch thêm 7 ngày
     */
    extendMealPlan: async (): Promise<ApiResponse<MealPlanResponse>> => {
        return http.patch('/meal-plans/extend');
    },

    /**
     * Reset lộ trình về tuần 1
     */
    resetMealPlan: async (): Promise<ApiResponse<MealPlanResponse>> => {
        return http.post('/meal-plans/reset');
    },

    /**
     * Không còn cần parse phức tạp vì backend đã trả về object chuẩn
     */
    parsePlanJson: (data: any): MealPlanResponse => {
        return data as MealPlanResponse;
    }
};
