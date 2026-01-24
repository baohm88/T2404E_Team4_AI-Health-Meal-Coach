"use client";

import { useEffect, useState } from "react";
import { WeeklyMealCalendar } from "@/components/meals/WeeklyMealCalendar";
import { mealPlanService, MealPlanResponse } from "@/services/meal-plan.service";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, RefreshCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function MealPlanPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [planData, setPlanData] = useState<MealPlanResponse | null>(null);

    async function fetchMealPlan() {
        try {
            setLoading(true);
            setError(null);

            const response = await mealPlanService.getMealPlan();

            if (response.success) {
                setPlanData(response.data || null);
            } else {
                setError("Không tìm thấy kế hoạch bữa ăn. Vui lòng tạo mới.");
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.message || "Đã có lỗi xảy ra khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    }

    const handleRegenerate = async () => {
        const promise = mealPlanService.regenerateMealPlan();
        toast.promise(promise, {
            loading: 'Đang khởi tạo lại thực đơn mới...',
            success: (res) => {
                if (res.data) {
                    setPlanData(res.data);
                }
                return 'Đã cập nhật thực đơn mới thành công!';
            },
            error: 'Lỗi khi tạo lại thực đơn.',
        });
    };

    useEffect(() => {
        fetchMealPlan();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <p className="text-slate-500 font-medium animate-pulse">Đang tải thực đơn dinh dưỡng của bạn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-slate-800">Thông báo</h2>
                        <p className="text-slate-500">{error}</p>
                    </div>
                    <button
                        onClick={fetchMealPlan}
                        className="w-full py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8fafc] py-12">
            <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Lộ Trình <span className="text-emerald-500">Dinh Dưỡng</span> Của Bạn
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Lộ trình {planData?.totalDays} ngày được cá nhân hóa hoàn toàn bởi AI.
                        Sử dụng các món ăn quen thuộc giúp bạn dễ dàng duy trì thói quen.
                    </p>
                </div>

                <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Tạo lại lộ trình
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Thực đơn chi tiết từng tuần</h2>
            </div>

            {planData && planData.mealPlan.length > 0 ? (
                <WeeklyMealCalendar
                    initialData={planData}
                    startDate={planData?.startDate || "Chưa xác định"}
                />
            ) : (
                <div className="text-center py-20 text-slate-400 italic">
                    Chưa có dữ liệu lộ trình ăn uống.
                </div>
            )}
        </main>
    );
}

