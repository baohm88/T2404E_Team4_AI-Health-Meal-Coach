/**
 * Toast Notification Component
 * 
 * A reusable toast component for displaying success/error notifications.
 */

'use client';

import { Check, X } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface ToastData {
    message: string;
    type: 'success' | 'error';
}

export interface ToastProps extends ToastData {
    onClose: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all animate-slide-up ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
        >
            {type === 'success' ? (
                <Check className="w-5 h-5" />
            ) : (
                <X className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 hover:opacity-70 transition-opacity"
                aria-label="Đóng thông báo"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
