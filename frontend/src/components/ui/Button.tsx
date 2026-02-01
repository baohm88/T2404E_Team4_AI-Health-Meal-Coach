import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer';

        const variants = {
            primary: 'bg-gradient-to-r from-primary to-red-500 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] rounded-full',
            secondary: 'bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg',
            outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-2xl shadow-sm',
            ghost: 'text-slate-600 hover:bg-slate-100 rounded-xl',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
