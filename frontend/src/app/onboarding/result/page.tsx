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

import { HealthAnalysisView } from '@/components/health/HealthAnalysisView';
import { getUserFromToken, TokenUser } from '@/lib/auth';
import { getToken } from '@/lib/http';
import { AIAnalysisResponse, aiService } from '@/services/ai.service';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Crown
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
// MAIN COMPONENT
// ============================================================

export default function OnboardingResultPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<TokenUser | null>(null);
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

        if (auth) {
            const userData = getUserFromToken();
            setUser(userData);
        }

        console.log('✅ [OnboardingResult] Is authenticated:', auth);

        if (!auth) {
            // Guest – redirect to register page
            console.log('🚫 [OnboardingResult] Not authenticated, redirecting to /register');
            router.replace('/register?from=onboarding');
            return;
        }

        console.log('📊 [OnboardingResult] Fetching analysis data...');
        // Authenticated – fetch stored analysis or create new one if pending
        const fetchAnalysis = async () => {
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
                        onClick={() => router.push('/dashboard/schedule')}
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
                    onClick={() => router.push('/dashboard/schedule')}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                    Về Dashboard
                </button>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold text-slate-800">
                        {user ? `Xin chào, ${user.fullName}!` : 'Kết quả phân tích sức khỏe'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {user ? 'Đây là kết quả phân tích sức khỏe của bạn' : 'Dựa trên thông tin bạn cung cấp'}
                    </p>
                </motion.div>

                {/* Health Metrics & Plan - Using Shared Component */}
                <HealthAnalysisView data={analysis} />

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-3"
                >
                    <button
                        onClick={() => router.push('/dashboard/schedule')}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-medium"
                    >
                        Vào Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push('/pricing')}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl hover:from-amber-500 hover:to-orange-500 transition font-medium"
                    >
                        <Crown className="w-4 h-4" /> Mở khóa Lộ trình Cá nhân
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
