"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Coffee, Sun, Moon, Utensils, Check, RefreshCw, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addDays, parseISO, isSameDay, isBefore, isAfter, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { mealLogService } from "@/services/meal-log.service";
import { MealLogModal } from "./MealLogModal";
import { toast } from "sonner";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Meal {
    id: number;
    mealName: string;
    quantity: string;
    calories: number;
    type: string;
    checkedIn: boolean;
}

interface DayPlan {
    day: number;
    meals: Meal[];
    totalCalories: number;
}

interface WeeklyMealCalendarProps {
    initialData: {
        mealPlan: DayPlan[];
    };
    startDate: string;
}

const mealTypeIcons: Record<string, React.ReactNode> = {
    Sáng: <Coffee className="w-4 h-4" />,
    Trưa: <Sun className="w-4 h-4" />,
    Tối: <Moon className="w-4 h-4" />,
    Phụ: <Utensils className="w-4 h-4" />,
};

const mealTypeColors: Record<string, string> = {
    Sáng: "bg-blue-50 text-blue-700 border-blue-100",
    Trưa: "bg-orange-50 text-orange-700 border-orange-100",
    Tối: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Phụ: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export const WeeklyMealCalendar: React.FC<WeeklyMealCalendarProps> = ({ initialData, startDate }) => {
    const [mealPlanState, setMealPlanState] = useState<DayPlan[]>(initialData.mealPlan);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0); // For Mobile View
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{ id: number; day: number; type: string; mealName: string; calories: number } | null>(null);
    const [confirmedMeals, setConfirmedMeals] = useState<Set<string>>(() => {
        const initialConfirmed = new Set<string>();
        initialData.mealPlan.forEach(day => {
            day.meals.forEach(meal => {
                if (meal.checkedIn) {
                    initialConfirmed.add(`${day.day}-${meal.type}`);
                }
            });
        });
        return initialConfirmed;
    });
    const [loggingId, setLoggingId] = useState<string | null>(null);

    const baseDate = useMemo(() => {
        try {
            return parseISO(startDate);
        } catch (e) {
            return new Date();
        }
    }, [startDate]);

    const totalDays = mealPlanState.length;
    const totalWeeks = Math.ceil(totalDays / 7);
    const mealTypes = ["Sáng", "Trưa", "Tối", "Phụ"];

    const currentWeekData = useMemo(() => {
        const startIdx = currentWeek * 7;
        const endIdx = startIdx + 7;
        return mealPlanState.slice(startIdx, endIdx);
    }, [currentWeek, mealPlanState]);

    const nextWeek = () => setCurrentWeek((prev) => Math.min(prev + 1, totalWeeks - 1));
    const prevWeek = () => setCurrentWeek((prev) => Math.max(prev - 1, 0));

    const handleCheckIn = async (mealId: number, day: number, type: string, mealName: string, calories: number) => {
        const mealKey = `${day}-${type}`;
        try {
            setLoggingId(mealKey);
            const res = await mealLogService.checkInPlannedMealById(mealId) as any;

            if (res.success) {
                setConfirmedMeals(prev => new Set(prev).add(mealKey));
                toast.success(`Đã xác nhận bữa ${type.toLowerCase()}!`);
            } else {
                toast.error(res.message || "Không thể xác nhận bữa ăn.");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Lỗi kết nối server.";
            toast.error(`Lỗi: ${errorMsg}`);
        } finally {
            setLoggingId(null);
        }
    };

    const handleSwapClick = (mealId: number, day: number, type: string, mealName: string, calories: number) => {
        setSelectedMeal({ id: mealId, day, type, mealName, calories });
        setIsModalOpen(true);
    };

    const onSwapSuccess = (newData: any) => {
        if (selectedMeal) {
            const mealKey = `${selectedMeal.day}-${selectedMeal.type}`;

            // Cập nhật state UI ngay lập tức
            setMealPlanState(prev => prev.map(dayPlan => {
                if (dayPlan.day === selectedMeal.day) {
                    const updatedMeals = dayPlan.meals.map(m => {
                        if (m.type === selectedMeal.type) {
                            return {
                                ...m,
                                mealName: newData.foodName,
                                calories: newData.estimatedCalories,
                                checkedIn: true
                            };
                        }
                        return m;
                    });

                    return {
                        ...dayPlan,
                        meals: updatedMeals,
                        totalCalories: updatedMeals.reduce((sum, m) => sum + m.calories, 0)
                    };
                }
                return dayPlan;
            }));

            setConfirmedMeals(prev => new Set(prev).add(mealKey));
            toast.success("Đã cập nhật bữa ăn mới bằng AI!");
        }
    };

    // Helper component for Meal Card to avoid duplication
    const MealCard = ({ meal, dayData, type, isTodayDate, isPastDate, isFutureDate, mealKey }: any) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "h-full p-3 rounded-2xl border flex flex-col transition-all duration-300 relative",
                isTodayDate ? "bg-emerald-50/50 border-emerald-200 ring-2 ring-emerald-500/10" : "bg-white border-slate-100",
                isPastDate && "bg-slate-50/80 border-slate-200 grayscale-[0.2] opacity-80",
                isFutureDate && "bg-slate-50/30 border-slate-100 opacity-60",
                mealKey && confirmedMeals.has(mealKey) && "border-emerald-500 bg-emerald-50/40"
            )}
        >
            {mealKey && confirmedMeals.has(mealKey) && (
                <div className="absolute top-2 right-2 p-1 bg-emerald-500 rounded-full text-white shadow-sm z-10">
                    <Check className="w-3 h-3" strokeWidth={4} />
                </div>
            )}

            <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("p-1.5 rounded-lg border", mealTypeColors[type])}>
                    {React.cloneElement(mealTypeIcons[type] as React.ReactElement<any>, { className: "w-3 h-3" })}
                </div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{type}</span>
            </div>

            <div className="space-y-1.5 mb-3">
                <h4 className={cn(
                    "text-sm font-bold leading-tight transition-colors line-clamp-2",
                    isTodayDate ? "text-emerald-800" : "text-slate-800",
                    mealKey && confirmedMeals.has(mealKey) && "text-emerald-700"
                )}>
                    {meal.mealName}
                </h4>
                <div className="flex flex-wrap gap-1">
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                        {meal.quantity}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 italic">
                        {meal.calories} kcal
                    </span>
                </div>
            </div>

            {mealKey && (
                <div className="mt-auto pt-2 border-t border-slate-100/50 flex gap-1.5">
                    <button
                        onClick={() => handleCheckIn(meal.id, dayData.day, type, meal.mealName, meal.calories)}
                        disabled={loggingId === mealKey || confirmedMeals.has(mealKey) || isFutureDate}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1",
                            (confirmedMeals.has(mealKey) || isFutureDate)
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10 active:scale-95"
                        )}
                    >
                        {loggingId === mealKey ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-3 h-3" />}
                        Xong
                    </button>
                    <button
                        onClick={() => handleSwapClick(meal.id, dayData.day, type, meal.mealName, meal.calories)}
                        disabled={confirmedMeals.has(mealKey) || isFutureDate}
                        className={cn(
                            "p-1.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1 active:scale-95",
                            (confirmedMeals.has(mealKey) || isFutureDate)
                                ? "bg-slate-50 text-slate-300 cursor-not-allowed opacity-50"
                                : "bg-slate-800 text-white hover:bg-slate-900"
                        )}
                    >
                        <RefreshCw className="w-3 h-3" />
                        Đổi
                    </button>
                </div>
            )}
        </motion.div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/30">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Lịch Ăn Uống Hàng Tuần</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">Bắt đầu từ: {startDate}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100/50 p-2 rounded-2xl">
                    <button
                        onClick={prevWeek}
                        disabled={currentWeek === 0}
                        className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white/50"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="px-6 py-1 text-sm font-black text-slate-700 min-w-[120px] text-center uppercase tracking-widest">
                        Tuần {currentWeek + 1}
                    </span>
                    <button
                        onClick={nextWeek}
                        disabled={currentWeek === totalWeeks - 1}
                        className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white/50"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Mobile Day Selector */}
            <div className="md:hidden flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                {Array.from({ length: 7 }).map((_, idx) => {
                    const dayData = currentWeekData[idx];
                    const actualDate = dayData ? addDays(baseDate, (currentWeek * 7) + idx) : null;
                    const isTodayDate = actualDate ? isSameDay(startOfDay(actualDate), startOfDay(new Date())) : false;
                    const isSelected = selectedDayIdx === idx;

                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDayIdx(idx)}
                            className={cn(
                                "flex-shrink-0 flex flex-col items-center py-2 px-4 rounded-xl border transition-all min-w-[70px]",
                                isSelected
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-200"
                                    : isTodayDate ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white border-slate-100 text-slate-500"
                            )}
                        >
                            <span className="text-[10px] font-black uppercase opacity-60">
                                {actualDate ? format(actualDate, "EEE", { locale: vi }) : `Ngày ${idx + 1}`}
                            </span>
                            <span className="text-sm font-black">
                                {actualDate ? format(actualDate, "dd") : idx + 1}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Layout Toggle: Mobile (Vertical List) vs Desktop (Horizontal Grid) */}

            {/* MOBILE VIEW */}
            <div className="md:hidden space-y-4">
                {(() => {
                    const dayData = currentWeekData[selectedDayIdx];
                    if (!dayData) return <div className="text-center py-10 text-slate-400">Không có dữ liệu cho ngày này</div>;

                    const actualDate = addDays(baseDate, (currentWeek * 7) + selectedDayIdx);
                    const isTodayDate = isSameDay(startOfDay(actualDate), startOfDay(new Date()));

                    return (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-lg">
                                <span className="text-xs font-black uppercase tracking-widest opacity-60">
                                    {format(actualDate, "EEEE", { locale: vi })} - {format(actualDate, "dd/MM/yyyy")}
                                </span>
                                <div className="flex flex-col items-end">
                                    <span className="text-lg font-black text-emerald-400 leading-none">{dayData.totalCalories}</span>
                                    <span className="text-[8px] font-black uppercase opacity-60 tracking-tighter">Total Kcal</span>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {mealTypes.map(type => {
                                    const meal = dayData.meals.find(m => m.type === type);
                                    const isPastDate = isBefore(startOfDay(actualDate), startOfDay(new Date()));
                                    const isFutureDate = isAfter(startOfDay(actualDate), startOfDay(new Date()));
                                    const mealKey = `${dayData.day}-${type}`;

                                    return meal ? (
                                        <MealCard
                                            key={type}
                                            meal={meal}
                                            dayData={dayData}
                                            type={type}
                                            isTodayDate={isTodayDate}
                                            isPastDate={isPastDate}
                                            isFutureDate={isFutureDate}
                                            mealKey={mealKey}
                                        />
                                    ) : (
                                        <div key={type} className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-300 text-xs italic">
                                            Chưa có món ăn cho {type}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[1100px] grid grid-cols-[110px_repeat(7,1fr)] gap-4">
                    <div className="sticky left-0 z-10"></div>
                    {Array.from({ length: 7 }).map((_, idx) => {
                        const dayData = currentWeekData[idx];
                        const actualDate = dayData ? addDays(baseDate, (currentWeek * 7) + idx) : null;
                        const isTodayDate = actualDate ? isSameDay(startOfDay(actualDate), startOfDay(new Date())) : false;
                        const isPastDate = actualDate ? isBefore(startOfDay(actualDate), startOfDay(new Date())) : false;

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "text-center py-5 rounded-3xl border shadow-sm transition-all relative overflow-hidden",
                                    isTodayDate ? "bg-emerald-500 border-emerald-400 shadow-xl shadow-emerald-100" : "bg-white border-slate-100",
                                    isPastDate && "bg-slate-50 border-slate-200 opacity-60"
                                )}
                            >
                                <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60", isTodayDate ? "text-emerald-50" : "text-slate-400")}>
                                    {actualDate ? format(actualDate, "EEEE", { locale: vi }) : `Ngày ${idx + 1}`}
                                </div>
                                <div className={cn("text-base font-black tracking-tight", isTodayDate ? "text-white" : "text-slate-900")}>
                                    {actualDate ? format(actualDate, "dd/MM/yyyy") : `Ngày ${idx + 1}`}
                                </div>
                            </div>
                        );
                    })}

                    {mealTypes.map((type) => (
                        <React.Fragment key={type}>
                            <div className="sticky left-0 flex flex-col items-center justify-center gap-2 py-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-sm z-10">
                                <div className={cn("p-2.5 rounded-2xl border-2 shadow-sm", mealTypeColors[type])}>
                                    {mealTypeIcons[type]}
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{type}</span>
                            </div>

                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                                const dayData = currentWeekData[dayIdx];
                                const meal = dayData?.meals.find((m) => m.type === type);
                                const actualDate = dayData ? addDays(baseDate, (currentWeek * 7) + dayIdx) : null;
                                const isTodayDate = actualDate ? isSameDay(startOfDay(actualDate), startOfDay(new Date())) : false;
                                const isPastDate = actualDate ? isBefore(startOfDay(actualDate), startOfDay(new Date())) : false;
                                const isFutureDate = actualDate ? isAfter(startOfDay(actualDate), startOfDay(new Date())) : false;
                                const mealKey = dayData ? `${dayData.day}-${type}` : null;

                                return (
                                    <div key={`${type}-${dayIdx}`} className="h-full">
                                        {meal ? (
                                            <MealCard
                                                meal={meal}
                                                dayData={dayData}
                                                type={type}
                                                isTodayDate={isTodayDate}
                                                isPastDate={isPastDate}
                                                isFutureDate={isFutureDate}
                                                mealKey={mealKey}
                                            />
                                        ) : (
                                            <div className="h-full min-h-[140px] rounded-3xl border border-dashed border-slate-100 bg-slate-50/20 flex items-center justify-center opacity-30 italic text-[10px] text-slate-400">
                                                Hết món
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}

                    {/* Total Row Desktop */}
                    <div className="sticky left-0 flex items-center justify-center py-6 rounded-3xl bg-slate-900 text-white shadow-2xl z-10 border border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Calo</span>
                    </div>
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const dayData = currentWeekData[dayIdx];
                        return (
                            <div
                                key={`total-${dayIdx}`}
                                className="py-6 rounded-3xl bg-emerald-50/50 border-2 border-emerald-100 flex flex-col items-center justify-center transition-all hover:bg-emerald-50"
                            >
                                <div className="text-2xl font-black text-emerald-600 tracking-tighter">
                                    {dayData?.totalCalories || 0}
                                </div>
                                <div className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest">kcal / ngày</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; background-clip: content-box; }
            `}</style>

            <MealLogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onSwapSuccess}
                plannedMealId={selectedMeal?.id}
                mealType={selectedMeal?.type || ""}
                day={selectedMeal?.day || 0}
            />
        </div>
    );
};
