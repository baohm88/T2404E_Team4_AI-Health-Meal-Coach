// src/app/onboarding/result/page.tsx
/**
 * Onboarding Result Page – Dynamic Data Version
 *
 * Requirements:
 *   • On mount, check authentication status via token.
 *   • If authenticated, fetch stored analysis with `aiService.getStoredAnalysis()`.
 *   • If not authenticated, redirect to `/register` (guest cannot access this page).
 *   • Display health metrics: BMI, BMR, TDEE, Target Calories.
 *   • Display 3-month plan roadmap.
 *   • Display two action buttons: "Vào Dashboard" and "Nâng cấp Premium".
 */

'use client';

import { getToken } from '@/lib/http';
import { AIAnalysisResponse, aiService } from '@/services/ai.service';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Crown,
    Flame,
    Target,
    TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// ============================================================
// SKELETON COMPONENT
// ============================================================

function ResultSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 flex flex-col items-center">
            <div className="max-w-2xl w-full animate-pulse space-y-6">
                {/* Header Skeleton */}
                <div className="text-center space-y-2">
                    <div className="h-8 w-64 bg-slate-200 rounded-lg mx-auto" />
                    <div className="h-4 w-80 bg-slate-100 rounded mx-auto" />
                </div>

                {/* Metrics Grid Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 space-y-2">
                            <div className="h-6 w-6 bg-slate-200 rounded" />
                            <div className="h-4 w-12 bg-slate-100 rounded" />
                            <div className="h-8 w-16 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>

                {/* Roadmap Skeleton */}
                <div className="bg-white rounded-xl p-6 space-y-4">
                    <div className="h-6 w-40 bg-slate-200 rounded" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="space-y-3">
                    <div className="h-12 bg-slate-200 rounded-xl" />
                    <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// METRIC CARD COMPONENT
// ============================================================

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    color: string;
    subtitle?: string;
}

function MetricCard({ icon, label, value, unit, color, subtitle }: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-slate-800">
                {value}
                {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
            </p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </motion.div>
    );
}

// ============================================================
// HEALTH STATUS HELPER
// ============================================================

function getHealthStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
        UNDERWEIGHT: 'Thiếu cân',
        NORMAL: 'Bình thường',
        OVERWEIGHT: 'Thừa cân',
        OBESE: 'Béo phì',
    };
    return statusMap[status] || status;
}

function getHealthStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
        UNDERWEIGHT: 'text-yellow-600',
        NORMAL: 'text-emerald-600',
        OVERWEIGHT: 'text-orange-600',
        OBESE: 'text-red-600',
    };
    return colorMap[status] || 'text-slate-600';
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OnboardingResultPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);

    // ---------------------------------------------------------------------
    // Authentication check & data fetch
    // ---------------------------------------------------------------------
    useEffect(() => {
        console.log('🎯 [OnboardingResult] Checking authentication...');
        const token = getToken();
        console.log('🔑 [OnboardingResult] Token from localStorage:', token);

        const auth = !!token;
        setIsAuthenticated(auth);
        console.log('✅ [OnboardingResult] Is authenticated:', auth);

        if (!auth) {
            // Guest – redirect to register page
            console.log('🚫 [OnboardingResult] Not authenticated, redirecting to /register');
            router.replace('/register?from=onboarding');
            return;
        }

        console.log('📊 [OnboardingResult] Fetching analysis data...');
        // Authenticated – fetch stored analysis
        // Authenticated – fetch stored analysis or create new one if pending
        const fetchAnalysis = async () => {
             // Import store dynamically or assume it's available (better to import at top, but here allows keeping diff small if I could, but I should add import at top. 
             // Since I can't add top-level import easily with this tool without replacing widely, I will use require or rely on the fact that I will add import in a separate block? No I should replace the file content properly.)
             // Actually, replace_file_content is fine with adding imports if I touch top of file.
             // But for now, let's use the local logic.
             
             try {
                // 1. Try to get stored analysis
                const res = await aiService.getStoredAnalysis();
                console.log('📊 [OnboardingResult] Analysis response:', res);

                if (res.success && res.data) {
                    console.log('✅ [OnboardingResult] Analysis loaded successfully');
                    setAnalysis(res.data);
                } else {
                    console.warn('⚠️ [OnboardingResult] Analysis not found on server, checking local store...');
                    
                    // 2. If not found, check if we have pending data in store (Post-Registration flow)
                    const { useOnboardingStore } = require('@/stores/useOnboardingStore');
                    const { formData } = useOnboardingStore.getState();
                    
                    if (formData && formData.activityLevel) {
                         console.log('🚀 [OnboardingResult] Found pending data, submitting to AI service...');
                         const createRes = await aiService.analyzeHealth(formData);
                         
                         if (createRes.success && createRes.data) {
                             console.log('✅ [OnboardingResult] Created new analysis successfully');
                             setAnalysis(createRes.data);
                         } else {
                             throw new Error(createRes.error || 'Không thể tạo phân tích mới');
                         }
                    } else {
                         console.error('❌ [OnboardingResult] No pending data found');
                         setError(res.error || 'Không thể tải dữ liệu phân tích');
                    }
                }
            } catch (e: any) {
                console.error('❌ [OnboardingResult] Error fetching/creating analysis:', e);
                setError(e.message || 'Lỗi khi kết nối tới server');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [router]);

    // ---------------------------------------------------------------------
    // Loading State
    // ---------------------------------------------------------------------
    if (loading) {
        return <ResultSkeleton />;
    }

    // ---------------------------------------------------------------------
    // Error State
    // ---------------------------------------------------------------------
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <h1 className="text-2xl font-bold text-red-700 mb-2">Có lỗi xảy ra</h1>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.refresh()}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                    >
                        Về Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------
    // No Data State
    // ---------------------------------------------------------------------
    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <h1 className="text-2xl font-bold text-slate-700 mb-2">Chưa có dữ liệu</h1>
                <p className="text-slate-600 mb-4">Vui lòng hoàn thành quy trình onboarding trước.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                    Về Dashboard
                </button>
            </div>
        );
    }

    // Extract data
    const { analysis: bodyAnalysis, threeMonthPlan } = analysis;
    const currentMonthCalories = threeMonthPlan?.months?.[0]?.dailyCalories || 0;

    // ---------------------------------------------------------------------
    // Main content – display analysis summary and CTA buttons
    // ---------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Kết quả phân tích sức khỏe</h1>
                    <p className="text-slate-500 mt-1">Dựa trên thông tin bạn cung cấp</p>
                </motion.div>

                {/* Health Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                        icon={<Activity className="w-5 h-5 text-white" />}
                        label="BMI"
                        value={bodyAnalysis.bmi.toFixed(1)}
                        color="bg-blue-500"
                        subtitle={getHealthStatusLabel(bodyAnalysis.healthStatus)}
                    />
                    <MetricCard
                        icon={<Flame className="w-5 h-5 text-white" />}
                        label="BMR"
                        value={Math.round(bodyAnalysis.bmr)}
                        unit="kcal"
                        color="bg-orange-500"
                        subtitle="Năng lượng cơ bản"
                    />
                    <MetricCard
                        icon={<TrendingUp className="w-5 h-5 text-white" />}
                        label="TDEE"
                        value={Math.round(bodyAnalysis.tdee)}
                        unit="kcal"
                        color="bg-emerald-500"
                        subtitle="Tiêu hao hàng ngày"
                    />
                    <MetricCard
                        icon={<Target className="w-5 h-5 text-white" />}
                        label="Mục tiêu"
                        value={currentMonthCalories}
                        unit="kcal"
                        color="bg-purple-500"
                        subtitle="Calo tháng 1"
                    />
                </div>

                {/* AI Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100"
                >
                    <h3 className="font-semibold text-slate-800 mb-2">💡 Nhận xét từ AI</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {bodyAnalysis.summary}
                    </p>
                </motion.div>

                {/* 3-Month Plan Roadmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-slate-800">Lộ trình 3 tháng</h3>
                    </div>

                    <div className="space-y-3">
                        {threeMonthPlan?.months?.map((month, index) => (
                            <div
                                key={month.month}
                                className={`flex items-start gap-3 p-3 rounded-lg ${index === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                                    }`}
                            >
                                {/* Month Badge */}
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-300 text-slate-600'
                                        }`}
                                >
                                    {month.month}
                                </div>

                                {/* Month Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${index === 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                        {month.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {month.dailyCalories} kcal/ngày
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                        {month.note}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-3"
                >
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-medium"
                    >
                        Vào Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push('/pricing')}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl hover:from-amber-500 hover:to-orange-500 transition font-medium"
                    >
                        <Crown className="w-4 h-4" /> Nâng cấp Premium
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
