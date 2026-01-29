/**
 * HealthTrendChart
 * 
 * Line chart visualizing Goal vs Actual calories over the last 7 days.
 */

'use client';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { TrendPoint } from '@/types/api';

interface HealthTrendChartProps {
    data?: TrendPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-300">Mục tiêu</span>
                        <span className="text-xs font-black text-white">{payload[0].value} kcal</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-emerald-400">Thực tế</span>
                        <span className="text-xs font-black text-emerald-400">{payload[1].value} kcal</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export function HealthTrendChart({ data = [] }: HealthTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex items-center justify-center">
                <p className="text-slate-400 text-sm italic tracking-tight">Đang đồng bộ xu hướng sức khỏe...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col group hover:shadow-md transition-all">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Xu hướng Calo (7 ngày)
            </h3>

            <div className="flex-1 w-full min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="goal"
                            stroke="#e2e8f0"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="transparent"
                            dot={false}
                            activeDot={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="eaten"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center gap-6 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mục tiêu</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Thực tế</span>
                </div>
            </div>
        </div>
    );
}
