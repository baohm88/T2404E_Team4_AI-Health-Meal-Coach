"use client";

import { mealLogService } from "@/services/meal-log.service";
import { mealPlanService } from "@/services/meal-plan.service";
import { clsx, type ClassValue } from "clsx";
import { addDays, differenceInDays, format, isAfter, isBefore, isSameDay, parseISO, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import {
    Calendar, Check, ChevronLeft, ChevronRight, Coffee,
    Loader2, Lock, Moon, RefreshCw,
    Sparkles,
    Sun,
    Trophy,
    Utensils,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { memo, useMemo, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { EvaluationModal } from "./EvaluationModal";
import { MealLogModal } from "./MealLogModal";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Meal {
    id: number;
    plannedMealId?: number;
    mealName: string;
    quantity: string;
    calories: number;
    plannedCalories: number;
    type: string;
    checkedIn?: boolean;
}

interface DayPlan {
    day: number;
    meals: Meal[];
    totalCalories: number;
    totalPlannedCalories: number;
}

interface WeeklyMealCalendarProps {
    initialData: {
        mealPlan: DayPlan[];
        monthlyPlan?: {
            goal: string;
            totalTargetWeightChangeKg: number;
            months: {
                month: number;
                title: string;
                dailyCalories: number;
                note: string;
            }[];
        };
    };
    startDate: string;
    onExtendPlan?: () => void;
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

const mealTypeGradients: Record<string, string> = {
    Sáng: "from-blue-400 to-indigo-500",
    Trưa: "from-orange-400 to-rose-400",
    Tối: "from-indigo-400 to-purple-600",
    Phụ: "from-emerald-400 to-teal-600",
};

// Minimalist "Apple Health" Style Card
const CombinedMealCard = memo(({
    meals,
    dayData,
    type,
    isTodayDate,
    isPastDate,
    isFutureDate,
    confirmedMeals,
    handleCheckIn,
    handleSwapClick,
    loggingId
}: any) => {
    const totalCalories = meals.reduce((sum: number, m: any) => sum + (m.calories || 0), 0);
    const totalPlannedCalories = meals.reduce((sum: number, m: any) => sum + (m.plannedCalories || 0), 0);
    const allCheckedIn = meals.every((m: any) => m.checkedIn || confirmedMeals.has(m.id));

    // Soft pastel accents
    const accentColor = useMemo(() => {
        switch (type) {
            case "Sáng": return "bg-blue-50 text-blue-600";
            case "Trưa": return "bg-orange-50 text-orange-600";
            case "Tối": return "bg-indigo-50 text-indigo-600";
            default: return "bg-emerald-50 text-emerald-600";
        }
    }, [type]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            layout
            className={cn(
                "h-full p-4.5 rounded-[2rem] flex flex-col transition-all duration-300 relative group border",
                isTodayDate
                    ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-transparent ring-1 ring-black/5"
                    : "bg-white border-slate-100 shadow-sm",
                isPastDate && "bg-slate-50/50 grayscale-[0.5] opacity-75",
                isFutureDate && "opacity-40 blur-[1px] grayscale bg-slate-50 pointer-events-none select-none"
            )}
        >
            {/* 1. Minimal Header */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0",
                        allCheckedIn ? "bg-emerald-500 text-white" : accentColor
                    )}>
                        {allCheckedIn
                            ? <Check className="w-4.5 h-4.5" strokeWidth={3} />
                            : React.cloneElement(mealTypeIcons[type] as React.ReactElement<any>, { className: "w-4.5 h-4.5" })
                        }
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider leading-none truncate">
                            {type}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className={cn(
                                "text-xl font-black tracking-tight leading-none",
                                allCheckedIn ? "text-emerald-600" : "text-slate-900"
                            )}>
                                {totalCalories}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Status / Deviation Bubble */}
                {totalPlannedCalories > 0 && totalCalories !== totalPlannedCalories && !isFutureDate && (
                    <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0",
                        Math.abs(totalCalories - totalPlannedCalories) > 50
                            ? "bg-red-50 text-red-500"
                            : "bg-slate-100 text-slate-500"
                    )}>
                        {totalCalories > totalPlannedCalories ? "+" : "-"}{Math.abs(totalCalories - totalPlannedCalories)}
                    </div>
                )}
            </div>

            {/* 2. Clean List */}
            <div className="flex-1 space-y-3.5 mb-2">
                {meals.map((meal: any) => {
                    const isChecked = meal.checkedIn || confirmedMeals.has(meal.id);
                    const canCheck = !isFutureDate;

                    return (
                        <div key={meal.id} className="group/item flex items-start gap-2.5">
                            {/* Custom Checkbox */}
                            <button
                                onClick={() => canCheck && handleCheckIn(meal.id, dayData.day, type, meal.mealName, meal.calories)}
                                disabled={!canCheck}
                                className={cn(
                                    "mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                                    isChecked
                                        ? "bg-emerald-500 border-white ring-2 ring-emerald-100"
                                        : "border-slate-200 hover:border-emerald-400 bg-white"
                                )}
                            >
                                {isChecked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                            </button>

                            <div className="flex-1 flex flex-col pt-0.5 min-w-0">
                                <div className="flex justify-between items-start w-full">
                                    <span className={cn(
                                        "text-[12px] font-medium leading-snug transition-colors line-clamp-2",
                                        isChecked ? "text-emerald-600 font-bold" : "text-slate-700 font-semibold"
                                    )}>
                                        {meal.mealName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                        <span className="text-[9px] text-slate-500 font-medium">
                                            {meal.quantity}
                                        </span>
                                        <span className="text-[8px] text-slate-300">|</span>
                                        <span className="text-[9px] text-emerald-600 font-bold">
                                            {meal.calories} kcal
                                        </span>
                                    </div>
                                    {/* Inline Actions */}
                                    {!isFutureDate && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSwapClick(meal.id, meal.plannedMealId, dayData.day, type, meal.mealName, meal.calories);
                                            }}
                                            className="text-[9px] font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-colors group-hover/item:opacity-100 opacity-60 flex-shrink-0"
                                        >
                                            <RefreshCw className="w-2.5 h-2.5" />
                                            Đổi
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Subtle Footer Action */}
            {!allCheckedIn && !isFutureDate && (
                <div className="pt-3.5 mt-auto border-t border-slate-50">
                    <button
                        onClick={() => {
                            meals.forEach((m: any) => {
                                if (!m.checkedIn) handleCheckIn(m.id, dayData.day, type, m.mealName, m.calories);
                            });
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-bold transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        {loggingId === `${dayData.day}-${type}` && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                        Hoàn Thành
                    </button>
                </div>
            )}
        </motion.div>
    );
});
CombinedMealCard.displayName = "CombinedMealCard";

export const WeeklyMealCalendar: React.FC<WeeklyMealCalendarProps> = ({
    initialData,
    startDate,
    onExtendPlan
}) => {
    const [mealPlanState, setMealPlanState] = useState<DayPlan[]>(initialData.mealPlan);

    // Initial week & day calculation
    const { initialWeek, initialDay } = useMemo(() => {
        try {
            const base = parseISO(startDate);
            const today = startOfDay(new Date());
            const daysDiff = differenceInDays(today, startOfDay(base));

            const weekIdx = Math.max(0, Math.min(Math.floor(daysDiff / 7), Math.ceil(initialData.mealPlan.length / 7) - 1));
            const dayIdx = Math.max(0, Math.min(daysDiff % 7, 6));

            return { initialWeek: weekIdx, initialDay: dayIdx };
        } catch (e) {
            return { initialWeek: 0, initialDay: 0 };
        }
    }, [startDate, initialData.mealPlan.length]);

    const [currentWeek, setCurrentWeek] = useState(initialWeek);
    const [selectedDayIdx, setSelectedDayIdx] = useState(initialDay); // For Mobile View
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
    const [selectedMeal, setSelectedMeal] = useState<{ id: number; plannedMealId?: number; day: number; type: string; mealName: string; calories: number } | null>(null);
    const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
    const [isResetLoading, setIsResetLoading] = useState(false);
    const router = useRouter();

    const [confirmedMeals, setConfirmedMeals] = useState<Set<number>>(() => {
        const initialConfirmed = new Set<number>();
        initialData.mealPlan.forEach(day => {
            day.meals.forEach(meal => {
                if (meal.checkedIn) {
                    initialConfirmed.add(meal.id);
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

    // Sync state when props change
    React.useEffect(() => {
        const oldWeeksCount = Math.ceil(mealPlanState.length / 7);
        const newWeeksCount = Math.ceil(initialData.mealPlan.length / 7);

        setMealPlanState(initialData.mealPlan);

        const newConfirmed = new Set<number>();
        initialData.mealPlan.forEach(day => {
            day.meals.forEach(meal => {
                if (meal.checkedIn) {
                    newConfirmed.add(meal.id);
                }
            });
        });
        setConfirmedMeals(newConfirmed);

        // Auto-navigate to next week if a new week was just added
        if (newWeeksCount > oldWeeksCount && oldWeeksCount > 0) {
            setCurrentWeek(newWeeksCount - 1);
            toast("Lộ trình tuần mới đã sẵn sàng!", { icon: <Sparkles className="w-4 h-4 text-emerald-500" /> });
        }
    }, [initialData.mealPlan]);

    const completionStats = useMemo(() => {
        if (!currentWeekData || currentWeekData.length === 0) return { percent: 0, totalPlanned: 0, totalActual: 0, isCompleted: false, exceededDetails: [] };
        let totalPlanned = 0;
        let totalActual = 0;
        let totalMealsCount = 0;
        let checkedMealsCount = 0;
        const exceededDetails: { day: number; type: string; excess: number }[] = [];

        currentWeekData.forEach(day => {
            totalPlanned += (day.totalPlannedCalories || 0);

            day.meals.forEach(meal => {
                if (meal.id !== -1) {
                    totalMealsCount++;
                    if (meal.checkedIn || confirmedMeals.has(meal.id)) {
                        checkedMealsCount++;
                        const actual = meal.calories || meal.plannedCalories;
                        totalActual += actual;

                        if (actual > meal.plannedCalories) {
                            exceededDetails.push({
                                day: day.day,
                                type: meal.type,
                                excess: actual - meal.plannedCalories
                            });
                        }
                    }
                }
            });
        });

        const mealCompliance = totalMealsCount > 0 ? Math.round((checkedMealsCount / totalMealsCount) * 100) : 0;
        const calorieCompliance = totalPlanned > 0 ? Math.max(0, Math.round(100 - (Math.abs(totalActual - totalPlanned) / totalPlanned) * 100)) : 0;
        const isCompleted = totalMealsCount > 0 && checkedMealsCount === totalMealsCount;
        const isPassed = mealCompliance >= 80 && calorieCompliance >= 80;

        return {
            mealCompliance,
            calorieCompliance,
            totalPlanned,
            totalActual,
            totalMealsCount,
            checkedMealsCount,
            isCompleted,
            isPassed,
            exceededDetails
        };
    }, [currentWeekData, confirmedMeals]);

    const nextWeek = () => setCurrentWeek((prev) => Math.min(prev + 1, totalWeeks - 1));
    const prevWeek = () => setCurrentWeek((prev) => Math.max(prev - 1, 0));

    const handleCheckIn = async (mealId: number, day: number, type: string, mealName: string, calories: number) => {
        try {
            setLoggingId(`${day}-${type}`);
            const res = await mealLogService.checkInPlannedMealById(mealId) as any;

            if (res.success) {
                setConfirmedMeals(prev => new Set(prev).add(mealId));
                toast.success(`Đã check-in món ${mealName}!`);
            } else {
                toast.error(res.message || "Không thể xác nhận món ăn.");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Lỗi kết nối server.";
            toast.error(`Lỗi: ${errorMsg}`);
        } finally {
            setLoggingId(null);
        }
    };

    const handleNextWeekEvaluation = () => {
        setIsEvaluationOpen(true);
    };

    const confirmNextWeek = async () => {
        try {
            setIsResetLoading(true);
            if (currentWeek === totalWeeks - 1) {
                if (onExtendPlan) onExtendPlan();
            } else {
                nextWeek();
            }
            setIsEvaluationOpen(false);
            toast.success("Tuyệt vời! Hãy tiếp tục duy trì phong độ nhé.");
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi chuyển tuần.");
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleResetPlan = async () => {
        try {
            setIsResetLoading(true);
            const res = await mealPlanService.resetMealPlan();
            if (res.success) {
                toast.success("Lộ trình đã được thiết lập lại từ Tuần 1.");
                window.location.reload(); // Refresh to get new data
            } else {
                toast.error(res.message || "Không thể reset lộ trình.");
            }
        } catch (error) {
            toast.error("Lỗi kết nối máy chủ.");
        } finally {
            setIsResetLoading(false);
            setIsEvaluationOpen(false);
        }
    };

    const handleSwapClick = (mealId: number, plannedMealId: number | undefined, day: number, type: string, mealName: string, calories: number) => {
        setSelectedMeal({ id: mealId, plannedMealId, day, type, mealName, calories });
        setIsModalOpen(true);
    };

    const onSwapSuccess = (newData: any) => {
        if (selectedMeal) {
            // Cập nhật state UI ngay lập tức
            setMealPlanState(prev => prev.map(dayPlan => {
                if (dayPlan.day === selectedMeal.day) {
                    const updatedMeals = dayPlan.meals.map(m => {
                        if (m.id === selectedMeal.id) {
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

            setConfirmedMeals(prev => new Set(prev).add(selectedMeal.id));
            toast.success("Đã cập nhật bữa ăn mới bằng AI!");
        }
    };

    return (
        <div className="w-full max-w-full px-4 md:px-8 mx-auto space-y-4">
            {/* Unified Control Dashboard - Aligned with Grid */}
            <div className="max-w-[1600px] mx-auto bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5 space-y-6">
                {/* Header Row: Month Selectors & Week Navigation */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-5 border-b border-slate-100/50">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-emerald-500 rounded-[1.2rem] text-white shadow-lg shadow-emerald-500/30">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-3">
                            {initialData.monthlyPlan?.months.map((month, idx) => {
                                const isLocked = idx > 0;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => !isLocked && setSelectedMonthIdx(idx)}
                                        disabled={isLocked}
                                        className={cn(
                                            "px-5 py-2.5 rounded-xl font-black text-[10px] transition-all border shadow-sm flex items-center gap-2 uppercase tracking-widest",
                                            selectedMonthIdx === idx
                                                ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-200"
                                                : isLocked
                                                    ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/30 active:scale-95"
                                        )}
                                    >
                                        Tháng {month.month}
                                        {isLocked && <Lock className="w-3 h-3" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/5 p-1.5 rounded-[1.2rem]">
                        <button
                            onClick={prevWeek}
                            disabled={currentWeek === 0}
                            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white/50"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="px-8 py-1 text-sm font-black text-slate-800 min-w-[140px] text-center uppercase tracking-[0.2em]">
                            Tuần {currentWeek + 1}
                        </span>
                        <button
                            onClick={nextWeek}
                            disabled={currentWeek === totalWeeks - 1}
                            className="p-2 bg-white/50 hover:bg-white text-slate-600 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Info Row: Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    <div className="space-y-1 p-3 rounded-2xl hover:bg-white/30 transition-colors">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Giai đoạn hiện tại</span>
                        <p className="text-lg font-black text-slate-800 leading-tight">
                            {initialData.monthlyPlan?.months[selectedMonthIdx].title}
                        </p>
                    </div>

                    <div className="space-y-1 p-3 rounded-2xl hover:bg-white/30 transition-colors border-l border-slate-100/50">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Mục tiêu Calo</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-slate-900">{initialData.monthlyPlan?.months[selectedMonthIdx].dailyCalories}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">kcal/ngày</span>
                        </div>
                    </div>

                    <div className="space-y-3 p-3 rounded-2xl bg-white/40 border border-white/60 shadow-xl shadow-black/[0.02]">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Tiến độ Calo</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-black text-slate-800">{completionStats.totalActual}</span>
                                <span className="text-[8px] font-bold text-slate-400">/ {completionStats.totalPlanned}</span>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionStats.mealCompliance}%` }}
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    completionStats.mealCompliance >= 80
                                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                        : "bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 p-3 rounded-2xl hover:bg-white/30 transition-colors">
                        {completionStats.isCompleted ? (
                            <div className="space-y-2.5">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest block",
                                    completionStats.isPassed ? "text-emerald-600" : "text-orange-600"
                                )}>
                                    {completionStats.isPassed ? "Kết quả: Đạt" : "Kết quả: Cần Reset"}
                                </span>
                                <button
                                    onClick={handleNextWeekEvaluation}
                                    className={cn(
                                        "group/analyze relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl transition-all w-full overflow-hidden border border-white/20 shadow-lg active:scale-95",
                                        completionStats.isPassed
                                            ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 shadow-emerald-200/50 hover:shadow-emerald-200/80"
                                            : "bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 shadow-orange-200/50 hover:shadow-orange-200/80"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/analyze:translate-x-full transition-transform duration-1000 ease-in-out" />
                                    <Trophy className="w-4 h-4 text-white group-hover/analyze:scale-110 transition-transform drop-shadow-sm" />
                                    <span className="text-xs font-black text-white tracking-tight uppercase">
                                        {completionStats.isPassed ? "Tiếp tục lộ trình" : "Phân tích & Reset"}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1 w-full">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Ghi chú AI</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed line-clamp-2">
                                    &quot;{initialData.monthlyPlan?.months[selectedMonthIdx].note}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EvaluationModal
                isOpen={isEvaluationOpen}
                onClose={() => setIsEvaluationOpen(false)}
                stats={{
                    totalMeals: completionStats.totalMealsCount,
                    checkedMeals: completionStats.checkedMealsCount,
                    mealCompliance: completionStats.mealCompliance,
                    totalPlannedCal: completionStats.totalPlanned,
                    totalActualCal: completionStats.totalActual,
                    calorieCompliance: completionStats.calorieCompliance,
                    exceededDetails: completionStats.exceededDetails
                }}
                onSuccess={confirmNextWeek}
                onFailure={handleResetPlan}
                isLoading={isResetLoading}
            />

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
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-black text-emerald-400 leading-none">{dayData.totalCalories}</span>
                                    </div>
                                    <span className="text-[8px] font-black uppercase opacity-60 tracking-tighter">
                                        Mục tiêu: {dayData.totalPlannedCalories || dayData.totalCalories} kcal
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {mealTypes.map(type => {
                                    const mealsOfType = dayData.meals.filter((m) => m.type === type);
                                    const isPastDate = isBefore(startOfDay(actualDate), startOfDay(new Date()));
                                    const isFutureDate = isAfter(startOfDay(actualDate), startOfDay(new Date()));

                                    return (
                                        <div key={type} className="flex flex-col gap-2">
                                            {mealsOfType.length > 0 ? (
                                                <CombinedMealCard
                                                    meals={mealsOfType}
                                                    dayData={dayData}
                                                    type={type}
                                                    isTodayDate={isTodayDate}
                                                    isPastDate={isPastDate}
                                                    isFutureDate={isFutureDate}
                                                    confirmedMeals={confirmedMeals}
                                                    handleCheckIn={handleCheckIn}
                                                    handleSwapClick={handleSwapClick}
                                                    loggingId={loggingId}
                                                />
                                            ) : (
                                                <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-300 text-xs italic">
                                                    Chưa có món ăn cho {type}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* DESKTOP VIEW - Harmonious Center Layout */}
            <div className="hidden md:block w-full">
                <div className="max-w-[1600px] mx-auto grid grid-cols-[90px_repeat(7,1fr)] gap-2.5">
                    {/* Header Row: Corner Cell - Focus Box */}
                    <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg p-2 text-center group">
                        <motion.div
                            animate={{
                                opacity: [0.4, 1, 0.4],
                                scale: [0.95, 1.05, 0.95]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"
                        >
                            <Zap className="w-3.5 h-3.5 text-emerald-500" />
                        </motion.div>
                        <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest leading-none">Tiêu điểm</span>
                        <span className="text-[8px] font-bold text-slate-400 leading-tight">Chế độ Zen</span>
                    </div>
                    {Array.from({ length: 7 }).map((_, idx) => {
                        const dayData = currentWeekData[idx];
                        const actualDate = dayData ? addDays(baseDate, (currentWeek * 7) + idx) : null;
                        const isTodayDate = actualDate ? isSameDay(startOfDay(actualDate), startOfDay(new Date())) : false;
                        const isPastDate = actualDate ? isBefore(startOfDay(actualDate), startOfDay(new Date())) : false;

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "text-center py-4 rounded-3xl border shadow-sm transition-all relative overflow-hidden",
                                    isTodayDate ? "bg-emerald-500 border-emerald-400 shadow-xl shadow-emerald-100" : "bg-white border-slate-100",
                                    isPastDate && "bg-slate-50 border-slate-200 opacity-60",
                                    (actualDate && isAfter(startOfDay(actualDate), startOfDay(new Date()))) && "opacity-40 blur-[1px] grayscale bg-slate-50 select-none"
                                )}
                            >
                                <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-60", isTodayDate ? "text-emerald-50" : "text-slate-400")}>
                                    {actualDate ? format(actualDate, "EEEE", { locale: vi }) : `Ngày ${idx + 1}`}
                                </div>
                                <div className={cn("text-base font-black tracking-tight", isTodayDate ? "text-white" : "text-slate-900")}>
                                    {actualDate ? format(actualDate, "dd/MM") : `Ngày ${idx + 1}`}
                                </div>
                            </div>
                        );
                    })}

                    {mealTypes.map((type) => (
                        <React.Fragment key={type}>
                            {/* Meal Type Label (Sticky Left) */}
                            <div className="sticky left-0 z-20 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-3 text-center group">
                                <div className={cn("w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg mb-2 ring-2 ring-white transition-all group-hover:scale-105", mealTypeGradients[type])}>
                                    {React.cloneElement(mealTypeIcons[type] as React.ReactElement<any>, { className: "w-5 h-5" })}
                                </div>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{type}</span>
                                <div className="mt-1.5 flex flex-col items-center gap-1">
                                    <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50 whitespace-nowrap shadow-sm">
                                        {type === 'Sáng' ? '07:00' : type === 'Trưa' ? '12:00' : type === 'Tối' ? '19:00' : '15:30'}
                                    </span>
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">
                                        {type === 'Sáng' ? 'ENERGY' : type === 'Trưa' ? 'POWER' : type === 'Tối' ? 'MINIMAL' : 'SNACK'}
                                    </span>
                                </div>
                            </div>

                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                                const dayData = currentWeekData[dayIdx];
                                const mealsOfType = dayData?.meals.filter((m) => m.type === type) || [];
                                const actualDate = dayData ? addDays(baseDate, (currentWeek * 7) + dayIdx) : null;
                                const isTodayDate = actualDate ? isSameDay(startOfDay(actualDate), startOfDay(new Date())) : false;
                                const isPastDate = actualDate ? isBefore(startOfDay(actualDate), startOfDay(new Date())) : false;
                                const isFutureDate = actualDate ? isAfter(startOfDay(actualDate), startOfDay(new Date())) : false;

                                return (
                                    <div key={`${type}-${dayIdx}`} className="h-full flex flex-col gap-2">
                                        {mealsOfType.length > 0 ? (
                                            <CombinedMealCard
                                                meals={mealsOfType}
                                                dayData={dayData}
                                                type={type}
                                                isTodayDate={isTodayDate}
                                                isPastDate={isPastDate}
                                                isFutureDate={isFutureDate}
                                                confirmedMeals={confirmedMeals}
                                                handleCheckIn={handleCheckIn}
                                                handleSwapClick={handleSwapClick}
                                                loggingId={loggingId}
                                            />
                                        ) : (
                                            <div className="p-4 border border-dashed border-slate-100 rounded-[2rem] text-center text-slate-300 text-[10px] italic h-full flex items-center justify-center bg-slate-50/30">
                                                Nghỉ
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}

                    {/* Total Row Desktop - Premium Metric Cards */}
                    <div className="sticky left-0 flex flex-col items-center justify-center py-6 rounded-3xl bg-slate-900 text-white shadow-2xl z-20 border border-slate-800 group/label">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1 group-hover/label:scale-110 transition-transform">
                            <Zap className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng</span>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
                    </div>
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const dayData = currentWeekData[dayIdx];
                        const actualDate = dayData ? addDays(baseDate, (currentWeek * 7) + dayIdx) : null;
                        const isToday = actualDate ? isSameDay(startOfDay(actualDate), startOfDay(new Date())) : false;

                        // Calculate Accuracy Score: 100% - (|Actual - Goal| / Goal * 100%)
                        const deviation = dayData?.totalPlannedCalories
                            ? Math.abs((dayData.totalCalories || 0) - dayData.totalPlannedCalories)
                            : 0;
                        const accuracy = dayData?.totalPlannedCalories
                            ? Math.max(0, 100 - (deviation / dayData.totalPlannedCalories * 100))
                            : 0;

                        return (
                            <div
                                key={`total-${dayIdx}`}
                                className={cn(
                                    "p-4 rounded-[2rem] border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between min-h-[100px]",
                                    isToday
                                        ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/20"
                                        : "bg-white border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md",
                                    (actualDate && isAfter(startOfDay(actualDate), startOfDay(new Date()))) && "opacity-40 grayscale-[0.8] bg-slate-50/50"
                                )}
                            >
                                {/* Metric Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Thực tế</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className={cn(
                                                "text-2xl font-black tracking-tight",
                                                isToday ? "text-emerald-600" : "text-slate-900"
                                            )}>
                                                {dayData?.totalCalories || 0}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">kcal</span>
                                        </div>
                                    </div>

                                    {dayData && dayData.totalPlannedCalories > 0 && dayData.totalCalories !== dayData.totalPlannedCalories && (
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-black",
                                            dayData.totalCalories > dayData.totalPlannedCalories
                                                ? "bg-red-50 text-red-500"
                                                : "bg-emerald-50 text-emerald-500"
                                        )}>
                                            {dayData.totalCalories > dayData.totalPlannedCalories ? '+' : ''}
                                            {dayData.totalCalories - dayData.totalPlannedCalories}
                                        </div>
                                    )}
                                </div>

                                {/* Accuracy Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Mục tiêu</span>
                                            <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                                {dayData?.totalPlannedCalories}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-[9px] font-black transition-colors",
                                            accuracy >= 95 ? "text-emerald-500" : accuracy >= 85 ? "text-orange-500" : "text-red-500"
                                        )}>
                                            {Math.round(accuracy)}% Chính xác
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${accuracy}%` }}
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                accuracy >= 95
                                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                                    : accuracy >= 85
                                                        ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                                        : "bg-gradient-to-r from-red-400 to-red-600"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <MealLogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mealType={selectedMeal?.type || ""}
                day={selectedMeal?.day || 0}
                plannedMealId={selectedMeal?.plannedMealId}
                onSuccess={onSwapSuccess}
            />
        </div >
    );
};
