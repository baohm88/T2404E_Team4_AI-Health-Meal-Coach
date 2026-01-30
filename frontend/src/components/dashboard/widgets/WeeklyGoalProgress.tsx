/**
 * WeeklyGoalProgress
 *
 * Visualizes "Day X of 7" and the cumulative calorie balance for the week.
 */

'use client';

import { TrendingDown, TrendingUp, Target } from 'lucide-react';
import { WeeklyProgress } from '@/types/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface WeeklyGoalProgressProps {
    progress?: WeeklyProgress;
}

export function WeeklyGoalProgress({ progress }: WeeklyGoalProgressProps) {
    if (!progress) return null;

    const { currentDay, totalDays, cumulativeDiff } = progress;
    const isSurplus = cumulativeDiff > 0;
    const isDeficit = cumulativeDiff < 0;
    const isPerfect = cumulativeDiff === 0;

    const percent = Math.round((currentDay / totalDays) * 100);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full group transition-all hover:shadow-md">
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Chu kỳ sức khỏe tuần
                </h3>

                <div className="flex items-end justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-4xl font-black text-slate-800 tracking-tighter tabular-nums">
                            Ngày {currentDay}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            trên {totalDays} ngày lộ trình AI
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-black text-slate-800 tracking-tighter">
                            {percent}%
                        </span>
                    </div>
                </div>

                <div className="h-3 bg-slate-100/80 rounded-full overflow-hidden mb-6 relative">
                    <div
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                    "p-4 rounded-2xl border transition-all",
                    isSurplus ? "bg-orange-50 border-orange-100 shadow-sm" :
                        isDeficit ? "bg-blue-50 border-blue-100" : "bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-100"
                )}>
                    <div className="flex items-center gap-2 mb-1">
                        {isSurplus ? <TrendingUp className="w-4 h-4 text-orange-600" /> :
                            isDeficit ? <TrendingDown className="w-4 h-4 text-blue-600" /> :
                                <Target className="w-4 h-4 text-emerald-600" />}
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {isSurplus ? 'Dư thừa' : isDeficit ? 'Thâm hụt' : 'Chuẩn mục tiêu'}
                        </span>
                    </div>
                    <p className={cn(
                        "text-2xl font-black tracking-tighter tabular-nums leading-none mb-1",
                        isSurplus ? "text-orange-600" : isDeficit ? "text-blue-600" : "text-emerald-600"
                    )}>
                        {isSurplus ? '+' : ''}{cumulativeDiff}
                    </p>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Cân bằng Kcal tuần</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-slate-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Dự báo
                        </span>
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">
                            {isSurplus ? 'Ổn định' : isDeficit ? 'Thành công' : 'Đỉnh cao'}
                        </p>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Dự đoán của AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
