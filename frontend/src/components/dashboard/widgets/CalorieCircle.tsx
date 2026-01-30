'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface CalorieCircleProps {
    eaten?: number;
    goal?: number;
    remaining?: number;
}

// ============================================================
// COMPONENT
// ============================================================

export function CalorieCircle({
    eaten = 0,
    goal = 2000,
    remaining = 2000
}: CalorieCircleProps) {
    const isOverGoal = eaten > goal;

    // Emerald for success, Rose for over-limit
    const primaryColor = isOverGoal ? '#f43f5e' : '#10b981';
    const secondaryColor = '#f1f5f9';

    const data = [
        { name: 'Eaten', value: Math.min(eaten, goal), color: primaryColor },
        { name: 'Remaining', value: isOverGoal ? 0 : remaining, color: secondaryColor },
    ];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 w-full text-center">
                Calo Hôm Nay
            </h3>

            <div className="relative w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={85}
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black tracking-tighter ${isOverGoal ? 'text-rose-600' : 'text-slate-800'}`}>
                        {eaten}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        / {goal} kcal
                    </span>
                </div>
            </div>

            {/* Status & Alerts */}
            <div className="mt-4 w-full">
                {isOverGoal ? (
                    <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl animate-pulse">
                        <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-rose-700 uppercase tracking-tighter">Vượt mức!</span>
                            <span className="text-[10px] font-bold text-rose-600 leading-none">
                                Bạn đã nạp dư {eaten - goal} kcal
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đã ăn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-100" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Còn lại</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
