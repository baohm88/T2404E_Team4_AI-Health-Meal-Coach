/**
 * useMealSchedule Hook
 *
 * Custom hook that combines store state with service calls.
 * Provides a clean API for components to interact with meal scheduling.
 *
 * Features:
 * - Same-day recalculation when user eats over plan
 * - Late-night compensation for dinner deviations
 * - Automatic adjustment of remaining meals
 *
 * @see /stores/useMealScheduleStore.ts - State management
 * @see /services/meal-schedule.service.ts - API calls
 * @see /utils/ai-adjustment.ts - Adjustment algorithms
 */

import { useCallback, useEffect } from 'react';
import { useMealScheduleStore } from '@/stores/useMealScheduleStore';
import { mealScheduleService } from '@/services/meal-schedule.service';
import {
    GenerateScheduleParams,
    ActualMealInput,
    ScheduledMeal,
    DaySummary,
} from '@/types/meal-schedule';
import { SCHEDULE_THRESHOLDS } from '@/lib/constants/schedule.constants';
import {
    recalculateSameDayMeals,
    generateLateNightCompensation,
    getTomorrowDate,
    isDeviationSignificant,
} from '@/utils/ai-adjustment';
import { toast } from 'sonner';

// ============================================================
// CONSTANTS
// ============================================================

/** Minimum deviation to trigger same-day recalculation */
const SAME_DAY_RECALC_THRESHOLD = 50;

