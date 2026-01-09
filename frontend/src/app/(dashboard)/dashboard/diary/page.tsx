'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_DIARY_LOG, MOCK_STATS } from '@/lib/mock-data';

export default function DiaryPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Generate 7 days around selected date
    const getDaysAround = (date: Date) => {
        const days = [];
        for (let i = -3; i <= 3; i++) {
            const d = new Date(date);
            d.setDate(date.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const days = getDaysAround(selectedDate);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const todayDiary = MOCK_DIARY_LOG[0];

    const mealSections = [
        { key: 'breakfast', name: 'Bữa sáng', icon: '🌅', items: todayDiary.meals.breakfast.items },
        { key: 'lunch', name: 'Bữa trưa', icon: '☀️', items: todayDiary.meals.lunch.items },
        { key: 'dinner', name: 'Bữa tối', icon: '🌙', items: todayDiary.meals.dinner.items },
        { key: 'snack', name: 'Ăn vặt', icon: '🍪', items: todayDiary.meals.snack.items },
    ];

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    return (
        <div className="space-y-6">
            {/* Date Picker Header */}
            <div className="bg-white rounded-3xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold text-slate-800">
                        Tháng {selectedDate.getMonth() + 1}, {selectedDate.getFullYear()}
                    </h2>
                    <button
                        onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex justify-between gap-2">
                    {days.map((day, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            className={`flex-1 py-3 rounded-xl text-center transition-all ${isSelected(day)
                                    ? 'bg-primary text-white'
                                    : isToday(day)
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <p className="text-xs font-medium">{dayNames[day.getDay()]}</p>
                            <p className="text-lg font-bold">{day.getDate()}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Widget */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-500">Calories hôm nay</span>
                    <span className="text-sm text-slate-500">
                        {MOCK_STATS.caloriesIn} / {MOCK_STATS.caloriesGoal} kcal
                    </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(MOCK_STATS.caloriesIn / MOCK_STATS.caloriesGoal) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-3 text-xs text-slate-500">
                    <span>Protein: {MOCK_STATS.macros.protein.current}g</span>
                    <span>Carbs: {MOCK_STATS.macros.carbs.current}g</span>
                    <span>Fat: {MOCK_STATS.macros.fat.current}g</span>
                </div>
            </div>

            {/* Meal Sections */}
            <div className="space-y-4">
                {mealSections.map((meal) => {
                    const totalCal = meal.items.reduce((sum, item) => sum + item.calories, 0);
                    return (
                        <div key={meal.key} className="bg-white rounded-3xl p-5 shadow-sm">
                            {/* Meal Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{meal.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{meal.name}</h3>
                                        <p className="text-sm text-slate-500">{totalCal} kcal</p>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Meal Items */}
                            {meal.items.length > 0 ? (
                                <div className="space-y-2">
                                    {meal.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-800">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.time}</p>
                                            </div>
                                            <span className="font-semibold text-primary">{item.calories} kcal</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">
                                    Chưa có món ăn. Bấm + để thêm.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
