// src/components/modals/RegisterPromptModal.tsx
/**
 * Registration Prompt Modal
 * 
 * A compelling modal that encourages users to register and save their
 * personalized health analysis results after completing onboarding.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    Heart,
    Calendar,
    X,
    ArrowRight,
    AlertCircle
} from 'lucide-react';

interface RegisterPromptModalProps {
    isOpen: boolean;
    onRegister: () => void;
    onCancel: () => void;
}

export function RegisterPromptModal({ isOpen, onRegister, onCancel }: RegisterPromptModalProps) {
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onCancel}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition z-10"
                                aria-label="Đóng"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>

                            {/* Header with Gradient */}
                            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white relative overflow-hidden">
                                {/* Animated Background Elements */}
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                                        scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                                    }}
                                    className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                                />
                                <motion.div
                                    animate={{
                                        rotate: -360,
                                        scale: [1, 1.3, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                                        scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                                    }}
                                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                                />

                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 relative"
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-white/20 rounded-2xl"
                                    />
                                </motion.div>

                                {/* Headline */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold mb-2 relative"
                                >
                                    🎯 Kết quả phân tích của bạn đã sẵn sàng!
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-emerald-50 relative"
                                >
                                    Đăng ký ngay để lưu và truy cập mọi lúc mọi nơi
                                </motion.p>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-6">
                                {/* Benefits List */}
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Chỉ số sức khỏe cá nhân hóa</h3>
                                            <p className="text-sm text-slate-600">BMI, BMR, TDEE được tính toán riêng cho bạn</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Lộ trình 3 tháng tùy chỉnh</h3>
                                            <p className="text-sm text-slate-600">Kế hoạch dinh dưỡng được thiết kế riêng cho mục tiêu của bạn</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                            <Heart className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Theo dõi tiến độ sức khỏe</h3>
                                            <p className="text-sm text-slate-600">Lưu trữ và cập nhật kết quả theo thời gian</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Warning */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-amber-800 font-medium">
                                            Nếu không đăng ký, kết quả phân tích của bạn sẽ bị mất!
                                        </p>
                                        <p className="text-xs text-amber-700 mt-1">
                                            Chỉ mất 30 giây để tạo tài khoản và bảo vệ dữ liệu của bạn.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="flex flex-col gap-3 pt-2"
                                >
                                    <button
                                        onClick={onRegister}
                                        className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        Đăng ký ngay để lưu kết quả
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={onCancel}
                                        className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                                    >
                                        Để sau
                                    </button>
                                </motion.div>

                                {/* Trust Badge */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-xs text-center text-slate-500"
                                >
                                    ✨ Miễn phí 100% • Bảo mật thông tin • Không spam
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
