"use client";

import { WeeklyMealCalendar } from "@/components/meals/WeeklyMealCalendar";
import { MealPlanResponse, mealPlanService } from "@/services/meal-plan.service";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MealPlanClient() {
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

    const handleGenerate = async () => {
        const promise = mealPlanService.generateMealPlan();
        toast.promise(promise, {
            loading: 'Đang khởi tạo lộ trình dinh dưỡng AI...',
            success: (res) => {
                if (res.data) {
                    setPlanData(res.data);
                    setError(null);
                }
                return 'Đã khởi tạo lộ trình thành công! Chúc bạn đạt được mục tiêu.';
            },
            error: (err) => err.response?.data?.message || 'Lỗi khi khởi tạo lộ trình.',
        });
    };

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

    const handleExtend = async () => {
        const promise = mealPlanService.extendMealPlan();
        toast.promise(promise, {
            loading: 'Đang thiết lập thực đơn cho tuần tiếp theo...',
            success: (res) => {
                if (res.data) {
                    setPlanData(res.data);
                }
                return 'Tuyệt vời! Thực đơn tuần tiếp theo đã sẵn sàng.';
            },
            error: 'Lỗi khi mở rộng lộ trình.',
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

    if (error && !planData) {
        const isNotFound = error.includes("Không tìm thấy") || error.includes("Vui lòng tạo mới");
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full text-center space-y-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50/50">
                        {isNotFound ? <Sparkles className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {isNotFound ? "Sẵn sàng cho lộ trình mới?" : "Đã có lỗi xảy ra"}
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed px-4">
                            {error}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {isNotFound ? (
                            <button
                                onClick={handleGenerate}
                                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5 fill-white/20" />
                                KHỞI TẠO LỘ TRÌNH AI
                            </button>
                        ) : (
                            <button
                                onClick={fetchMealPlan}
                                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 active:scale-[0.98]"
                            >
                                THỬ LẠI
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8fafc] py-6">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Lộ Trình <span className="text-emerald-500">Dinh Dưỡng</span> Của Bạn
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Lộ trình {planData?.totalDays} ngày được cá nhân hóa hoàn toàn bởi AI.
                        Sử dụng các món ăn quen thuộc giúp bạn dễ dàng duy trì thói quen.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRegenerate}
                        disabled={!planData}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Tái tạo lộ trình
                    </button>
                    {!planData && (
                        <button
                            onClick={handleGenerate}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            <Sparkles className="w-4 h-4" />
                            Khởi tạo ngay
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-4 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Thực đơn chi tiết từng tuần</h2>
            </div>

            {planData && planData.mealPlan.length > 0 ? (
                <WeeklyMealCalendar
                    initialData={planData}
                    startDate={planData?.startDate || "Chưa xác định"}
                    onExtendPlan={handleExtend}
                />
            ) : (
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[32px] py-32 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Chưa có dữ liệu lộ trình</h3>
                            <p className="text-slate-500 font-medium">Click nút bên dưới để AI tổng hợp thực đơn thông minh cho bạn</p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
                        >
                            <Sparkles className="w-6 h-6 fill-white/20" />
                            KHỞI TẠO LỘ TRÌNH AI
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
