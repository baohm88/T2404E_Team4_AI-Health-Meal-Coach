/**
 * Admin Types
 *
 * Types for Admin Management features (User & Dish).
 */


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
    imageUrl?: string;
    createdAt: string;
}

export interface CreateDishRequest {
    name: string;
    baseCalories: number;
    unit: string;
    category: MealTimeSlot;
    description?: string;
}

export interface UpdateDishRequest extends CreateDishRequest { }

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

// ============================================================
// DASHBOARD
// ============================================================

export interface AdminDashboardActivity {
    id: string;
    type: 'user_register' | 'food_added' | 'report_created' | 'user_banned';
    description: string;
    user: string;
    timestamp: string;
}

export interface AdminDashboardResponse {
    totalUsers: number;
    activeToday: number;
    totalFoods: number;
    totalReports: number;
    userTypeStats: Record<string, number>;
    systemOverview: {
        users: { active: number; locked: number };
        foods: { verified: number; unverified: number };
        accounts: { premium: number; free: number };
    };
    registrationStats: { day: string; users: number }[];
    premiumRegistrationStats: { day: string; premium: number }[];
    foodGrowthStats: { day: string; foods: number }[];
    recentActivities: AdminDashboardActivity[];
}

// ============================================================
// TRANSACTION & REVENUE
// ============================================================

export interface Transaction {
    transactionId: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    amount: number;
    isPremium: boolean;
    paidAt: string;
    error?: string;
    userEmail: string;
    userName: string;
}

export interface RevenueStats {
    totalRevenue: number;
    chartData: {
        name: string;
        value: number;
    }[];
}
