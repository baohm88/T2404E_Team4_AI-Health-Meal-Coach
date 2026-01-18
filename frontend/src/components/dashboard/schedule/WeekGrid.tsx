/**
 * Week Grid Component (Professional Style)
 *
 * Clean spreadsheet-style grid layout.
 * 4 rows (Sáng/Trưa/Chiều/Tối) × 7 columns (days).
 *
 * @see /components/dashboard/schedule/MealCalendar.tsx - Parent component
 */

'use client';

import { format, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ScheduledMeal, MealType } from '@/types/meal-schedule';
import { MEAL_TYPE_CONFIG, VIETNAMESE_DAYS_SHORT } from '@/lib/constants/schedule.constants';
import { Plus } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface WeekGridProps {
    weekDays: Date[];
    mealGrid: Record<MealType, (ScheduledMeal | null)[]>;
    onMealClick: (meal: ScheduledMeal) => void;
    onAddMeal: (date: Date, mealType: MealType) => void;
}

const MEAL_SESSIONS: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

// ============================================================
// STATUS STYLES (Professional)
// ============================================================

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-emerald-50 border-l-4 border-l-emerald-500';
        case 'modified':
            return 'bg-orange-50 border-l-4 border-l-orange-500';
        case 'skipped':
            return 'bg-slate-100 border-l-4 border-l-slate-300 opacity-60';
        default: // upcoming
            return 'bg-slate-50 border-l-4 border-l-slate-400';
    }
};

// ============================================================
// COMPACT MEAL CARD
// ============================================================

interface MealCardProps {
    meal: ScheduledMeal;
    onClick: () => void;
}

const CompactMealCard = ({ meal, onClick }: MealCardProps) => {
    const displayCalories = meal.actualMeal?.calories || meal.calories;

    return (
        <button
            onClick={onClick}
            className={`
                w-full h-full p-2 text-left rounded-sm transition-all
                hover:shadow-md hover:scale-[1.02]
                ${getStatusStyles(meal.status)}
            `}
        >
            <div className="text-sm font-medium text-slate-800 truncate">
                {meal.title}
            </div>
            <div className="text-xs text-slate-500">
                {displayCalories} kcal
            </div>
        </button>
    );
};

// ============================================================
// EMPTY CELL
// ============================================================

interface EmptyCellProps {
    onAdd: () => void;
}

const EmptyCell = ({ onAdd }: EmptyCellProps) => (
    <button
        onClick={onAdd}
        className="w-full h-full min-h-[60px] flex items-center justify-center 
                   text-slate-300 hover:text-slate-500 hover:bg-slate-50 
                   transition-colors group"
    >
        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
);

// ============================================================
// WEEK GRID COMPONENT
// ============================================================

export const WeekGrid = ({ weekDays, mealGrid, onMealClick, onAddMeal }: WeekGridProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
                {/* Header Row */}
                <thead>
                    <tr>
                        <th className="w-20 p-2 text-left text-xs font-medium text-slate-500 border-b border-slate-200">
                            Bữa
                        </th>
                        {weekDays.map((day, index) => {
                            const today = isToday(day);
                            return (
                                <th
                                    key={index}
                                    className={`p-2 text-center border-b border-slate-200 ${today ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <div className={`text-xs font-medium ${today ? 'text-primary' : 'text-slate-500'}`}>
                                        {VIETNAMESE_DAYS_SHORT[day.getDay()]}
                                    </div>
                                    <div className={`text-lg font-semibold ${today ? 'text-primary' : 'text-slate-800'}`}>
                                        {format(day, 'd')}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                {/* Meal Rows */}
                <tbody>
                    {MEAL_SESSIONS.map(mealType => {
                        const config = MEAL_TYPE_CONFIG[mealType];
                        return (
                            <tr key={mealType} className="border-b border-slate-100">
                                {/* Session Label */}
                                <td className="p-2 text-left border-r border-slate-100">
                                    <div className="text-sm font-medium text-slate-700">
                                        {config.label}
                                    </div>
                                    <div className="text-xs text-slate-400">{config.defaultTime}</div>
                                </td>

                                {/* Meal Cells */}
                                {weekDays.map((day, dayIndex) => {
                                    const meal = mealGrid[mealType][dayIndex];
                                    const today = isToday(day);

                                    return (
                                        <td
                                            key={dayIndex}
                                            className={`p-1 border-r border-slate-100 ${today ? 'bg-primary/5' : ''}`}
                                        >
                                            {meal ? (
                                                <CompactMealCard meal={meal} onClick={() => onMealClick(meal)} />
                                            ) : (
                                                <EmptyCell onAdd={() => onAddMeal(day, mealType)} />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default WeekGrid;
