import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface PlannedMealLogData {
    foodName: string;
    estimatedCalories: number;
    nutritionDetails: string;
    plannedMealId?: number;
}

class MealLogService {
    /**
     * Phân tích ảnh món ăn và lưu log (Swap)
     */
    async analyzeMealImage(file: File, plannedMealId?: number) {
        const formData = new FormData();
        formData.append('file', file);
        if (plannedMealId) {
            formData.append('plannedMealId', plannedMealId.toString());
        }
        return http.post<ApiResponse<any>>('/api/meals/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }) as any as Promise<ApiResponse<any>>;
    }

    /**
     * Xác nhận ăn đúng theo kế hoạch (Check-in nhanh)
     */
    async checkInPlannedMeal(data: PlannedMealLogData) {
        return http.post<ApiResponse<any>>('/api/meals/check-in', data) as any as Promise<ApiResponse<any>>;
    }
}

export const mealLogService = new MealLogService();
