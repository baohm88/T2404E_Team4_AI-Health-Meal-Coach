/**
 * LogoutModal Component
 *
 * Confirmation modal before logout action.
 * Displays centered modal with backdrop overlay.
 *
 * @see /hooks/use-logout.ts
 */

'use client';

import { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// TYPES
// ============================================================

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

// ============================================================
// COMPONENT
// ============================================================

export function LogoutModal({ isOpen, onClose, onConfirm, isLoading = false }: LogoutModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className={cn(
                    'absolute inset-0 bg-black/50 backdrop-blur-sm',
                    'animate-in fade-in duration-200'
                )}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    'relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4',
                    'animate-in zoom-in-95 slide-in-from-bottom-4 duration-200'
                )}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <LogOut className="w-7 h-7 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
                    Đăng xuất
                </h3>

                {/* Message */}
                <p className="text-slate-500 text-center mb-6">
                    Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
                            'bg-slate-100 text-slate-700 hover:bg-slate-200',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
                            'bg-red-600 text-white hover:bg-red-700',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'flex items-center justify-center gap-2'
                        )}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Đăng xuất'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
