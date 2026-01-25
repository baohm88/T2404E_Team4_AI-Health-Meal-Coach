"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { mealLogService } from "@/services/meal-log.service";
import { toast } from "sonner";

interface MealLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
    mealType: string;
    day: number;
    plannedMealId?: number;
}

export const MealLogModal: React.FC<MealLogModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    mealType,
    day,
    plannedMealId
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setLoading(true);
            const res = await mealLogService.analyzeMealImage(file, plannedMealId, mealType) as any;

            if (res.success) {
                setResult(res.data);
                toast.success("Phân tích món ăn thành công!");
                setTimeout(() => {
                    onSuccess(res.data);
                    handleClose();
                }, 2000);
            } else {
                toast.error(res.message || "Không thể phân tích ảnh.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi gửi ảnh lên server.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Đổi Món Ăn Bằng AI</h3>
                            <p className="text-sm text-slate-500 font-medium italic">Bữa {mealType.toLowerCase()} - Ngày {day}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {!result ? (
                            <div className="space-y-4">
                                <div
                                    className={`relative border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer
                                        ${preview ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}`}
                                    onClick={() => document.getElementById('meal-upload')?.click()}
                                >
                                    {preview ? (
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
                                            <img src={preview} alt="Meal preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700">Tải ảnh món ăn của bạn</p>
                                                <p className="text-sm text-slate-400">AI sẽ tự nhận diện món và calo</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="meal-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-6 h-6 animate-spin" /> Đang phân tích...</>
                                    ) : (
                                        "Bắt đầu phân tích AI"
                                    )}
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-emerald-800 font-bold text-lg">Đã nhận diện thành công!</h4>
                                    <p className="text-2xl font-black text-emerald-600 capitalize">{result.foodName}</p>
                                    <p className="text-emerald-500 font-bold">~{result.estimatedCalories} kcal</p>
                                </div>
                                <div className="bg-white/60 p-4 rounded-2xl text-xs text-emerald-700 italic leading-relaxed">
                                    {result.nutritionDetails}
                                </div>
                            </motion.div>
                        )}

                        <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100/50">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                <strong>Lưu ý:</strong> Kết quả từ AI mang tính tham khảo.
                                Hệ thống sẽ tự động trừ lượng calo dự kiến của món cũ và thay bằng món mới vào nhật ký của bạn.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
