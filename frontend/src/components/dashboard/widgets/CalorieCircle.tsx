'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MOCK_STATS } from '@/lib/mock-data';

export function CalorieCircle() {
    const { caloriesIn, caloriesGoal, caloriesRemaining } = MOCK_STATS;

    const data = [
        { name: 'Eaten', value: caloriesIn, color: 'var(--color-success)' },
        { name: 'Remaining', value: caloriesRemaining, color: 'var(--color-remaining)' },
    ];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Calories hôm nay
            </h3>

            <div className="relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">{caloriesIn}</span>
                    <span className="text-sm text-slate-500">/ {caloriesGoal} kcal</span>
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-slate-600">Đã ăn</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200" />
                    <span className="text-slate-600">Còn lại</span>
                </div>
            </div>
        </div>
    );
}
