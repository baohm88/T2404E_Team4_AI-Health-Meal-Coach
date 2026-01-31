'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Brain,
    Crown,
    Rocket,
    Sparkles,
    Utensils,
    X
} from 'lucide-react';

interface UpgradePromptModalProps {
    isOpen: boolean;
    onUpgrade: () => void;
    onDashboard: () => void;
    onCancel: () => void;
}

export function UpgradePromptModal({ isOpen, onUpgrade, onDashboard, onCancel }: UpgradePromptModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-[480px] w-full overflow-hidden relative border border-amber-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onCancel}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition z-10 text-slate-400 hover:text-slate-600"
                                aria-label="Đóng"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header Image / Pattern */}
                            <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 h-32 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center z-10"
                                >
                                    <Crown className="w-8 h-8 text-amber-500 fill-amber-500" />
                                </motion.div>

                                {/* Decor */}
                                <div className="absolute top-4 left-4 text-white/20"><Sparkles className="w-6 h-6" /></div>
                                <div className="absolute bottom-4 right-4 text-white/20"><Sparkles className="w-4 h-4" /></div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-8 text-center space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                        Mở khóa Sức mạnh AI
                                    </h2>
                                    <p className="text-slate-500 leading-relaxed">
                                        Bạn đang sử dụng gói cơ bản. Nâng cấp lên <span className="text-amber-600 font-bold">Premium</span> để AI thiết kế lộ trình chi tiết dành riêng cho bạn!
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="text-left space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-amber-100 p-1 rounded text-amber-600 mt-0.5"><Brain className="w-4 h-4" /></div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">Phân tích chuyên sâu 30+ chỉ số</p>
                                            <p className="text-xs text-slate-500">Hiểu rõ cơ thể bạn hơn bao giờ hết</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-amber-100 p-1 rounded text-amber-600 mt-0.5"><Utensils className="w-4 h-4" /></div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">Thực đơn từng bữa mỗi ngày</p>
                                            <p className="text-xs text-slate-500">Không cần đau đầu nghĩ &quot;Hôm nay ăn gì?&quot;</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-amber-100 p-1 rounded text-amber-600 mt-0.5"><Rocket className="w-4 h-4" /></div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">Tăng tốc đạt mục tiêu</p>
                                            <p className="text-xs text-slate-500">Lộ trình được tối ưu hóa liên tục</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3 pb-2">
                                    <button
                                        onClick={onUpgrade}
                                        className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <Crown className="w-5 h-5 fill-white/20" />
                                        Nâng cấp Hạng Thành Viên
                                    </button>

                                    <button
                                        onClick={onDashboard}
                                        className="w-full py-3 px-6 text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        Vào Dashboard (Bản thường)
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
