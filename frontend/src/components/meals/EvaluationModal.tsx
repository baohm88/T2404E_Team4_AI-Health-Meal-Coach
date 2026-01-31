"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    RefreshCcw,
    Trophy,
    XCircle,
    Zap
} from "lucide-react";
import React from "react";

interface EvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        totalMeals: number;
        checkedMeals: number;
        mealCompliance: number;
        totalPlannedCal: number;
        totalActualCal: number;
        calorieCompliance: number;
        exceededDetails: { day: number; type: string; excess: number }[];
    };
    onSuccess: () => void;
    onFailure: () => void;
    isLoading?: boolean;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
    isOpen,
    onClose,
    stats,
    onSuccess,
    onFailure,
    isLoading = false
}) => {
    const isPassed = stats.mealCompliance >= 80 && stats.calorieCompliance >= 80;

    const getFeedback = () => {
        const calDiff = stats.totalActualCal - stats.totalPlannedCal;
        const diffText = calDiff > 0
            ? `cao hơn ${calDiff} kcal`
            : `thấp hơn ${Math.abs(calDiff)} kcal`;

        let message = "";
        const calorieDetail = `(Tuần qua: Mục tiêu ${stats.totalPlannedCal} kcal - Bạn ăn ${stats.totalActualCal} kcal, ${diffText} so với kế hoạch).`;

        if (stats.mealCompliance >= 80 && stats.calorieCompliance >= 80) {
            message = `Bạn đã thể hiện tính kỷ luật rất cao. Cả thói quen ăn uống và kiểm soát calo đều đạt mức tối ưu. ${calorieDetail} Hãy tiếp tục phát huy phong độ này!`;
            return { title: "Tuyệt vời!", message, color: "text-emerald-700", bgColor: "bg-emerald-50" };
        }
        if (stats.mealCompliance >= 80 && stats.calorieCompliance < 80) {
            message = `Bạn rất chăm chỉ ghi chép bữa ăn, nhưng lượng calo tiêu thụ thực tế đang lệch khá nhiều so với mục tiêu. ${calorieDetail} Hãy chú ý hơn đến hàm lượng dinh dưỡng của từng món ăn nhé.`;
            return { title: "Kỷ luật tốt, nhưng...", message, color: "text-amber-700", bgColor: "bg-amber-50" };
        }
        if (stats.mealCompliance < 80 && stats.calorieCompliance >= 80) {
            message = `Lượng calo của bạn rất ổn định, nhưng bạn đang bỏ lỡ khá nhiều bữa ăn trong lộ trình. ${calorieDetail} Việc ăn uống đều đặn cũng quan trọng không kém lượng calo đâu!`;
            return { title: "Kiểm soát calo tốt!", message, color: "text-blue-700", bgColor: "bg-blue-50" };
        }
        message = `Tuần qua thói quen ăn uống chưa được duy trì đều đặn và lượng calo cũng chưa đạt mục tiêu. ${calorieDetail} Đừng nản lòng, hãy coi reset là cơ hội để bắt đầu lại chuẩn chỉnh hơn!`;
        return { title: "Cần nỗ lực hơn", message, color: "text-orange-700", bgColor: "bg-orange-50" };
    };

    const feedback = getFeedback();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        {/* Status Header */}
                        <div className={cn(
                            "py-12 text-center relative overflow-hidden",
                            isPassed ? "bg-emerald-500" : "bg-orange-500"
                        )}>
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                            </div>

                            <div className="relative z-10 space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                    className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center border border-white/30"
                                >
                                    {isPassed ? (
                                        <Trophy className="w-12 h-12 text-white fill-white/20" />
                                    ) : (
                                        <AlertCircle className="w-12 h-12 text-white" />
                                    )}
                                </motion.div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-white tracking-tight px-6">
                                        {isPassed ? "TUÂN THỦ TUYỆT VỜI!" : "CẦN CỐ GẮNG HƠN!"}
                                    </h2>
                                    <p className="text-white/80 font-medium">
                                        Kết quả lộ trình tuần vừa qua của bạn
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tuân thủ bữa ăn</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={cn(
                                            "text-3xl font-black",
                                            stats.mealCompliance >= 80 ? "text-emerald-600" : "text-orange-600"
                                        )}>
                                            {stats.mealCompliance}%
                                        </span>
                                        {/* This line was misplaced and has been removed: ? Hành động này không thể hoàn tác. */}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">{stats.checkedMeals}/{stats.totalMeals} bữa</span>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chính xác Calo</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={cn(
                                            "text-3xl font-black",
                                            stats.calorieCompliance >= 80 ? "text-emerald-600" : "text-orange-600"
                                        )}>
                                            {stats.calorieCompliance}%
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">{stats.totalActualCal}/{stats.totalPlannedCal} kcal</span>
                                </div>
                            </div>

                            {/* Verdict Section */}
                            <div className={cn(
                                "p-6 rounded-3xl border-2 flex gap-4 items-start",
                                isPassed ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100"
                            )}>
                                <div className={cn(
                                    "p-3 rounded-2xl",
                                    isPassed ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                                )}>
                                    {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                </div>
                                <div className="space-y-1">
                                    <h3 className={cn(
                                        "text-lg font-black tracking-tight",
                                        isPassed ? "text-emerald-800" : "text-orange-800"
                                    )}>
                                        {isPassed ? "Đủ điều kiện đi tiếp" : "Không đủ điều kiện"}
                                    </h3>
                                    <p className={cn(
                                        "text-sm font-medium leading-relaxed opacity-80",
                                        isPassed ? "text-emerald-700" : "text-orange-700"
                                    )}>
                                        {isPassed
                                            ? "Chúc mừng! Bạn đã duy trì mức tuân thủ bữa ăn và calo trên 80%. Hệ thống sẽ mở khóa lộ trình tuần tiếp theo ngay bây giờ."
                                            : "Rất tiếc, mức tuân thủ bữa ăn hoặc calo của bạn chưa đạt 80%. Để đảm bảo sức khỏe, lộ trình của bạn sẽ được thiết lập lại từ Tuần 1."
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Feedback Section */}
                            <div className={cn(
                                "p-6 rounded-[32px] border-2 space-y-3",
                                feedback.bgColor,
                                isPassed ? "border-emerald-100" : "border-orange-100"
                            )}>
                                <div className="flex items-center gap-2">
                                    <Zap className={cn("w-5 h-5", feedback.color)} />
                                    <h3 className={cn("font-black text-lg", feedback.color)}>
                                        Nhận xét chuyên môn
                                    </h3>
                                </div>
                                <p className={cn("text-sm font-medium leading-relaxed italic", feedback.color)}>
                                    &quot;{feedback.message}&quot;
                                </p>

                                {stats.exceededDetails.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                                        <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", feedback.color)}>
                                            Chi tiết các bữa vượt Calo:
                                        </p>
                                        <div className="grid grid-cols-1 gap-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                            {stats.exceededDetails.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-[11px] font-bold py-1.5 px-3 bg-white/40 rounded-xl">
                                                    <span className="text-slate-600">Ngày {((item.day - 1) % 7) + 1} - Bữa {item.type}</span>
                                                    <span className="text-red-500">+{item.excess} kcal</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Motivational Note */}
                            {isPassed && (
                                <div className="flex items-center gap-3 px-2">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                        <Zap className="w-4 h-4 fill-amber-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 italic">
                                        &quot;Kỷ luật là cầu nối giữa mục tiêu và sự thành công. Hãy tiếp tục cố gắng!&quot;
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 pt-2">
                                {isPassed ? (
                                    <button
                                        onClick={onSuccess}
                                        disabled={isLoading}
                                        className="w-full py-5 bg-emerald-500 text-white rounded-[24px] font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        TIẾP TỤC TUẦN SAU
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={onFailure}
                                        disabled={isLoading}
                                        className="w-full py-5 bg-orange-500 text-white rounded-[24px] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        THIẾT LẬP LẠI TUẦN 1
                                        <RefreshCcw className="w-6 h-6" />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                                >
                                    Xem lại chi tiết tuần này
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
