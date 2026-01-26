/**
 * Admin Service
 * 
 * Service functions for Admin operations.
 * Integrates with real Backend API.
 */

import { http } from '@/lib/http';
import {
  AdminUser,
  CreateDishRequest,
  DishLibrary,
  MealTimeSlot,
  PageResponse,
  UpdateDishRequest
} from '@/types/admin';
import { ApiResponse } from '@/types/api';

// ============================================================
// USER MANAGEMENT
// ============================================================

export const getUsers = async (
    page: number = 0, 
    size: number = 10, 
    keyword: string = '',
    sort: string = 'id,desc',
    status?: number,
    isPremium?: boolean,
    startDate?: string,
    endDate?: string
): Promise<PageResponse<AdminUser>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort
    });
    if (keyword) params.append('keyword', keyword);
    if (status !== undefined) params.append('status', status.toString());
    if (isPremium !== undefined) params.append('isPremium', isPremium.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await http.get<any, ApiResponse<PageResponse<AdminUser>>>(`/admin/users?${params.toString()}`);
    return response.data;
};

export const toggleUserStatus = async (userId: number): Promise<void> => {
    await http.patch(`/admin/users/${userId}/toggle-status`);
};

export const togglePremiumStatus = async (userId: number): Promise<void> => {
    await http.patch(`/admin/users/${userId}/toggle-premium`);
};

export const getUserPlan = async (userId: number): Promise<any> => {
    const response = await http.get<any, ApiResponse<any>>(`/admin/users/${userId}/plan`);
    return response.data;
};

export const getUserMealPlan = async (userId: number): Promise<any> => {
    const response = await http.get<any, ApiResponse<any>>(`/admin/users/${userId}/meal-plan`);
    return response.data;
};

export const getUserDetail = async (userId: number): Promise<AdminUser> => {
    // We reuse the public endpoint if available, but AdminController doesn't have specific getById.
    // UserService has getUserById (Admin view).
    // Let's check AdminController again.
    // It calls userService.getUsers (list).
    // We need a specific getById endpoint in AdminController or we can use the list filter by ID if needed, 
    // BUT efficient way is getById.
    // UserService interface HAS getUserById.
    // AdminController needs to expose it.
    // I will add getUserById to AdminController first.
    // Wait, let's check AdminController again.
    // I need to add getUserById to AdminController too.
    const response = await http.get<any, ApiResponse<AdminUser>>(`/admin/users/${userId}`);
    return response.data;
};

// ============================================================
// FOOD DATABASE MANAGEMENT
// ============================================================

export const getDishes = async (
    page: number = 0,
    size: number = 10,
    keyword: string = '',
    category?: MealTimeSlot,
    sort: string = 'id,desc'
): Promise<PageResponse<DishLibrary>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort
    });
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);

    const response = await http.get<any, ApiResponse<PageResponse<DishLibrary>>>(`/admin/dishes?${params.toString()}`);
    return response.data;
};

export const getDishById = async (id: number): Promise<DishLibrary> => {
    const response = await http.get<any, ApiResponse<DishLibrary>>(`/admin/dishes/${id}`);
    return response.data;
};

export const createDish = async (data: CreateDishRequest): Promise<DishLibrary> => {
    const response = await http.post<any, ApiResponse<DishLibrary>>('/admin/dishes', data);
    return response.data;
};

export const updateDish = async (id: number, data: UpdateDishRequest): Promise<DishLibrary> => {
    const response = await http.put<any, ApiResponse<DishLibrary>>(`/admin/dishes/${id}`, data);
    return response.data;
};

export const toggleDishStatus = async (id: number): Promise<void> => {
    await http.patch(`/admin/dishes/${id}/toggle-status`);
};
