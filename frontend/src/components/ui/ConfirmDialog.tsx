'use client';

import { useEffect } from 'react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'info',
    isLoading = false
}: ConfirmDialogProps) {

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const config = {
        danger: {
            icon: Trash2,
            bg: 'bg-red-50',
            iconColor: 'text-red-600',
            btnBg: 'bg-red-600 hover:bg-red-700',
            ring: 'ring-red-100'
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            btnBg: 'bg-amber-600 hover:bg-amber-700',
            ring: 'ring-amber-100'
        },
        info: {
            icon: Info,
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            btnBg: 'bg-blue-600 hover:bg-blue-700',
            ring: 'ring-blue-100'
        },
        success: {
            icon: Info,
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            btnBg: 'bg-emerald-600 hover:bg-emerald-700',
            ring: 'ring-emerald-100'
        }
    }[type];

    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", config.bg)}>
                            <Icon className={cn("w-7 h-7", config.iconColor)} />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                        {title}
                    </h3>

                    <p className="text-slate-500 text-center text-sm mb-6 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50",
                                config.btnBg
                            )}
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
