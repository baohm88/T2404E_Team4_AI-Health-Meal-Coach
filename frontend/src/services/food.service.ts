// Food Service - Mock API for food database
// TODO: Replace with real API when Backend Dish Search Endpoint for Users is ready.
// Currently only Admin has Dish Management API.
import { FoodItem, MOCK_FOOD_DATABASE } from '@/lib/mock-data';

export const foodService = {
    // Search foods by name
    searchFood: async (query: string): Promise<FoodItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = MOCK_FOOD_DATABASE.filter((food) =>
                    food.name.toLowerCase().includes(query.toLowerCase())
                );
                resolve(results);
            }, 300);
        });
    },

    // Get foods by category
    getFoodByCategory: async (category?: string): Promise<FoodItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!category || category === 'all') {
                    resolve(MOCK_FOOD_DATABASE);
                } else {
                    const results = MOCK_FOOD_DATABASE.filter((food) => food.category === category);
                    resolve(results);
                }
            }, 300);
        });
    },

    // Get saved foods
    getSavedFoods: async (): Promise<FoodItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = MOCK_FOOD_DATABASE.filter((food) => food.isSaved);
                resolve(results);
            }, 300);
        });
    },

    // Get all foods
    getAllFoods: async (): Promise<FoodItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_FOOD_DATABASE);
            }, 300);
        });
    },
};
