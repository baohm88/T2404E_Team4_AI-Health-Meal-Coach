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
    sort: string = 'id,desc'
): Promise<PageResponse<AdminUser>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort
    });
    if (keyword) {
        params.append('keyword', keyword);
    }

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
