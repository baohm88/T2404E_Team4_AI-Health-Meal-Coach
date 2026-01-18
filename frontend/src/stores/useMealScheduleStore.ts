/**
 * Meal Schedule Store
 *
 * Zustand store for meal schedule state management.
 * Handles schedule data, UI state, and actions.
 *
 * @see /types/meal-schedule.ts - Type definitions
 * @see /services/meal-schedule.service.ts - Service layer
 */

import { create } from 'zustand';
import {
    WeeklySchedule,
    ScheduledMeal,
    ScheduleAdjustment,
    CalendarView,
} from '@/types/meal-schedule';

// ============================================================
// STORE INTERFACE
// ============================================================

interface MealScheduleState {
    // Data
    currentSchedule: WeeklySchedule | null;
    selectedMeal: ScheduledMeal | null;
    pendingAdjustment: ScheduleAdjustment | null;
    currentView: CalendarView;
    selectedDate: Date;

    // UI State
    isLoading: boolean;
    isGenerating: boolean;
    isCheckingIn: boolean;
    showMealModal: boolean;
    showCheckInModal: boolean;
    showAdjustmentAlert: boolean;
    showGeneratePanel: boolean;

    // Error state
    error: string | null;
}

interface MealScheduleActions {
    // Data actions
    setSchedule: (schedule: WeeklySchedule | null) => void;
    selectMeal: (meal: ScheduledMeal | null) => void;
    setPendingAdjustment: (adjustment: ScheduleAdjustment | null) => void;
    updateMealInSchedule: (updatedMeal: ScheduledMeal) => void;

    // View actions
    setView: (view: CalendarView) => void;
    setSelectedDate: (date: Date) => void;

    // Modal actions
    openMealModal: (meal: ScheduledMeal) => void;
    closeMealModal: () => void;
    openCheckInModal: () => void;
    closeCheckInModal: () => void;
    openGeneratePanel: () => void;
    closeGeneratePanel: () => void;
    showAdjustment: (adjustment: ScheduleAdjustment) => void;
    dismissAdjustment: () => void;

    // Loading actions
    setLoading: (loading: boolean) => void;
    setGenerating: (generating: boolean) => void;
    setCheckingIn: (checkingIn: boolean) => void;
    setError: (error: string | null) => void;

    // Reset
    reset: () => void;
}

type MealScheduleStore = MealScheduleState & MealScheduleActions;

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: MealScheduleState = {
    currentSchedule: null,
    selectedMeal: null,
    pendingAdjustment: null,
    currentView: 'week',
    selectedDate: new Date(),

    isLoading: false,
    isGenerating: false,
    isCheckingIn: false,
    showMealModal: false,
    showCheckInModal: false,
    showAdjustmentAlert: false,
    showGeneratePanel: false,

    error: null,
};

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useMealScheduleStore = create<MealScheduleStore>((set, get) => ({
    ...initialState,

    // Data actions
    setSchedule: (schedule) => set({ currentSchedule: schedule, error: null }),

    selectMeal: (meal) => set({ selectedMeal: meal }),

    setPendingAdjustment: (adjustment) => set({
        pendingAdjustment: adjustment,
        showAdjustmentAlert: adjustment !== null,
    }),

    updateMealInSchedule: (updatedMeal) => {
        const { currentSchedule } = get();
        if (!currentSchedule) return;

        const updatedDays = currentSchedule.days.map(day => ({
            ...day,
            meals: day.meals.map(meal =>
                meal.id === updatedMeal.id ? updatedMeal : meal
            ),
        }));

        set({
            currentSchedule: {
                ...currentSchedule,
                days: updatedDays,
                updatedAt: new Date().toISOString(),
            },
        });
    },

    // View actions
    setView: (view) => set({ currentView: view }),

    setSelectedDate: (date) => set({ selectedDate: date }),

    // Modal actions
    openMealModal: (meal) => set({
        selectedMeal: meal,
        showMealModal: true,
    }),

    closeMealModal: () => set({
        showMealModal: false,
        // Keep selectedMeal for potential check-in modal
    }),

    openCheckInModal: () => set({
        showCheckInModal: true,
        showMealModal: false,
    }),

    closeCheckInModal: () => set({
        showCheckInModal: false,
        selectedMeal: null,
    }),

    openGeneratePanel: () => set({ showGeneratePanel: true }),

    closeGeneratePanel: () => set({ showGeneratePanel: false }),

    showAdjustment: (adjustment) => set({
        pendingAdjustment: adjustment,
        showAdjustmentAlert: true,
    }),

    dismissAdjustment: () => set({
        pendingAdjustment: null,
        showAdjustmentAlert: false,
    }),

    // Loading actions
    setLoading: (loading) => set({ isLoading: loading }),

    setGenerating: (generating) => set({ isGenerating: generating }),

    setCheckingIn: (checkingIn) => set({ isCheckingIn: checkingIn }),

    setError: (error) => set({ error }),

    // Reset
    reset: () => set(initialState),
}));

// ============================================================
// SELECTORS
// ============================================================

/**
 * Get today's summary from schedule
 */
export const useTodaySummary = () => {
    const schedule = useMealScheduleStore(state => state.currentSchedule);
    if (!schedule) return null;

    const today = new Date().toISOString().split('T')[0];
    return schedule.days.find(day => day.date === today) || null;
};

/**
 * Get meals for a specific date
 */
export const useMealsForDate = (date: Date) => {
    const schedule = useMealScheduleStore(state => state.currentSchedule);
    if (!schedule) return [];

    const dateStr = date.toISOString().split('T')[0];
    const day = schedule.days.find(d => d.date === dateStr);
    return day?.meals || [];
};

/**
 * Check if there's a pending deviation alert
 */
export const useHasDeviation = () => {
    const schedule = useMealScheduleStore(state => state.currentSchedule);
    if (!schedule) return false;

    const today = new Date().toISOString().split('T')[0];
    const todaySummary = schedule.days.find(day => day.date === today);
    return todaySummary?.isDeviated || false;
};
