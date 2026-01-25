'use client';

/**
 * Detailed Plan Page
 * Displays 7-day meal and exercise plan with Week/Day view toggle
 * Features Vietnamese meals and detailed modals
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DetailedPlanCalendar } from '@/components/detailed-plan/DetailedPlanCalendar';
import { DetailModal } from '@/components/detailed-plan/DetailModal';
import { detailedPlanService, DailyPlan, Meal, Exercise } from '@/services/detailed-plan.service';
import { Calendar, LayoutGrid, Loader2 } from 'lucide-react';

type ViewMode = 'week' | 'day';

export default function DetailedPlanPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [plans, setPlans] = useState<DailyPlan[]>([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState<Meal | Exercise | null>(null);
    const [modalType, setModalType] = useState<'meal' | 'exercise'>('meal');

    // Fetch plans on mount
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setIsLoading(true);
                const data = await detailedPlanService.getWeekPlan();
                setPlans(data);
            } catch (error) {
                console.error('Failed to fetch plans:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleMealClick = (meal: Meal) => {
        setModalItem(meal);
        setModalType('meal');
        setModalOpen(true);
    };

    const handleExerciseClick = (exercise: Exercise) => {
        setModalItem(exercise);
        setModalType('exercise');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalItem(null);
    };

    // Calculate total calories for the week
    const totalWeekCalories = plans.reduce((total, plan) => {
        const mealCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
        return total + mealCalories + plan.exercise.calories;
    }, 0);

    const avgDailyCalories = plans.length > 0 ? Math.round(totalWeekCalories / plans.length) : 0;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Kế hoạch chi tiết</h1>
                    <p className="text-muted-foreground mt-1">
                        Xem chi tiết bữa ăn và bài tập trong tuần
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'week' ? 'primary' : 'outline'}
                        onClick={() => setViewMode('week')}
                        className="gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Tuần
                    </Button>
                    <Button
                        variant={viewMode === 'day' ? 'primary' : 'outline'}
                        onClick={() => setViewMode('day')}
                        className="gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Ngày
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {!isLoading && plans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tổng calories/tuần
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalWeekCalories.toLocaleString()} kcal</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Trung bình/ngày
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgDailyCalories.toLocaleString()} kcal</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Số ngày
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{plans.length} ngày</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Day Selector for Day View */}
            {viewMode === 'day' && !isLoading && plans.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {plans.map((plan, index) => {
                        const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][plan.date.getDay()];
                        const dateStr = plan.date.getDate();
                        const isSelected = selectedDayIndex === index;

                        return (
                            <Button
                                key={index}
                                variant={isSelected ? 'primary' : 'outline'}
                                onClick={() => setSelectedDayIndex(index)}
                                className="flex flex-col gap-1 h-auto py-3 px-4 min-w-[80px]"
                            >
                                <span className="text-xs font-medium">{dayOfWeek}</span>
                                <span className="text-xl font-bold">{dateStr}</span>
                            </Button>
                        );
                    })}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Calendar */}
            {!isLoading && plans.length > 0 && (
                <DetailedPlanCalendar
                    plans={plans}
                    viewMode={viewMode}
                    selectedDayIndex={selectedDayIndex}
                    onSelectDay={setSelectedDayIndex}
                    onMealClick={handleMealClick}
                    onExerciseClick={handleExerciseClick}
                />
            )}

            {/* Empty State */}
            {!isLoading && plans.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa có kế hoạch</h3>
                        <p className="text-muted-foreground text-center">
                            Hiện tại chưa có kế hoạch chi tiết nào. Vui lòng thử lại sau.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Detail Modal */}
            <DetailModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                item={modalItem}
                type={modalType}
            />
        </div>
    );
}
