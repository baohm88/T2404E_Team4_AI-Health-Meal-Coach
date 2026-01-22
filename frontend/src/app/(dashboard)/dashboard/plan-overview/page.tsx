/**
 * Plan Overview Page (Freemium)
 *
 * Displays AI health analysis summary:
 * - Health metrics (BMI, BMR, TDEE, Health Status)
 * - 3-month plan timeline (summary only)
 * - CTA to upgrade for detailed meal plans
 *
 * Route: /dashboard/plan-overview
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Activity,
    TrendingUp,
    Flame,
    Heart,
    Calendar,
    User,
    Lock,
    Sparkles,
    ArrowRight,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { aiService, AIAnalysisResponse } from '@/services/ai.service';

// ============================================================
// TYPES
// ============================================================

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    color: string;
}

// ============================================================
// COMPONENTS
// ============================================================

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

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-600">Đang tải dữ liệu phân tích...</p>
        </div>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-slate-600 mb-4">{message}</p>
            <Button variant="outline" onClick={onRetry}>
                Thử lại
            </Button>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PlanOverviewPage() {
    const router = useRouter();
    const [data, setData] = useState<AIAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        const result = await aiService.getStoredAnalysis();

        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.error || 'Không thể tải dữ liệu phân tích');
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ========================================
    // RENDER STATES
    // ========================================

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <LoadingState />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-5xl mx-auto">
                <ErrorState message={error || 'Không có dữ liệu'} onRetry={fetchData} />
            </div>
        );
    }

    const { analysis, threeMonthPlan } = data;

    // ========================================
    // MAIN RENDER
    // ========================================

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                    Kết quả phân tích sức khỏe
                </h1>
                <p className="text-slate-500 mt-1">
                    Dựa trên thông tin bạn cung cấp, AI đã phân tích và tạo lộ trình phù hợp
                </p>
            </div>

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

            {/* Action Area */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">🎯 Tiếp theo</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* View Profile Button */}
                    <Link href="/dashboard/profile">
                        <div className="h-full border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-700">Xem hồ sơ cá nhân</span>
                            </div>
                            <p className="text-sm text-slate-500">
                                Kiểm tra và cập nhật thông tin sức khỏe của bạn
                            </p>
                        </div>
                    </Link>

                    {/* Premium CTA */}
                    <div className="relative border-2 border-emerald-500 rounded-xl p-5 bg-gradient-to-br from-emerald-50 to-green-50">
                        {/* Premium badge */}
                        <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PREMIUM
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-emerald-700">
                                Mở khóa lộ trình chi tiết
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-4">
                            Xem thực đơn chi tiết từng ngày, tuần và công thức nấu ăn phù hợp với bạn
                        </p>

                        <Button
                            variant="primary"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 from-emerald-600 to-emerald-600"
                            onClick={() => {
                                // TODO: Navigate to pricing or show upgrade modal
                                alert('Tính năng Premium sẽ sớm ra mắt!');
                            }}
                        >
                            Nâng cấp ngay
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
