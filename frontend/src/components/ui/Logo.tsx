'use client';

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    light?: boolean;
}

export function Logo({ className, iconOnly = false, light = false }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2 select-none", className)}>
            <div className="relative flex items-center justify-center">
                {/* Stylized Leaf SVG */}
                <svg
                    width="36"
                    height="36"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transform transition-transform group-hover:rotate-12 duration-500"
                >
                    <path
                        d="M20 2C20 2 34 10 34 22C34 29.732 27.732 36 20 36C12.268 36 6 29.732 6 22C6 10 20 2 20 2Z"
                        fill="url(#logo-gradient)"
                    />
                    <path
                        d="M20 2V36"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{ opacity: 0.3 }}
                    />
                    <path
                        d="M20 12C24 16 28 18 32 20"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{ opacity: 0.2 }}
                    />
                    <path
                        d="M20 20C16 24 14 26 10 28"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{ opacity: 0.2 }}
                    />
                    <defs>
                        <linearGradient
                            id="logo-gradient"
                            x1="6"
                            y1="2"
                            x2="34"
                            y2="36"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#10B981" />
                            <stop offset="1" stopColor="#059669" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* AI Sparkle Overlay */}
                <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm border border-slate-50 dark:border-slate-800">
                    <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />
                </div>
            </div>

            {!iconOnly && (
                <span className={cn(
                    "font-black text-xl tracking-tighter uppercase italic",
                    light ? "text-white" : "text-slate-900"
                )}>
                    Health<span className="text-emerald-500 not-italic font-extrabold translate-x-[-2px] inline-block">Coach</span>
                </span>
            )}
        </div>
    );
}
