/**
 * Admin Types
 *
 * Types for Admin Management features (User & Dish).
 */

import { ApiGender, ApiGoal, ApiActivity, ApiStress, ApiSleep } from './api';

// ============================================================
// USER MANAGEMENT
// ============================================================

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
    status: number; // 1 = Active, 0 = Inactive, -1 = Deleted
    isPremium: boolean;
    createdAt: string;
}

// ============================================================
// DISH MANAGEMENT
// ============================================================

export enum MealTimeSlot {
    BREAKFAST = 'BREAKFAST',
    LUNCH = 'LUNCH',
    DINNER = 'DINNER',
    SNACK = 'SNACK',
}

export interface DishLibrary {
    id: number;
    name: string;
    baseCalories: number;
    unit: string;
    category: MealTimeSlot;
    description?: string;
    isAiSuggested: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    createdAt: string;
}

export interface CreateDishRequest {
    name: string;
    baseCalories: number;
    unit: string;
    category: MealTimeSlot;
    description?: string;
}

export interface UpdateDishRequest extends CreateDishRequest {}

// ============================================================
// PAGINATION
// ============================================================

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
