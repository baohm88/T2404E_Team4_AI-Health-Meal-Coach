/**
 * Admin Service
 * 
 * Service functions for Admin operations.
 * Currently uses mock data, ready to integrate with real API.
 */

import {
    MOCK_ADMIN_STATS,
    MOCK_USERS_LIST,
    MOCK_FOOD_DATABASE,
    AdminUser,
    FoodItem,
} from '@/lib/mock-data';

// ============================================================
// STATS
// ============================================================

export const getStats = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_ADMIN_STATS;
};

// ============================================================
// USER MANAGEMENT
// ============================================================

export const getUsers = async (): Promise<AdminUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_USERS_LIST;
};

export const banUser = async (userId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log(`User ${userId} has been banned`);
    // In real app, this would call API
    return true;
};

export const unbanUser = async (userId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log(`User ${userId} has been unbanned`);
    return true;
};

export const getUserPlan = async (userId: number): Promise<any | null> => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/admin/users/${userId}/plan`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) return null;

        const json = await response.json();
        // Critical: Parse the serialized JSON string if necessary
        const parsedData = typeof json.data === 'string' ? JSON.parse(json.data) : json.data;
        return parsedData;
    } catch (error) {
        console.error('Error fetching user plan:', error);
        return null;
    }
};

// ============================================================
// FOOD DATABASE MANAGEMENT
// ============================================================

export const getFoods = async (): Promise<FoodItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_FOOD_DATABASE;
};

export const deleteFood = async (foodId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log(`Food ${foodId} has been deleted`);
    return true;
};

export const createFood = async (food: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newFood: FoodItem = {
        ...food,
        id: `f${Date.now()}`,
    };
    console.log('Food created:', newFood);
    return newFood;
};

export const updateFood = async (foodId: string, data: Partial<FoodItem>): Promise<FoodItem | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const food = MOCK_FOOD_DATABASE.find((f) => f.id === foodId);
    if (!food) return null;
    console.log(`Food ${foodId} updated:`, data);
    return { ...food, ...data };
};
