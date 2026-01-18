/**
 * Day Detail Component (Professional Style)
 *
 * Detailed vertical stack view for a single day.
 * Shows expanded meal cards with macros and action buttons.
 *
 * @see /components/dashboard/schedule/MealCalendar.tsx - Parent component
 */

'use client';

import { format, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ScheduledMeal, MealType } from '@/types/meal-schedule';
import { MEAL_TYPE_CONFIG } from '@/lib/constants/schedule.constants';
import { Check, RefreshCw, Plus } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface DayDetailProps {
    currentDate: Date;
    meals: ScheduledMeal[];
    onMealClick: (meal: ScheduledMeal) => void;
    onCheckIn: (meal: ScheduledMeal) => void;
    onAddMeal: (date: Date, mealType: MealType) => void;
}

const MEAL_SESSIONS: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

// ============================================================
// STATUS STYLES
// ============================================================

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'completed':
            return 'border-l-4 border-l-emerald-500 bg-emerald-50/50';
        case 'modified':
            return 'border-l-4 border-l-orange-500 bg-orange-50/50';
        case 'skipped':
            return 'border-l-4 border-l-slate-300 bg-slate-50 opacity-60';
        default:
            return 'border-l-4 border-l-slate-400 bg-white';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'completed': return 'Đã ăn';
        case 'modified': return 'Đổi món';
        case 'skipped': return 'Bỏ qua';
        default: return 'Sắp tới';
    }
};

// ============================================================
// EXPANDED MEAL CARD
// ============================================================

interface ExpandedMealCardProps {
    meal: ScheduledMeal;
    config: typeof MEAL_TYPE_CONFIG[MealType];
    onClick: () => void;
    onCheckIn: () => void;
}

const ExpandedMealCard = ({ meal, config, onClick, onCheckIn }: ExpandedMealCardProps) => {
    const displayCalories = meal.actualMeal?.calories || meal.calories;
    const protein = meal.actualMeal?.protein || meal.protein;
    const carbs = meal.actualMeal?.carbs || meal.carbs;
    const fat = meal.actualMeal?.fat || meal.fat;

    return (
        <div className={`rounded-sm border border-slate-200 ${getStatusStyles(meal.status)}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={onClick}>
                        <div className="text-lg font-semibold text-slate-800">{meal.title}</div>
                        <div className="text-sm text-slate-500 mt-1">
                            {config.defaultTime} • {getStatusLabel(meal.status)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-slate-800">{displayCalories}</div>
                        <div className="text-xs text-slate-500">kcal</div>
                    </div>
                </div>
            </div>

            {/* Macros */}
            <div className="px-4 py-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded text-xs">
                    <span className="text-blue-600 font-medium">P</span>
                    <span className="text-blue-800 font-semibold">{protein}g</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded text-xs">
                    <span className="text-amber-600 font-medium">C</span>
                    <span className="text-amber-800 font-semibold">{carbs}g</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 rounded text-xs">
                    <span className="text-rose-600 font-medium">F</span>
                    <span className="text-rose-800 font-semibold">{fat}g</span>
                </div>

                {/* Action Buttons */}
                {meal.status === 'upcoming' && (
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={onCheckIn}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded hover:bg-emerald-600 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Check-in
                        </button>
                        <button
                            onClick={onClick}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Đổi món
                        </button>
                    </div>
                )}
            </div>

            {/* Description */}
            {meal.description && (
                <div className="px-4 pb-3">
                    <p className="text-sm text-slate-500">{meal.description}</p>
                </div>
            )}
        </div>
    );
};

// ============================================================
// EMPTY SLOT
// ============================================================

interface EmptySlotProps {
    mealType: MealType;
    onAdd: () => void;
}

const EmptySlot = ({ mealType, onAdd }: EmptySlotProps) => {
    const config = MEAL_TYPE_CONFIG[mealType];

    return (
        <button
            onClick={onAdd}
            className="w-full p-4 border border-dashed border-slate-300 rounded-sm
                       flex items-center justify-center gap-2 text-slate-400
                       hover:border-slate-400 hover:text-slate-500 hover:bg-slate-50 transition-all"
        >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Thêm món cho {config.label.toLowerCase()}</span>
        </button>
    );
};

// ============================================================
// DAY DETAIL COMPONENT
// ============================================================

export const DayDetail = ({ currentDate, meals, onMealClick, onCheckIn, onAddMeal }: DayDetailProps) => {
    const today = isToday(currentDate);

    // Group meals by type
    const mealsByType: Record<MealType, ScheduledMeal | null> = {
        breakfast: null, lunch: null, snack: null, dinner: null
    };
    meals.forEach(meal => { mealsByType[meal.mealType] = meal; });

    return (
        <div className="max-w-2xl mx-auto">
            {/* Day Header */}
            <div className={`text-center p-4 mb-6 rounded-sm border ${today ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`text-sm font-medium ${today ? 'text-primary' : 'text-slate-500'}`}>
                    {format(currentDate, 'EEEE', { locale: vi })}
                </div>
                <div className={`text-3xl font-bold ${today ? 'text-primary' : 'text-slate-800'}`}>
                    {format(currentDate, 'd MMMM', { locale: vi })}
                </div>
                {today && <div className="text-xs text-primary mt-1">Hôm nay</div>}
            </div>

            {/* Meal Blocks */}
            <div className="space-y-4">
                {MEAL_SESSIONS.map(mealType => {
                    const config = MEAL_TYPE_CONFIG[mealType];
                    const meal = mealsByType[mealType];

                    return (
                        <div key={mealType}>
                            {/* Session Header */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-sm font-semibold text-slate-700">{config.label}</div>
                                <div className="text-xs text-slate-400">{config.defaultTime}</div>
                                <div className="flex-1 border-t border-slate-200 ml-2" />
                            </div>

                            {/* Meal Content */}
                            {meal ? (
                                <ExpandedMealCard
                                    meal={meal}
                                    config={config}
                                    onClick={() => onMealClick(meal)}
                                    onCheckIn={() => onCheckIn(meal)}
                                />
                            ) : (
                                <EmptySlot mealType={mealType} onAdd={() => onAddMeal(currentDate, mealType)} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayDetail;
