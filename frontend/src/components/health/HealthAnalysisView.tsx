"use client";

import { AIAnalysisResponse } from "@/services/ai.service";
import {
    Activity,
    Calendar,
    Flame,
    Heart,
    TrendingUp,
    Info,
    Utensils,
    Zap,
    Target,
    Moon,
    Smile,
    CheckCircle2,
    MoveRight
} from "lucide-react";

interface HealthAnalysisViewProps {
    data: AIAnalysisResponse;
}

// =========================================================================
// 1. HELPERS & CONFIGURATION
// =========================================================================

function getHealthStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
        UNDERWEIGHT: 'Thiếu cân',
        NORMAL: 'Bình thường',
        OVERWEIGHT: 'Thừa cân',
        OBESE: 'Béo phì',
    };
    return statusMap[status] || status;
}

function getGoalLabel(goal: string): string {
    const goalMap: Record<string, string> = {
        WEIGHT_LOSS: 'Giảm cân',
        MAINTAIN_WEIGHT: 'Duy trì cân nặng',
        GAIN_MUSCLE: 'Tăng cơ',
    };
    return goalMap[goal] || goal;
}

/**
 * Configuration for Health Metrics Cards
 */
interface MetricConfig {
    key: string;
    label: string;
    icon: React.ReactNode;
    description: string;
    getValue: (analysis: AIAnalysisResponse['analysis']) => string | number;
    getUnit?: (analysis: AIAnalysisResponse['analysis']) => string;
    getSubtitle?: (analysis: AIAnalysisResponse['analysis']) => string;
}

const METRICS_CONFIG: MetricConfig[] = [
    {
        key: 'bmi',
        label: 'BMI SCORE',
        icon: <Activity className="w-5 h-5" />,
        description: "Chỉ số khối cơ thể (Body Mass Index).",
        getValue: (a) => a.bmi,
        getSubtitle: (a) => getHealthStatusLabel(a.healthStatus)
    },
    {
        key: 'bmr',
        label: 'BASAL METABOLIC',
        icon: <Flame className="w-5 h-5" />,
        description: "Tỷ lệ trao đổi chất cơ bản (BMR).",
        getValue: (a) => a.bmr,
        getUnit: () => 'kcal',
        getSubtitle: () => "Năng lượng cơ bản"
    },
    {
        key: 'tdee',
        label: 'DAILY ENERGY',
        icon: <TrendingUp className="w-5 h-5" />,
        description: "Tổng năng lượng tiêu hao hàng ngày (TDEE).",
        getValue: (a) => a.tdee,
        getUnit: () => 'kcal',
        getSubtitle: () => "Tiêu hao vận động"
    },
    {
        key: 'status',
        label: 'HEALTH STATUS',
        icon: <Heart className="w-5 h-5" />,
        description: "Đánh giá sơ bộ về sức khỏe.",
        getValue: (a) => a.healthStatus, // Will be same as subtitle strictly speaking but handled in render
        getSubtitle: () => "Kết luận y khoa"
    }
];

interface LifestyleConfig {
    key: keyof AIAnalysisResponse['lifestyleInsights'];
    label: string;
    icon: React.ReactNode;
}

const LIFESTYLE_CONFIG: LifestyleConfig[] = [
    {
        key: 'activity',
        label: 'VẬN ĐỘNG',
        icon: <Activity className="w-4 h-4" />
    },
    {
        key: 'sleep',
        label: 'GIẤC NGỦ',
        icon: <Moon className="w-4 h-4" />
    },
    {
        key: 'stress',
        label: 'TÂM LÝ',
        icon: <Smile className="w-4 h-4" />
    }
];

// =========================================================================
// 2. SUB-COMPONENTS
// =========================================================================

function MetricCard({ icon, label, value, unit, description, subtitle }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    description?: string;
    subtitle?: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                    {icon}
                </div>
                {description && (
                    <div className="relative group/tooltip">
                        <Info className="w-4 h-4 text-slate-300 cursor-help hover:text-slate-400" />
                        <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 font-light tracking-wide">
                            {description}
                        </div>
                    </div>
                )}
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</h3>

            <div className="flex items-baseline gap-1 my-1">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">{value}</span>
                {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
            </div>

            {subtitle && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{subtitle}</span>
                </div>
            )}
        </div>
    );
}

