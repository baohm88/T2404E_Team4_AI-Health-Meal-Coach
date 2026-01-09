'use client';

import { useState } from 'react';
import { Droplets, Minus, Plus } from 'lucide-react';
import { MOCK_STATS } from '@/lib/mock-data';

export function WaterTracker() {
    const [waterIntake, setWaterIntake] = useState(MOCK_STATS.waterIntake);
    const { waterGoal } = MOCK_STATS;

    const addWater = () => setWaterIntake((prev) => Math.min(prev + 1, 12));
    const removeWater = () => setWaterIntake((prev) => Math.max(prev - 1, 0));

    const percentage = (waterIntake / waterGoal) * 100;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Nước uống
                </h3>
                <Droplets className="w-5 h-5 text-blue-400" />
            </div>

            <div className="flex items-center justify-center gap-6">
                <button
                    onClick={removeWater}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                >
                    <Minus className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <span className="text-4xl font-bold text-slate-800">{waterIntake}</span>
                    <span className="text-lg text-slate-400 ml-1">/ {waterGoal}</span>
                    <p className="text-sm text-slate-500 mt-1">ly nước</p>
                </div>

                <button
                    onClick={addWater}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-200 transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
