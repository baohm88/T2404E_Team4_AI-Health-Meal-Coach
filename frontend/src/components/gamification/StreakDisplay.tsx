"use client";

import { UserStreak } from "@/services/streak.service";
import "@/styles/gamification.css";
import { motion } from "framer-motion";
import { Tooltip } from "antd";

interface StreakDisplayProps {
    streak: UserStreak | null;
    loading?: boolean;
}

export function StreakDisplay({ streak, loading }: StreakDisplayProps) {
    if (loading) return <div className="h-12 w-32 bg-slate-100 rounded-xl animate-pulse" />;

    if (!streak) return null;

    const currentStreak = streak.currentStreak || 0;
    const isFrozen = streak.freezeCount > 0;

    return (
        <Tooltip title={`Streak dài nhất: ${streak.longestStreak || 0} ngày`}>
            <div className={`
                flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all cursor-help
                ${currentStreak > 0 ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}
            `}>
                <div className="relative">
                    <span className="text-2xl flame-icon">🔥</span>
                    {isFrozen && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white">
                            ❄️
                        </span>
                    )}
                </div>
                <div className="flex flex-col leading-tight">
                    <span className={`text-xl font-black ${currentStreak > 0 ? 'text-orange-600' : 'text-slate-400'}`}>
                        {currentStreak}
                    </span>
                    <span className="text-xs font-medium text-slate-500">ngày liên tiếp</span>
                </div>
            </div>
        </Tooltip>
    );
}
