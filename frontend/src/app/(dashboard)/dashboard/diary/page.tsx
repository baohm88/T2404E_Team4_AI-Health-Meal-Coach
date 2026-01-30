'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Loader2, Calendar, Target, Zap, Clock, CheckCircle2, Flame, Info, Search, Sparkles, TrendingUp, Apple, Coffee, Utensils, Moon } from 'lucide-react';
import { mealPlanService, MealPlanResponse, DayPlan } from '@/services/meal-plan.service';
import { format, differenceInDays, startOfDay, addDays, isSameDay, isAfter } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DiaryPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [planData, setPlanData] = useState<MealPlanResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setIsLoading(true);
                const response = await mealPlanService.getMealPlan();
                if (response.success) {
                    setPlanData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch meal plan:", error);
                toast.error("Không thể tải nhật ký ăn uống");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, []);

    const currentDayData = useMemo(() => {
        if (!planData || !planData.startDate) return null;

        const start = startOfDay(new Date(planData.startDate));
        const current = startOfDay(selectedDate);
        const dayDiff = differenceInDays(current, start) + 1; // 1-indexed

        return planData.mealPlan.find(d => d.day === dayDiff) || null;
    }, [planData, selectedDate]);

    const days = useMemo(() => {
        const daysArr = [];
        for (let i = -3; i <= 3; i++) {
            daysArr.push(addDays(selectedDate, i));
        }
        return daysArr;
    }, [selectedDate]);

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const mealSections = useMemo(() => {
        const mandatoryCategories = [
            { key: 'Sáng', name: 'Bữa sáng', icon: <Apple className="w-5 h-5" />, gradient: 'from-orange-400 to-rose-400', time: '07:00' },
            { key: 'Trưa', name: 'Bữa trưa', icon: <Utensils className="w-5 h-5" />, gradient: 'from-emerald-400 to-cyan-400', time: '12:00' },
            { key: 'Tối', name: 'Bữa tối', icon: <Moon className="w-5 h-5" />, gradient: 'from-indigo-400 to-purple-400', time: '19:00' },
            { key: 'Phụ', name: 'Ăn vặt', icon: <Coffee className="w-5 h-5" />, gradient: 'from-amber-400 to-orange-400', time: '15:30' },
        ];

        if (!currentDayData) return mandatoryCategories.map(c => ({ ...c, items: [] }));

        return mandatoryCategories.map(cat => {
            const meal = currentDayData.meals.find(m => m.type === cat.key);
            return {
                ...cat,
                items: meal && meal.id !== -1 ? [meal] : []
            };
        });
    }, [currentDayData]);

    const consumedCalories = useMemo(() => {
        if (!currentDayData) return 0;
        return currentDayData.meals
            .filter(meal => meal.checkedIn)
            .reduce((sum, meal) => sum + meal.calories, 0);
    }, [currentDayData]);

    const isToday = (date: Date) => isSameDay(date, new Date());
    const isSelected = (date: Date) => isSameDay(date, selectedDate);

    return (
        <div className="relative min-h-screen -mt-8 -mx-8 px-8 pt-12 pb-32 overflow-hidden bg-[#FBFBFE]">
            {/* Ethereal Background Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">
                {/* Header: Ethereal Floating Title */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest"
                        >
                            <Sparkles className="w-4 h-4 fill-emerald-500" />
                            Lộ trình Sức khỏe
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl font-black text-slate-900 tracking-tightest leading-none capitalize"
                        >
                            {isToday(selectedDate) ? "Nhịp Sống Hôm Nay" : format(selectedDate, 'eeee', { locale: vi })}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 bg-white/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-white/60 shadow-2xl shadow-slate-200/50"
                    >
                        {days.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "relative w-12 h-16 rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-500",
                                    isSelected(day) ? "bg-slate-900 text-white shadow-xl scale-110 z-10" : "hover:bg-white/60 text-slate-400"
                                )}
                            >
                                <span className="text-[8px] font-black uppercase tracking-tighter mb-1">{dayNames[day.getDay()]}</span>
                                <span className="text-sm font-black">{day.getDate()}</span>
                                {isToday(day) && !isSelected(day) && (
                                    <div className="absolute bottom-2 w-1 h-1 rounded-full bg-emerald-500" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: The "Orb" of Metrics */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            layout
                            className="aspect-square rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-3xl shadow-slate-200/50 flex flex-col items-center justify-center p-8 relative group"
                        >
                            <div className="absolute inset-4 rounded-[2.5rem] border border-dashed border-slate-200 opacity-50 group-hover:opacity-100 transition-opacity" />

                            {isLoading ? (
                                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                            ) : currentDayData ? (
                                <>
                                    <div className="text-center space-y-1 relative z-10">
                                        <div className="flex items-center justify-center gap-2 text-slate-400">
                                            <Flame className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Năng Lượng</span>
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-6xl font-black text-slate-900 tracking-tighter"
                                        >
                                            {consumedCalories}
                                        </motion.div>
                                        <div className="text-sm font-bold text-emerald-500">
                                            trên {currentDayData.totalPlannedCalories} kcal mục tiêu
                                        </div>
                                    </div>

                                    {/* Circular Progress (Minimalist SVG) */}
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-8 pointer-events-none">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            className="stroke-slate-100/50 fill-none stroke-[2]"
                                        />
                                        <motion.circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            className="stroke-emerald-500 fill-none stroke-[4]"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: Math.min((consumedCalories / (currentDayData.totalPlannedCalories || 1)), 1) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                </>
                            ) : (
                                <span className="text-slate-300 font-bold italic text-sm">Chưa có kế hoạch</span>
                            )}
                        </motion.div>

                        {/* Macro Glass Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Đạm', value: '124g', color: 'orange', trend: '+12%' },
                                { label: 'Tinh bột', value: '240g', color: 'blue', trend: '-5%' },
                                { label: 'Chất béo', value: '62g', color: 'purple', trend: '+2%' },
                                { label: 'Tiêu hao', value: '450', color: 'rose', trend: 'Tích cực' },
                            ].map((macro, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="p-4 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-slate-200/50"
                                >
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">{macro.label}</span>
                                    <div className="flex items-end justify-between">
                                        <span className="text-xl font-black text-slate-900">{macro.value}</span>
                                        <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full",
                                            macro.color === 'orange' ? "bg-orange-100 text-orange-600" :
                                                macro.color === 'blue' ? "bg-blue-100 text-blue-600" :
                                                    macro.color === 'purple' ? "bg-purple-100 text-purple-600" : "bg-rose-100 text-rose-600"
                                        )}>{macro.trend}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: The Activity Flow */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-slate-900" />
                                Nhịp Điệu Ăn Uống
                            </h2>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-300">
                                <Plus className="w-4 h-4" />
                                Ghi bữa ăn
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LayoutGroup>
                                {isLoading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-44 bg-white/20 rounded-[2.5rem] animate-pulse" />
                                    ))
                                ) : (
                                    mealSections.map((section, idx) => (
                                        <motion.div
                                            key={section.key}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group relative"
                                        >
                                            <div className={cn(
                                                "h-full p-8 bg-white/60 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 hover:shadow-3xl hover:shadow-slate-300/50 transition-all duration-500 overflow-hidden",
                                                section.items.length === 0 && "border-dashed border-slate-200/50 opacity-60",
                                                isAfter(startOfDay(selectedDate), startOfDay(new Date())) && "opacity-30 grayscale-[0.5]"
                                            )}>
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", section.gradient)}>
                                                            {section.icon}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-slate-900 leading-none">{section.name}</h3>
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{section.time}</p>
                                                        </div>
                                                    </div>
                                                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-200 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                                        <Search className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Items */}
                                                <div className="space-y-4">
                                                    {section.items.length > 0 ? (
                                                        section.items.map((item, i) => (
                                                            <div key={i} className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-slate-800 tracking-tight leading-tight">{item.mealName}</span>
                                                                        {item.checkedIn && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đã ghi nhận</span>
                                                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Khớp AI</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-lg font-black text-slate-900 block leading-none">{item.calories}</span>
                                                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">kCal</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex items-center justify-center py-4">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic tracking-tightest">Chờ dữ liệu</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Decorative Glow */}
                                                <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity", section.gradient)} />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </LayoutGroup>
                        </div>
                    </div>
                </div>

                {/* Footer: AI Strategist Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-3xl shadow-slate-900/40"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Zap className="w-12 h-12 text-slate-900 fill-slate-900" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Góc nhìn Chiến lược AI</span>
                            <div className="px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[8px] font-black uppercase text-emerald-400">Cao cấp</div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tightest leading-tight">
                            {consumedCalories === 0
                                ? "Bắt đầu hành trình hôm nay."
                                : consumedCalories > (currentDayData?.totalPlannedCalories || 0)
                                    ? "Lượng calo vượt mức mục tiêu."
                                    : consumedCalories === (currentDayData?.totalPlannedCalories || 0)
                                        ? "Hoàn hảo! Bạn đã đạt mục tiêu."
                                        : "Hiệu suất trao đổi chất đang tốt."
                            }
                        </h3>
                        <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-xl">
                            {consumedCalories === 0
                                ? "Hãy ghi lại bữa ăn đầu tiên để AI có thể phân tích xu hướng dinh dưỡng của bạn chính xác nhất."
                                : consumedCalories > (currentDayData?.totalPlannedCalories || 0)
                                    ? `Bạn đã nạp dư ${consumedCalories - (currentDayData?.totalPlannedCalories || 0)} kcal. Gợi ý: Hãy tăng cường bài tập Cardio vào sáng mai và giảm 10% lượng tinh bột trong 2 ngày tiếp theo để cân bằng lại.`
                                    : consumedCalories === (currentDayData?.totalPlannedCalories || 0)
                                        ? "Tuyệt vời, cơ thể bạn đang ở trạng thái cân bằng lý tưởng. Duy trì nhịp độ ăn uống này sẽ giúp tốc độ chuyển hóa của bạn luôn ổn định."
                                        : `Bạn vẫn còn thiếu ${Math.max(0, (currentDayData?.totalPlannedCalories || 0) - consumedCalories)} kcal. Nếu còn bữa phụ, hãy ưu tiên các thực phẩm giàu đạm như các loại hạt hoặc sữa chua để hỗ trợ phục hồi cơ bắp mà không gây tích mỡ.`
                            }
                        </p>
                    </div>

                    {/* Background Visuals */}
                    <div className="absolute top-0 right-0 w-60 h-full bg-emerald-500/5 skew-x-12 translate-x-20" />
                </motion.div>
            </div>

        </div>
    );
}
