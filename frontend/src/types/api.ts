/**
 * API Types
 *
 * Type definitions for backend API integration.
 * Backend base URL: http://localhost:8080
 *
 * @see /lib/http.ts - Axios HTTP client
 * @see /services/*.ts - Service implementations
 */

// ============================================================
// API WRAPPER RESPONSE
// ============================================================

/**
 * Standard API response wrapper from backend
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

// ============================================================
// AUTH TYPES
// ============================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
}

/**
 * Auth data returned from login/register
 * Note: Backend only returns token, user info can be decoded from JWT if needed
 */
export interface AuthData {
    token: string;
    // user is optional - may not be returned by backend
    user?: AuthUser;
}

// ============================================================
// BACKEND ENUMS (Case-sensitive as required by API)
// ============================================================

/**
 * Backend Gender enum
 * Maps 1:1 with frontend Gender enum
 */
export enum ApiGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

/**
 * Backend Goal enum (GoalType.java)
 * Maps 1:1 with frontend Goal enum
 */
export enum ApiGoal {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MAINTENANCE = 'MAINTENANCE',  // NOT "MAINTAIN"
    MUSCLE_GAIN = 'MUSCLE_GAIN',
}

/**
 * Backend Activity Level enum (ActivityLevel.java)
 * Backend uses simple names: SEDENTARY, LIGHT, MODERATE, VERY_ACTIVE
 */
export enum ApiActivity {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',        // NOT "LIGHTLY_ACTIVE"
    MODERATE = 'MODERATE',  // NOT "MODERATELY_ACTIVE"
    VERY_ACTIVE = 'VERY_ACTIVE',
}

/**
 * Backend Stress Level enum
 * Maps 1:1 with frontend StressLevel enum
 */
export enum ApiStress {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH',
}

/**
 * Backend Sleep Duration enum
 * Note: Different naming than frontend (underscores instead of TO)
 */
export enum ApiSleep {
    LESS_THAN_FIVE = 'LESS_THAN_FIVE',
    FIVE_TO_SEVEN = 'FIVE_TO_SEVEN',
    SEVEN_TO_NINE = 'SEVEN_TO_NINE',
    MORE_THAN_NINE = 'MORE_THAN_NINE',
}

// ============================================================
// HEALTH PROFILE TYPES
// ============================================================

export interface CreateHealthProfileRequest {
    gender: ApiGender;
    age: number;
    height: number;
    weight: number;
    // NOTE: Backend HealthProfileRequest does NOT have 'goal' field
    // Goal is handled separately via AI analysis
    activityLevel: ApiActivity;
    stressLevel: ApiStress;
    sleepDuration: ApiSleep;
}

export interface HealthProfileResponse {
    id: string;
    userId: string;
    gender: ApiGender;
    age: number;
    height: number;
    weight: number;
    goal: ApiGoal;
    activityLevel: ApiActivity;
    stressLevel: ApiStress;
    sleepDuration: ApiSleep;
    createdAt: string;
    updatedAt: string;
}

export interface CaloriesSummary {
    eaten: number;
    burned: number;
    goal: number;
    remaining: number;
}

export interface WaterSummary {
    current: number;
    goal: number;
}

export interface MacroNutrient {
    current: number;
    goal: number;
}

export interface MacrosSummary {
    protein: MacroNutrient;
    carbs: MacroNutrient;
    fat: MacroNutrient;
}

export interface TrendPoint {
    date: string;
    eaten: number;
    goal: number;
}

export interface NextStrategicMeal {
    id: number;
    plannedMealId?: number;
    mealName: string;
    type: string;
    calories: number;
    plannedCalories: number;
    day: number;
    checkedIn: boolean;
}

export interface WeeklyProgress {
    currentDay: number;
    totalDays: number;
    cumulativeDiff: number;
}

export interface DashboardSummary {
    calories: CaloriesSummary;
    water: WaterSummary;
    macros: MacrosSummary;
    trendData?: TrendPoint[];
    nextMeal?: NextStrategicMeal;
    weeklyProgress?: WeeklyProgress;
}

/**
 * Default dashboard values when API returns empty
 */
export const DEFAULT_DASHBOARD_SUMMARY: DashboardSummary = {
    calories: { eaten: 0, burned: 0, goal: 2000, remaining: 2000 },
    water: { current: 0, goal: 8 },
    macros: {
        protein: { current: 0, goal: 150 },
        carbs: { current: 0, goal: 250 },
        fat: { current: 0, goal: 65 },
    },
    trendData: [],
};