function MonthRow({ month, title, calories, note, habitFocus, macronutrients, specificActions }: { month: number; title: string; calories: number; note: string; habitFocus: string; macronutrients: string; specificActions: string }) {
    return (
        <div className="relative pl-10 pb-12 last:pb-0">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-3 bottom-0 w-px bg-slate-200 last:hidden"></div>

            {/* Timeline Node */}
            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-emerald-200 transition-colors ml-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-slate-100 pb-3">
                    <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Giai đoạn {month}</span>
                        <h4 className="text-lg font-bold text-slate-800">{title}</h4>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded border border-slate-100 self-start sm:self-center">
                        <Flame className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{calories} kcal</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Habit & Macro Tags */}
                    <div className="space-y-3">
                        {habitFocus && (
                            <div className="flex items-start gap-2">
                                <Target className="w-4 h-4 text-emerald-500 mt-0.5" />
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase block">Trọng tâm</span>
                                    <span className="text-sm text-slate-700">{habitFocus}</span>
                                </div>
                            </div>
                        )}
                        {macronutrients && (
                            <div className="flex items-start gap-2">
                                <Utensils className="w-4 h-4 text-blue-500 mt-0.5" />
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase block">Dinh dưỡng</span>
                                    <span className="text-sm text-slate-700">{macronutrients}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions Box */}
                    {specificActions && (
                        <div className="bg-slate-50 rounded p-4 text-sm text-slate-600 leading-relaxed border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-xs font-bold text-slate-900 uppercase">Hành động cốt lõi</span>
                            </div>
                            {specificActions}
                        </div>
                    )}
                </div>

                {note && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                        <Info className="w-3.5 h-3.5" />
                        <span>{note}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// =========================================================================
// 3. MAIN COMPONENT
// =========================================================================

export function HealthAnalysisView({ data }: HealthAnalysisViewProps) {
    const { analysis, threeMonthPlan, lifestyleInsights } = data;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 py-4">

            {/* HEADER */}
            <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kết quả phân tích AI
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hồ Sơ Sức Khỏe Của Bạn</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Dựa trên dữ liệu bạn cung cấp, AI đã phân tích và thiết lập lộ trình tối ưu nhất.
                </p>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {METRICS_CONFIG.map((config) => (
                    <MetricCard
                        key={config.key}
                        icon={config.icon}
                        label={config.label}
                        value={config.getValue(analysis)}
                        unit={config.getUnit?.(analysis)}
                        description={config.description}
                        subtitle={config.getSubtitle?.(analysis)}
                    />
                ))}
            </div>

            {/* TWO COLUMNS: AI NOTE & LIFESTYLE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI DOCTOR NOTE */}
                <div className="lg:col-span-2">
                    <div className="h-full bg-slate-25 rounded-xl border border-slate-200 p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded text-emerald-700">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Nhận định chuyên sâu</h3>
                        </div>
                        <p className="text-slate-600 leading-8 text-lg font-light italic">
                            "{analysis.summary}"
                        </p>
                    </div>
                </div>

                {/* LIFESTYLE SIDEBAR */}
                {lifestyleInsights && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Phân tích lối sống</h3>
                        {LIFESTYLE_CONFIG.map((config) => (
                            <div key={config.key} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                                    {config.icon}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">{config.label}</div>
                                    <div className="text-sm font-medium text-slate-700 mt-0.5">
                                        {lifestyleInsights[config.key]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3-MONTH PLAN TIMELINE */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <MoveRight className="w-6 h-6 text-emerald-500" />
                            Lộ trình 3 tháng
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">Được cá nhân hóa cho mục tiêu của bạn</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold uppercase tracking-wide border border-emerald-100">
                        Mục tiêu: {getGoalLabel(threeMonthPlan.goal)}
                    </div>
                </div>

                <div className="max-w-3xl">
                    {threeMonthPlan.months.map((month) => (
                        <MonthRow
                            key={month.month}
                            month={month.month}
                            title={month.title}
                            calories={month.dailyCalories}
                            note={month.note}
                            habitFocus={month.habitFocus}
                            macronutrients={month.macronutrients}
                            specificActions={month.specificActions}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}