/**
 * Roadmap View Component
 *
 * Displays AI-powered health analysis and 3-month nutrition plan.
 * Features glassmorphism design with real AI data.
 *
 * @see /services/ai.service.ts - AIAnalysisResponse type
 */

'use client';

import { Scale, Activity, TrendingUp, Footprints, Moon, Zap, Sparkles, Info } from 'lucide-react';
import { AIAnalysisResponse, MonthPlan } from '@/services/ai.service';

// ============================================================
// TYPES
// ============================================================

interface RoadmapViewProps {
    data: AIAnalysisResponse | null;
    loading?: boolean;
    error?: string | null;
}

// ============================================================
// COMPONENT
// ============================================================

export const RoadmapView = ({ data, loading, error }: RoadmapViewProps) => {
    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!data) {
        return <EmptyState />;
    }

    const { analysis, lifestyleInsights, threeMonthPlan } = data;

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Lộ trình dinh dưỡng AI</h2>
                        <p className="text-sm text-white/80">Phân tích sức khỏe và kế hoạch 3 tháng</p>
                    </div>
                </div>

                {/* AI Summary - Highlighted Section */}
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/20">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed line-clamp-3">
                            {analysis.summary}
                        </p>
                    </div>
                </div>

                {/* Metrics Grid - Glassmorphism Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <MetricCard
                        icon={<Scale className="w-4 h-4" />}
                        label="BMI"
                        value={analysis.bmi.toFixed(1)}
                        subtitle={getHealthStatusLabel(analysis.healthStatus)}
                    />
                    <MetricCard
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="TDEE"
                        value={`${analysis.tdee}`}
                        subtitle="kcal/ngày"
                    />
                    <MetricCard
                        icon={<Activity className="w-4 h-4" />}
                        label="BMR"
                        value={`${analysis.bmr}`}
                        subtitle="kcal nền"
                    />
                </div>

                {/* Lifestyle Insights Row */}
                <div className="grid grid-cols-3 gap-2">
                    <InsightPill
                        icon={<Footprints className="w-3.5 h-3.5" />}
                        text={getShortenedText(lifestyleInsights.activity, 30)}
                        title={lifestyleInsights.activity}
                    />
                    <InsightPill
                        icon={<Moon className="w-3.5 h-3.5" />}
                        text={getShortenedText(lifestyleInsights.sleep, 30)}
                        title={lifestyleInsights.sleep}
                    />
                    <InsightPill
                        icon={<Zap className="w-3.5 h-3.5" />}
                        text={getShortenedText(lifestyleInsights.stress, 30)}
                        title={lifestyleInsights.stress}
                    />
                </div>
            </div>

            {/* 3-Month Plan Timeline */}
            <div className="p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Kế hoạch 3 tháng</h3>
                <div className="relative flex justify-between">
                    {/* Connection Line (Background) */}
                    <div className="absolute top-4 left-[16.67%] right-[16.67%] h-1 bg-slate-100 -z-0 rounded-full" />

                    {/* Connection Line (Progress) */}
                    <div
                        className="absolute top-4 left-[16.67%] h-1 bg-emerald-500 -z-0 rounded-full transition-all duration-500"
                        style={{ width: '0%' }} // Can be dynamic based on current month
                    />

                    {/* Month Cards */}
                    {threeMonthPlan.months.map((month, index) => (
                        <MonthCard
                            key={month.month}
                            month={month}
                            isActive={index === 0} // First month is active by default
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: string;
}

const MetricCard = ({ icon, label, value, subtitle }: MetricCardProps) => {
    return (
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/30">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-xs text-white/70 mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-[10px] text-white/60">{subtitle}</p>
        </div>
    );
};

interface InsightPillProps {
    icon: React.ReactNode;
    text: string;
    title: string;
}

const InsightPill = ({ icon, text, title }: InsightPillProps) => {
    return (
        <div
            className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 flex items-center gap-1.5 cursor-help"
            title={title}
        >
            <div className="flex-shrink-0">{icon}</div>
            <span className="text-[10px] text-white/90 truncate">{text}</span>
        </div>
    );
};

interface MonthCardProps {
    month: MonthPlan;
    isActive: boolean;
}

const MonthCard = ({ month, isActive }: MonthCardProps) => {
    return (
        <div className="flex flex-col items-center relative z-10 w-1/3 group">
            {/* Status Icon */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 transition-all ${isActive
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-500 ring-4 ring-emerald-100'
                        : 'border-slate-300 bg-slate-50 text-slate-400'
                    }`}
            >
                <span className="text-xs font-bold">{month.month}</span>
            </div>

            {/* Month Info */}
            <div className="text-center px-2">
                <p className={`text-sm font-bold ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {month.title}
                </p>

                {/* Calories Badge */}
                <div className="mt-2">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                    >
                        {month.dailyCalories} kcal
                    </span>
                </div>

                {/* Note on Hover */}
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-slate-500 line-clamp-2">{month.note}</p>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// STATE COMPONENTS
// ============================================================

const LoadingSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6">
                <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-white/15 rounded-xl mb-4"></div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="h-24 bg-white/20 rounded-xl"></div>
                    <div className="h-24 bg-white/20 rounded-xl"></div>
                    <div className="h-24 bg-white/20 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-white/10 rounded-lg"></div>
                    <div className="h-8 bg-white/10 rounded-lg"></div>
                    <div className="h-8 bg-white/10 rounded-lg"></div>
                </div>
            </div>
            <div className="p-5">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="flex justify-between">
                    <div className="w-1/3 h-32 bg-slate-100 rounded"></div>
                    <div className="w-1/3 h-32 bg-slate-100 rounded"></div>
                    <div className="w-1/3 h-32 bg-slate-100 rounded"></div>
                </div>
            </div>
        </div>
    );
};

const ErrorState = ({ error }: { error: string }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                <Info className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Không thể tải dữ liệu</h3>
            <p className="text-sm text-slate-500">{error}</p>
        </div>
    );
};

const EmptyState = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                <Sparkles className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Chưa có phân tích</h3>
            <p className="text-sm text-slate-500">
                Hoàn thành quá trình onboarding để nhận phân tích AI
            </p>
        </div>
    );
};

// ============================================================
// HELPERS
// ============================================================

const getHealthStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
        UNDERWEIGHT: 'Thiếu cân',
        NORMAL: 'Bình thường',
        OVERWEIGHT: 'Thừa cân',
        OBESE: 'Béo phì',
    };
    return statusMap[status] || status;
};

const getShortenedText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export default RoadmapView;
