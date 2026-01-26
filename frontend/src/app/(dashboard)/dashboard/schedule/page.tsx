"use client";

import { WeeklyMealCalendar } from "@/components/meals/WeeklyMealCalendar";
import { MealPlanResponse, mealPlanService } from "@/services/meal-plan.service";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SchedulePage() {
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
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <p className="text-slate-500 font-medium animate-pulse">Đang tải lịch trình của bạn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-slate-800">Thông báo</h2>
                        <p className="text-slate-500">{error}</p>
                    </div>
                    {/* Add Create Button if no Plan exists - maybe redirect to onboarding or just generate? */}
                     <button
                        onClick={handleRegenerate} // If generic error, maybe retry. If "Not found", regenerate?
                        className="w-full py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                    >
                        Tạo lộ trình ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        Lộ trình <span className="text-emerald-500">Dinh Dưỡng</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Lộ trình ăn uống {planData?.totalDays || 7} ngày được cá nhân hóa bởi AI.
                    </p>
                </div>

                <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl text-sm font-bold border border-slate-200 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Tạo lại
                </button>
            </div>

            {/* Content */}
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
        </div>
    );
}