export const useMealSchedule = () => {
    const store = useMealScheduleStore();

    // ============================================================
    // FETCH SCHEDULE
    // ============================================================

    const fetchSchedule = useCallback(async () => {
        store.setLoading(true);
        store.setError(null);

        try {
            const response = await mealScheduleService.getCurrentSchedule();

            if (response.success && response.data) {
                store.setSchedule(response.data);
            } else {
                store.setError(response.message);
            }
        } catch (error) {
            store.setError('Không thể tải lộ trình dinh dưỡng. Vui lòng thử lại.');
            console.error('Error fetching schedule:', error);
        } finally {
            store.setLoading(false);
        }
    }, [store]);

    // Auto-fetch on mount
    useEffect(() => {
        if (!store.currentSchedule && !store.isLoading) {
            fetchSchedule();
        }
    }, []);

    // ============================================================
    // GENERATE NEW SCHEDULE
    // ============================================================

    const generateSchedule = useCallback(async (params: GenerateScheduleParams) => {
        store.setGenerating(true);
        store.setError(null);

        try {
            const response = await mealScheduleService.generateSchedule(params);

            if (response.success && response.data) {
                store.setSchedule(response.data);
                store.closeGeneratePanel();
                return { success: true, message: response.message };
            } else {
                store.setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (error) {
            const message = 'Không thể tạo lộ trình dinh dưỡng. Vui lòng thử lại.';
            store.setError(message);
            console.error('Error generating schedule:', error);
            return { success: false, message };
        } finally {
            store.setGenerating(false);
        }
    }, [store]);

    // ============================================================
    // SAME-DAY RECALCULATION (Phase 1)
    // ============================================================

    /**
     * Recalculate remaining meals in the same day when user eats over plan
     */
    const performSameDayRecalculation = useCallback((
        dayData: DaySummary,
        mealId: string,
        deviation: number
    ): { updated: boolean; isLateNight: boolean } => {
        const schedule = store.currentSchedule;
        if (!schedule) return { updated: false, isLateNight: false };

        // Call recalculation algorithm
        const result = recalculateSameDayMeals(dayData, mealId, deviation);

        if (result.adjustedMealsCount > 0) {
            // Update the day in schedule
            const updatedDays = schedule.days.map(day => {
                if (day.date === dayData.date) {
                    return {
                        ...day,
                        meals: result.updatedMeals,
                    };
                }
                return day;
            });

            store.setSchedule({
                ...schedule,
                days: updatedDays,
                updatedAt: new Date().toISOString(),
            });

            // Show toast notification
            toast.warning(result.feedback, {
                duration: 5000,
                icon: '🤖',
            });

            return { updated: true, isLateNight: false };
        }

        return { updated: false, isLateNight: result.isLateNight };
    }, [store]);

    // ============================================================
    // LATE-NIGHT COMPENSATION (Phase 2)
    // ============================================================

    /**
     * Handle late-night deviation (dinner over-eating)
     */
    const handleLateNightDeviation = useCallback(async (
        deviation: number,
        meal: ScheduledMeal
    ) => {
        const schedule = store.currentSchedule;
        if (!schedule) return;

        // Generate compensation suggestion
        const compensation = generateLateNightCompensation(deviation, getTomorrowDate());

        // Get adjustment from service (which will apply compensation to tomorrow's meals)
        try {
            const adjustmentResponse = await mealScheduleService.getAdjustment({
                userId: schedule.userId,
                date: meal.date,
                mealId: meal.id,
                mealType: meal.mealType,
                plannedCalories: meal.calories,
                actualCalories: meal.actualMeal?.calories || meal.calories,
                totalDayCalories: schedule.days.find(d => d.date === meal.date)?.actualCalories || 0,
                targetDailyCalories: schedule.targetDailyCalories,
            });

            if (adjustmentResponse.success && adjustmentResponse.data) {
                // Enhance adjustment with compensation
                const enhancedAdjustment = {
                    ...adjustmentResponse.data,
                    compensation,
                    isLateNightDeviation: true,
                    advice: compensation.reason,
                };

                store.showAdjustment(enhancedAdjustment);
            }
        } catch (error) {
            console.error('Error getting late-night adjustment:', error);
        }
    }, [store]);

    // ============================================================
    // CHECK-IN MEAL (Enhanced with Same-day Recalculation)
    // ============================================================

    const checkInMeal = useCallback(async (
        meal: ScheduledMeal,
        actualMeal?: ActualMealInput
    ) => {
        store.setCheckingIn(true);

        try {
            const response = await mealScheduleService.checkInMeal(meal.id, actualMeal);

            if (response.success && response.data) {
                store.updateMealInSchedule(response.data);
                store.closeCheckInModal();

                // ✅ NEW: Check for deviation and apply same-day recalculation
                if (actualMeal) {
                    const deviation = actualMeal.calories - meal.calories;

                    // Only process if deviation is positive (ate more than planned)
                    if (deviation > SAME_DAY_RECALC_THRESHOLD) {
                        console.log(`⚠️ Phát hiện ăn lố ${deviation} kcal. Đang tính lại thực đơn...`);

                        const schedule = store.currentSchedule;
                        if (schedule) {
                            const dayData = schedule.days.find(d => d.date === meal.date);

                            if (dayData) {
                                // Try same-day recalculation first
                                const { updated, isLateNight } = performSameDayRecalculation(
                                    dayData,
                                    meal.id,
                                    deviation
                                );

                                // If late-night (no meals left to adjust), handle differently
                                if (isLateNight && deviation > 100) {
                                    await handleLateNightDeviation(deviation, {
                                        ...meal,
                                        actualMeal: {
                                            title: actualMeal.title,
                                            calories: actualMeal.calories,
                                            protein: actualMeal.protein || 0,
                                            carbs: actualMeal.carbs || 0,
                                            fat: actualMeal.fat || 0,
                                            checkedInAt: new Date().toISOString(),
                                        },
                                    });
                                } else if (!updated && isDeviationSignificant(
                                    deviation,
                                    schedule.targetDailyCalories
                                )) {
                                    // Fallback to next-day adjustment
                                    await checkForDeviation(meal, actualMeal);
                                }
                            }
                        }
                    }
                }

                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error checking in meal:', error);
            return { success: false, message: 'Không thể check-in bữa ăn.' };
        } finally {
            store.setCheckingIn(false);
        }
    }, [store, performSameDayRecalculation, handleLateNightDeviation]);

    // ============================================================
    // SKIP MEAL
    // ============================================================

    const skipMeal = useCallback(async (meal: ScheduledMeal) => {
        try {
            const response = await mealScheduleService.skipMeal(meal.id);

            if (response.success && response.data) {
                store.updateMealInSchedule(response.data);
                store.closeMealModal();
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error skipping meal:', error);
            return { success: false, message: 'Không thể bỏ qua bữa ăn.' };
        }
    }, [store]);

    // ============================================================
    // DEVIATION CHECK & ADJUSTMENT (Original - for next-day)
    // ============================================================

    const checkForDeviation = useCallback(async (
        meal: ScheduledMeal,
        actualMeal: ActualMealInput
    ) => {
        const schedule = store.currentSchedule;
        if (!schedule) return;

        const dayData = schedule.days.find(d => d.date === meal.date);
        if (!dayData) return;

        // Calculate new daily total
        const otherMealsCalories = dayData.meals
            .filter(m => m.id !== meal.id)
            .reduce((sum, m) => sum + (m.actualMeal?.calories || m.calories), 0);

        const newDayTotal = otherMealsCalories + actualMeal.calories;
        const deviation = newDayTotal - schedule.targetDailyCalories;
        const deviationPercent = Math.abs(deviation) / schedule.targetDailyCalories * 100;

        // If deviation exceeds threshold, get adjustment
        if (deviationPercent > SCHEDULE_THRESHOLDS.CALORIE_DEVIATION_PERCENT) {
            try {
                const adjustmentResponse = await mealScheduleService.getAdjustment({
                    userId: schedule.userId,
                    date: meal.date,
                    mealId: meal.id,
                    mealType: meal.mealType,
                    plannedCalories: meal.calories,
                    actualCalories: actualMeal.calories,
                    totalDayCalories: newDayTotal,
                    targetDailyCalories: schedule.targetDailyCalories,
                });

                if (adjustmentResponse.success && adjustmentResponse.data) {
                    store.showAdjustment(adjustmentResponse.data);
                }
            } catch (error) {
                console.error('Error getting adjustment:', error);
            }
        }
    }, [store]);

    // ============================================================
    // APPLY ADJUSTMENT
    // ============================================================

    const applyAdjustment = useCallback(async () => {
        const adjustment = store.pendingAdjustment;
        if (!adjustment) return { success: false, message: 'Không có điều chỉnh để áp dụng.' };

        store.setLoading(true);

        try {
            const response = await mealScheduleService.applyAdjustment(adjustment);

            if (response.success && response.data) {
                store.setSchedule(response.data);
                store.dismissAdjustment();

                // Show success toast with compensation info
                if (adjustment.compensation) {
                    const comp = adjustment.compensation;
                    if (comp.exercise) {
                        toast.success(
                            `Đã lên lịch: ${comp.exercise.activity} (${comp.exercise.duration} phút) cho ngày mai! 💪`,
                            { duration: 5000 }
                        );
                    }
                }

                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error applying adjustment:', error);
            return { success: false, message: 'Không thể áp dụng điều chỉnh.' };
        } finally {
            store.setLoading(false);
        }
    }, [store]);

    // ============================================================
    // COMPUTED VALUES
    // ============================================================

    const todaySummary = store.currentSchedule?.days.find(
        day => day.date === new Date().toISOString().split('T')[0]
    );

    const weeklyStats = store.currentSchedule ? {
        totalPlanned: store.currentSchedule.days.reduce(
            (sum, day) => sum + day.targetCalories, 0
        ),
        totalActual: store.currentSchedule.days.reduce(
            (sum, day) => sum + day.actualCalories, 0
        ),
        avgDeviation: store.currentSchedule.days.reduce(
            (sum, day) => sum + day.calorieDeviation, 0
        ) / store.currentSchedule.days.length,
        completedMeals: store.currentSchedule.days.flatMap(d => d.meals)
            .filter(m => m.status === 'completed' || m.status === 'modified').length,
        totalMeals: store.currentSchedule.days.flatMap(d => d.meals).length,
        adjustedMeals: store.currentSchedule.days.flatMap(d => d.meals)
            .filter(m => m.isAiAdjusted).length,
    } : null;

    // ============================================================
    // RETURN API
    // ============================================================

    return {
        // State
        schedule: store.currentSchedule,
        selectedMeal: store.selectedMeal,
        pendingAdjustment: store.pendingAdjustment,
        currentView: store.currentView,
        selectedDate: store.selectedDate,

        // Loading states
        isLoading: store.isLoading,
        isGenerating: store.isGenerating,
        isCheckingIn: store.isCheckingIn,
        error: store.error,

        // Modal states
        showMealModal: store.showMealModal,
        showCheckInModal: store.showCheckInModal,
        showAdjustmentAlert: store.showAdjustmentAlert,
        showGeneratePanel: store.showGeneratePanel,

        // Computed
        todaySummary,
        weeklyStats,

        // Actions
        fetchSchedule,
        generateSchedule,
        checkInMeal,
        skipMeal,
        applyAdjustment,

        // View actions
        setView: store.setView,
        setSelectedDate: store.setSelectedDate,

        // Modal actions
        openMealModal: store.openMealModal,
        closeMealModal: store.closeMealModal,
        openCheckInModal: store.openCheckInModal,
        closeCheckInModal: store.closeCheckInModal,
        openGeneratePanel: store.openGeneratePanel,
        closeGeneratePanel: store.closeGeneratePanel,
        dismissAdjustment: store.dismissAdjustment,
    };
};
