/**
 * Status Badge Component
 * 
 * Pill-shaped badges for displaying status (Active, Banned, Pending).
 */

import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default';

interface StatusBadgeProps {
    status: string;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-700 ring-green-600/20',
    danger: 'bg-red-100 text-red-700 ring-red-600/20',
    warning: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
    info: 'bg-blue-100 text-blue-700 ring-blue-600/20',
    default: 'bg-slate-100 text-slate-700 ring-slate-600/20',
};

// Auto-detect variant based on common status words
const getAutoVariant = (status: string): BadgeVariant => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'success', 'approved', 'completed'].includes(lowerStatus)) return 'success';
    if (['banned', 'deleted', 'rejected', 'error'].includes(lowerStatus)) return 'danger';
    if (['pending', 'waiting', 'draft'].includes(lowerStatus)) return 'warning';
    if (['info', 'new'].includes(lowerStatus)) return 'info';
    return 'default';
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
    const finalVariant = variant || getAutoVariant(status);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                variantStyles[finalVariant],
                className
            )}
        >
            {status}
        </span>
    );
}
