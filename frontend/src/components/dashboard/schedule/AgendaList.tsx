/**
 * Agenda List Component (Professional Style)
 *
 * Weekly agenda view showing all meals grouped by day.
 * Clean list format like Google Calendar mobile app.
 *
 * @see /components/dashboard/schedule/MealCalendar.tsx - Parent component
 */

'use client';

import { format, isToday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ScheduledMeal, MealType, DaySummary } from '@/types/meal-schedule';
import { MEAL_TYPE_CONFIG } from '@/lib/constants/schedule.constants';

// ============================================================
// TYPES
// ============================================================

interface AgendaListProps {
    weekDays: Date[];
    schedule: {
        days: DaySummary[];
    } | null;
    onMealClick: (meal: ScheduledMeal) => void;
}

// ============================================================
// STATUS DOT
// ============================================================

const StatusDot = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        completed: 'bg-emerald-500',
        modified: 'bg-orange-500',
        skipped: 'bg-slate-300',
        upcoming: 'bg-slate-400',
    };

    return <div className={`w-2 h-2 rounded-full ${colors[status] || colors.upcoming}`} />;
};

// ============================================================
// MEAL ROW
// ============================================================

interface MealRowProps {
    meal: ScheduledMeal;
    onClick: () => void;
}

const MealRow = ({ meal, onClick }: MealRowProps) => {
    const config = MEAL_TYPE_CONFIG[meal.mealType];
    const displayCalories = meal.actualMeal?.calories || meal.calories;

    return (
        <button
            onClick={onClick}
            className="w-full px-4 py-3 flex items-center gap-4 text-left
                       hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
        >
            {/* Time */}
            <div className="w-20 flex-shrink-0">
                <div className="text-sm font-medium text-slate-700">{config.defaultTime}</div>
            </div>

            {/* Status Dot */}
            <StatusDot status={meal.status} />

            {/* Meal Info */}
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{meal.title}</div>
                <div className="text-xs text-slate-500 truncate">{meal.description}</div>
            </div>

            {/* Calories & Macros */}
            <div className="text-right flex-shrink-0">
                <div className="text-sm font-semibold text-slate-800">{displayCalories} kcal</div>
                <div className="text-xs text-slate-400">
                    P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                </div>
            </div>
        </button>
    );
};

// ============================================================
// DAY GROUP
// ============================================================

interface DayGroupProps {
    date: Date;
    meals: ScheduledMeal[];
    onMealClick: (meal: ScheduledMeal) => void;
}

const DayGroup = ({ date, meals, onMealClick }: DayGroupProps) => {
    const today = isToday(date);

    // Sort meals by meal type order
    const sortedMeals = [...meals].sort((a, b) => {
        const order: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];
        return order.indexOf(a.mealType) - order.indexOf(b.mealType);
    });

    // Calculate day totals
    const totalCalories = meals.reduce((sum, m) => sum + (m.actualMeal?.calories || m.calories), 0);

    return (
        <div className="mb-4">
            {/* Day Header */}
            <div className={`px-4 py-2 flex items-center justify-between ${today ? 'bg-primary/5' : 'bg-slate-50'} border-b border-slate-200`}>
                <div className="flex items-center gap-2">
                    <div className={`text-sm font-semibold ${today ? 'text-primary' : 'text-slate-700'}`}>
                        {format(date, 'EEEE', { locale: vi })}
                    </div>
                    <div className="text-sm text-slate-500">
                        {format(date, 'd MMMM', { locale: vi })}
                    </div>
                    {today && (
                        <span className="px-1.5 py-0.5 bg-primary text-white text-[10px] font-medium rounded">
                            Hôm nay
                        </span>
                    )}
                </div>
                <div className="text-sm text-slate-500">
                    {totalCalories} kcal
                </div>
            </div>

            {/* Meals */}
            <div className="bg-white">
                {sortedMeals.length > 0 ? (
                    sortedMeals.map(meal => (
                        <MealRow key={meal.id} meal={meal} onClick={() => onMealClick(meal)} />
                    ))
                ) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                        Chưa có món ăn nào được lên lịch
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================
// AGENDA LIST COMPONENT
// ============================================================

export const AgendaList = ({ weekDays, schedule, onMealClick }: AgendaListProps) => {
    if (!schedule) {
        return (
            <div className="text-center py-12 text-slate-500">
                Không có dữ liệu lịch ăn
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-700">
                        Lịch trình tuần này
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <StatusDot status="upcoming" />
                            <span className="text-slate-500">Sắp tới</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <StatusDot status="completed" />
                            <span className="text-slate-500">Đã ăn</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <StatusDot status="modified" />
                            <span className="text-slate-500">Đổi món</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day Groups */}
            <div className="divide-y divide-slate-100">
                {weekDays.map(day => {
                    const dayData = schedule.days.find(d => isSameDay(new Date(d.date), day));
                    const meals = dayData?.meals || [];

                    return (
                        <DayGroup
                            key={day.toISOString()}
                            date={day}
                            meals={meals}
                            onMealClick={onMealClick}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AgendaList;
