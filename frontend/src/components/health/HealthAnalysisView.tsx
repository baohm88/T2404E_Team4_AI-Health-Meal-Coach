"use client";

import { AIAnalysisResponse } from "@/services/ai.service";
import { Activity, Calendar, Flame, Heart, TrendingUp } from "lucide-react";

interface HealthAnalysisViewProps {
    data: AIAnalysisResponse;
}

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    color: string;
}

function MetricCard({ icon, label, value, unit, color }: MetricCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-slate-500">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">{value}</span>
                {unit && <span className="text-sm text-slate-500">{unit}</span>}
            </div>
        </div>
    );
}

function MonthCard({ month, title, calories, note }: { month: number; title: string; calories: number; note: string }) {
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {/* Timeline line */}
            <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-emerald-200 last:hidden" />

            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                {month}
            </div>

            {/* Card content */}
            <div className="bg-slate-50 rounded-xl p-4 ml-4">
                <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-slate-600">{calories} kcal/ngày</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500 mt-2">{note}</p>
            </div>
        </div>
    );
}

export function HealthAnalysisView({ data }: HealthAnalysisViewProps) {
    const { analysis, threeMonthPlan } = data;

    return (
        <div className="space-y-8">
            {/* Health Metrics Grid */}
            <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">📊 Chỉ số sức khỏe</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        icon={<Activity className="w-5 h-5 text-white" />}
                        label="BMI"
                        value={analysis.bmi.toFixed(1)}
                        color="bg-blue-500"
                    />
                    <MetricCard
                        icon={<Flame className="w-5 h-5 text-white" />}
                        label="BMR"
                        value={Math.round(analysis.bmr)}
                        unit="kcal"
                        color="bg-orange-500"
                    />
                    <MetricCard
                        icon={<TrendingUp className="w-5 h-5 text-white" />}
                        label="TDEE"
                        value={Math.round(analysis.tdee)}
                        unit="kcal"
                        color="bg-emerald-500"
                    />
                    <MetricCard
                        icon={<Heart className="w-5 h-5 text-white" />}
                        label="Tình trạng"
                        value={analysis.healthStatus}
                        color="bg-pink-500"
                    />
                </div>
            </section>

            {/* AI Summary */}
            <section className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="font-semibold text-slate-800 mb-2">💡 Nhận xét từ AI</h3>
                <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
            </section>

            {/* Lifestyle Insights */}
            {data.lifestyleInsights && (
                <section>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">🏃 Phân tích lối sống</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Activity Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-slate-700">Vận động</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {data.lifestyleInsights.activity}
                            </p>
                        </div>

                        {/* Sleep Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-slate-700">Giấc ngủ</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {data.lifestyleInsights.sleep}
                            </p>
                        </div>

                        {/* Stress Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-slate-700">Căng thẳng</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {data.lifestyleInsights.stress}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* 3-Month Plan Timeline */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        Lộ trình 3 tháng
                    </h2>
                    <span className="text-sm text-slate-500">
                        Mục tiêu: {threeMonthPlan.goal}
                    </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    {threeMonthPlan.months.map((month) => (
                        <MonthCard
                            key={month.month}
                            month={month.month}
                            title={month.title}
                            calories={month.dailyCalories}
                            note={month.note}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
