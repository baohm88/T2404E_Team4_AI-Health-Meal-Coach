// src/app/onboarding/result/page.tsx
/**
 * Onboarding Result Page – Full Rewrite
 *
 * Requirements:
 *   • On mount, check authentication status via token.
 *   • If authenticated, fetch stored analysis with `aiService.getStoredAnalysis()`.
 *   • If not authenticated, redirect to `/register` (guest cannot access this page).
 *   • No reading from localStorage.
 *   • Display two action buttons: "Vào Dashboard" and "Nâng cấp Premium".
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { aiService, AIAnalysisResponse } from '@/services/ai.service';
import { getToken } from '@/lib/http';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Loader2 } from 'lucide-react';

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
        const fetchAnalysis = async () => {
            try {
                const res = await aiService.getStoredAnalysis();
                console.log('📊 [OnboardingResult] Analysis response:', res);

                if (res.success && res.data) {
                    console.log('✅ [OnboardingResult] Analysis loaded successfully');
                    setAnalysis(res.data);
                } else {
                    console.error('❌ [OnboardingResult] Analysis fetch failed:', res.error);
                    setError(res.error || 'Không thể tải dữ liệu phân tích');
                }
            } catch (e) {
                console.error('❌ [OnboardingResult] Error fetching analysis:', e);
                setError('Lỗi khi kết nối tới server');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [router]);

    // ---------------------------------------------------------------------
    // UI helpers
    // ---------------------------------------------------------------------
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <h1 className="text-2xl font-bold text-red-700 mb-2">Có lỗi xảy ra</h1>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => router.refresh()}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    // ---------------------------------------------------------------------
    // Main content – display analysis summary and CTA buttons
    // ---------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center"
            >
                <h1 className="text-2xl font-bold text-emerald-800 mb-2">Kết quả Onboarding</h1>
                {analysis && (
                    <p className="text-slate-600 mb-4">
                        {analysis.analysis?.summary ?? 'Phân tích đã được lưu.'}
                    </p>
                )}
                <div className="flex flex-col gap-3 mt-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
                    >
                        Vào Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push('/pricing')}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-amber-400 text-white rounded-xl hover:bg-amber-500 transition border-2 border-amber-300"
                    >
                        Nâng cấp Premium <Crown className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
