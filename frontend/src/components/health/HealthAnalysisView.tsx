'use client';

import { AIAnalysisResponse } from '@/services/ai.service';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Brain,
  Calendar,
  ChevronDown,
  Dumbbell,
  Flame,
  Heart,
  Moon,
  Utensils,
  Zap
} from 'lucide-react';
import { useState } from 'react';

// ===================================
// TYPES & HELPERS
// ===================================

const HealthStatusMap: Record<string, { label: string; color: string; bg: string }> = {
    UNDERWEIGHT: { label: 'Thiếu cân', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    NORMAL: { label: 'Bình thường', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    OVERWEIGHT: { label: 'Thừa cân', color: 'text-orange-600', bg: 'bg-orange-100' },
    OBESE: { label: 'Béo phì', color: 'text-red-600', bg: 'bg-red-100' },
};

function MetricCard({
    icon,
    label,
    value,
    unit,
    subtitle,
    colorClass
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    subtitle?: string;
    colorClass: string;
}) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mb-3", colorClass)}>
                {icon}
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className="text-2xl font-bold text-slate-800">
                {value}<span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
            </p>
            {subtitle && <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 px-2 py-1 rounded-lg">{subtitle}</p>}
        </div>
    );
}

// ===================================
// MAIN VIEW COMPONENT
// ===================================

interface HealthAnalysisViewProps {
    data: AIAnalysisResponse;
}

export function HealthAnalysisView({ data }: HealthAnalysisViewProps) {
    const { analysis, lifestyleInsights, threeMonthPlan } = data;
    const [expandedMonth, setExpandedMonth] = useState<number>(1);

    const statusInfo = HealthStatusMap[analysis.healthStatus] || { label: analysis.healthStatus, color: 'text-slate-600', bg: 'bg-slate-100' };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
            
            {/* 1. KEY METRICS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    icon={<Activity className="w-6 h-6 text-blue-600" />}
                    label="BMI"
                    value={analysis.bmi.toFixed(1)}
                    subtitle={statusInfo.label}
                    colorClass="bg-blue-50"
                />
                <MetricCard 
                    icon={<Flame className="w-6 h-6 text-orange-600" />}
                    label="BMR"
                    value={analysis.bmr}
                    unit="kcal"
                    subtitle="Trao đổi chất cơ bản"
                    colorClass="bg-orange-50"
                />
                 <MetricCard 
                    icon={<Zap className="w-6 h-6 text-emerald-600" />}
                    label="TDEE"
                    value={analysis.tdee}
                    unit="kcal"
                    subtitle="Tiêu hao hằng ngày"
                    colorClass="bg-emerald-50"
                />
                <MetricCard 
                    icon={<Heart className="w-6 h-6 text-pink-600" />}
                    label="Tình trạng"
                    value={statusInfo.label}
                    subtitle="Dựa trên chỉ số BMI"
                    colorClass="bg-pink-50"
                />
            </div>

            {/* 2. SUMMARY & LIFESTYLE INSIGHTS */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Summary */}
                <div className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Đánh giá tổng quan</h3>
                            <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
                        </div>
                    </div>
                </div>

                {/* Lifestyle Insights List */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        Lối sống & Thói quen
                    </h3>
                    
                    {lifestyleInsights && (
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <Dumbbell className="w-4 h-4 text-blue-500 mt-0.5" />
                                <p className="text-sm text-slate-600">{lifestyleInsights.activity}</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Moon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                <p className="text-sm text-slate-600">{lifestyleInsights.sleep}</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Brain className="w-4 h-4 text-pink-500 mt-0.5" />
                                <p className="text-sm text-slate-600">{lifestyleInsights.stress}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. 3-MONTH PLAN ROADMAP */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-slate-800">Lộ trình 3 tháng</h2>
                </div>

                <div className="space-y-4">
                    {threeMonthPlan?.months?.map((month) => {
                        const isExpanded = expandedMonth === month.month;
                        return (
                            <motion.div 
                                key={month.month}
                                layout
                                className={clsx(
                                    "rounded-2xl border overflow-hidden transition-all",
                                    isExpanded ? "border-emerald-200 bg-white shadow-lg ring-1 ring-emerald-100" : "border-slate-100 bg-white hover:bg-slate-50"
                                )}
                            >
                                {/* Header (Clickable) */}
                                <button 
                                    onClick={() => setExpandedMonth(isExpanded ? 0 : month.month)}
                                    className="w-full flex items-center p-5 text-left"
                                >
                                    <div className={clsx(
                                        "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-lg mr-4 flex-shrink-0 transition-colors",
                                        isExpanded ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                                    )}>
                                        <span>T{month.month}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={clsx("font-bold text-lg", isExpanded ? "text-emerald-800" : "text-slate-700")}>
                                            {month.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {month.dailyCalories} kcal</span>
                                            {month.macronutrients && <span className="hidden sm:inline-flex items-center gap-1"> • {month.macronutrients.split('-')[0]}</span>}
                                        </p>
                                    </div>
                                    <ChevronDown className={clsx("w-5 h-5 text-slate-400 transition-transform", isExpanded && "rotate-180")} />
                                </button>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-slate-100"
                                        >
                                            <div className="p-5 md:p-6 space-y-6 bg-slate-50/50">
                                                
                                                {/* Nutrition & Habits */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                                                            <Utensils className="w-4 h-4" /> Dinh dưỡng
                                                        </h4>
                                                        <p className="text-sm text-slate-600 mb-2 font-medium">{month.macronutrients}</p>
                                                        <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
                                                            {month.habitFocus && <li>{month.habitFocus}</li>}
                                                            {month.mealTips && <li>{month.mealTips}</li>}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                                            <Activity className="w-4 h-4" /> Hoạt động
                                                        </h4>
                                                        <p className="text-sm text-slate-600 mb-2">{month.specificActions}</p>
                                                        <p className="text-xs text-slate-400 italic mt-2">{month.note}</p>
                                                    </div>
                                                </div>

                                                {/* Weekly Detailed Breakdown */}
                                                {month.weeks && month.weeks.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Chi tiết theo tuần</h4>
                                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                            {month.weeks.map((week) => (
                                                                <div key={week.week} className="bg-white p-3 rounded-xl border border-slate-100 text-sm">
                                                                    <div className="font-bold text-emerald-600 mb-1">Tuần {week.week}</div>
                                                                    <div className="font-medium text-slate-800 mb-1">{week.title}</div>
                                                                    <p className="text-slate-500 text-xs line-clamp-3">{week.nutritionFocus}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Sample Meal Plan (If available) */}
                                                {month.sampleDailyMeals && month.sampleDailyMeals.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Thực đơn mẫu 1 ngày</h4>
                                                        <div className="space-y-2">
                                                            {month.sampleDailyMeals.map((meal, idx) => (
                                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-slate-100 gap-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded w-16 text-center">{meal.type}</span>
                                                                        <div>
                                                                            <p className="font-medium text-slate-800">{meal.mealName}</p>
                                                                            <p className="text-xs text-slate-500">{meal.quantity}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-emerald-600 whitespace-nowrap">
                                                                        {meal.calories} kcal
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
