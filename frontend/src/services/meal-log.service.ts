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
    async analyzeMealImage(file: File, plannedMealId?: number, category?: string) {
        const formData = new FormData();
        formData.append('file', file);
        if (plannedMealId) {
            formData.append('plannedMealId', plannedMealId.toString());
        }
        if (category) {
            formData.append('category', category);
        }
        return http.post<ApiResponse<any>>('/meals/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }) as any as Promise<ApiResponse<any>>;
    }

    /**
     * Phân tích văn bản/giọng nói và lưu log (Swap)
     */
    async analyzeMealText(text: string, plannedMealId?: number, category?: string) {
        return http.post<ApiResponse<any>>('/meals/analyze-text', null, {
            params: { text, plannedMealId, category }
        }) as any as Promise<ApiResponse<any>>;
    }

    /**
     * Tìm kiếm món ăn trong thư viện
     */
    async searchDishes(keyword?: string, category?: string, page = 0, size = 10) {
        return http.get<ApiResponse<any>>('/meals/search-dishes', {
            params: { keyword, category, page, size }
        }) as any as Promise<ApiResponse<any>>;
    }

    /**
     * Xác nhận ăn đúng theo kế hoạch (Xác nhận data từ AI hoặc thư viện)
     */
    async checkInByData(data: any) {
        return http.post<ApiResponse<any>>('/meals/check-in', data) as any as Promise<ApiResponse<any>>;
    }

    /**
     * Xác nhận ăn đúng theo kế hoạch (Check-in nhanh)
     */
    async checkInPlannedMeal(data: PlannedMealLogData) {
        return http.post<ApiResponse<any>>('/meals/check-in', data) as any as Promise<ApiResponse<any>>;
    }

    /**
     * Xác nhận ăn theo kế hoạch bằng ID log
     */
    async checkInPlannedMealById(logId: number) {
        return http.post<ApiResponse<any>>(`/meals/${logId}/check-in`, {}) as any as Promise<ApiResponse<any>>;
    }
}

export const mealLogService = new MealLogService();
