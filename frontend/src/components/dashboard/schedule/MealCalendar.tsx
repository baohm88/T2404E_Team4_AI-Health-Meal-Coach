/**
 * Meal Calendar Component (Professional Multi-View)
 *
 * Clean, flat design inspired by Google Calendar.
 * Supports 3 view modes:
 * - Week: Spreadsheet-style grid (4 rows × 7 columns)
 * - Day: Detailed vertical stack with macros
 * - List: Weekly agenda grouped by day
 *
 * @see /components/dashboard/schedule/WeekGrid.tsx
 * @see /components/dashboard/schedule/DayDetail.tsx
 * @see /components/dashboard/schedule/AgendaList.tsx
 */

'use client';

import { useMemo, useCallback, useState } from 'react';
import { format, addDays, addWeeks, startOfWeek, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useMealSchedule } from '@/hooks/use-meal-schedule';
import { ScheduledMeal, MealType, CalendarView } from '@/types/meal-schedule';
import { ChevronLeft, ChevronRight, CalendarDays, Calendar, List } from 'lucide-react';

// Sub-components
import { WeekGrid } from './WeekGrid';
import { DayDetail } from './DayDetail';
import { AgendaList } from './AgendaList';

// ============================================================
// TYPES
// ============================================================

type ViewType = 'week' | 'day' | 'list';

const VIEW_CONFIG: Record<ViewType, { label: string; icon: typeof CalendarDays }> = {
    week: { label: 'Tuần', icon: CalendarDays },
    day: { label: 'Ngày', icon: Calendar },
    list: { label: 'Danh sách', icon: List },
};

// ============================================================
// CALENDAR HEADER (Professional Toolbar)
// ============================================================

interface CalendarHeaderProps {
    currentDate: Date;
    view: ViewType;
    onNavigate: (direction: 'prev' | 'next' | 'today') => void;
    onViewChange: (view: ViewType) => void;
}

const CalendarHeader = ({ currentDate, view, onNavigate, onViewChange }: CalendarHeaderProps) => {
    const getLabel = () => {
        if (view === 'week' || view === 'list') {
            const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            const weekEnd = addDays(weekStart, 6);
            return `${format(weekStart, 'dd MMM', { locale: vi })} - ${format(weekEnd, 'dd MMM yyyy', { locale: vi })}`;
        }
        return format(currentDate, "EEEE, d MMMM yyyy", { locale: vi });
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
            {/* Navigation */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onNavigate('today')}
                    className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                    Hôm nay
                </button>
                <div className="flex items-center">
                    <button
                        onClick={() => onNavigate('prev')}
                        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                        title={view === 'week' || view === 'list' ? 'Tuần trước' : 'Ngày trước'}
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <button
                        onClick={() => onNavigate('next')}
                        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                        title={view === 'week' || view === 'list' ? 'Tuần sau' : 'Ngày sau'}
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <h2 className="text-lg font-semibold text-slate-800 ml-2">{getLabel()}</h2>
            </div>

            {/* View Switcher */}
            <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                {(Object.keys(VIEW_CONFIG) as ViewType[]).map((v, index) => {
                    const config = VIEW_CONFIG[v];
                    const Icon = config.icon;
                    const isActive = view === v;

                    return (
                        <button
                            key={v}
                            onClick={() => onViewChange(v)}
                            className={`
                                flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors
                                ${index > 0 ? 'border-l border-slate-300' : ''}
                                ${isActive
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{config.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================
// MAIN CALENDAR COMPONENT
// ============================================================

export const MealCalendar = () => {
    const {
        schedule,
        isLoading,
        selectedDate,
        currentView,
        setSelectedDate,
        setView,
        openMealModal,
    } = useMealSchedule();

    // Local view state - synced with store's CalendarView
    const [view, setLocalView] = useState<ViewType>(currentView);

    // Calculate week days
    const weekDays = useMemo(() => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [selectedDate]);

    // Create meal grid for week view
    const mealGrid = useMemo(() => {
        const grid: Record<MealType, (ScheduledMeal | null)[]> = {
            breakfast: Array(7).fill(null),
            lunch: Array(7).fill(null),
            snack: Array(7).fill(null),
            dinner: Array(7).fill(null),
        };
        if (!schedule) return grid;

        schedule.days.forEach(day => {
            const dayDate = new Date(day.date);
            const dayIndex = weekDays.findIndex(wd => isSameDay(wd, dayDate));
            if (dayIndex >= 0) {
                day.meals.forEach(meal => { grid[meal.mealType][dayIndex] = meal; });
            }
        });
        return grid;
    }, [schedule, weekDays]);

    // Get meals for current day
    const currentDayMeals = useMemo(() => {
        if (!schedule) return [];
        const day = schedule.days.find(d => isSameDay(new Date(d.date), selectedDate));
        return day?.meals || [];
    }, [schedule, selectedDate]);

    // Navigation handler
    const handleNavigate = useCallback((direction: 'prev' | 'next' | 'today') => {
        if (direction === 'today') {
            setSelectedDate(new Date());
        } else if (view === 'week' || view === 'list') {
            setSelectedDate(addWeeks(selectedDate, direction === 'prev' ? -1 : 1));
        } else {
            setSelectedDate(addDays(selectedDate, direction === 'prev' ? -1 : 1));
        }
    }, [selectedDate, setSelectedDate, view]);

    // View change handler
    const handleViewChange = useCallback((newView: ViewType) => {
        setLocalView(newView);
        setView(newView);
    }, [setView]);

    // Handlers
    const handleMealClick = useCallback((meal: ScheduledMeal) => {
        openMealModal(meal);
    }, [openMealModal]);

    const handleCheckIn = useCallback((meal: ScheduledMeal) => {
        // Open meal modal which has check-in functionality
        openMealModal(meal);
    }, [openMealModal]);

    const handleAddMeal = useCallback((date: Date, mealType: MealType) => {
        console.log('Add meal:', mealType, format(date, 'yyyy-MM-dd'));
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-sm border border-slate-200 p-6 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Đang tải lịch ăn...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!schedule) {
        return (
            <div className="bg-white rounded-sm border border-slate-200 p-6 h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Chưa có lịch ăn</h3>
                    <p className="text-sm text-slate-500">Nhấn &quot;Tạo lịch mới&quot; để bắt đầu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-sm border border-slate-200 p-4">
            {/* Header */}
            <CalendarHeader
                currentDate={selectedDate}
                view={view}
                onNavigate={handleNavigate}
                onViewChange={handleViewChange}
            />

            {/* View Content */}
            {view === 'week' && (
                <WeekGrid
                    weekDays={weekDays}
                    mealGrid={mealGrid}
                    onMealClick={handleMealClick}
                    onAddMeal={handleAddMeal}
                />
            )}

            {view === 'day' && (
                <DayDetail
                    currentDate={selectedDate}
                    meals={currentDayMeals}
                    onMealClick={handleMealClick}
                    onCheckIn={handleCheckIn}
                    onAddMeal={handleAddMeal}
                />
            )}

            {view === 'list' && (
                <AgendaList
                    weekDays={weekDays}
                    schedule={schedule}
                    onMealClick={handleMealClick}
                />
            )}
        </div>
    );
};
