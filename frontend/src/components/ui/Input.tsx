import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon: Icon, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="relative">
                    {Icon && (
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full py-3.5 rounded-xl border transition-all bg-white/50 focus:outline-none focus:ring-2',
                            Icon ? 'pl-12 pr-4' : 'px-4',
                            error
                                ? 'border-red-400 focus:ring-red-400'
                                : 'border-slate-200 focus:ring-primary',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
