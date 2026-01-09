'use client';

import { MOCK_STATS } from '@/lib/mock-data';

export function MacrosBreakdown() {
    const { macros } = MOCK_STATS;

    const macroData = [
        { name: 'Protein', ...macros.protein, color: 'var(--color-protein)' },
        { name: 'Carbs', ...macros.carbs, color: 'var(--color-carbs)' },
        { name: 'Fat', ...macros.fat, color: 'var(--color-fat)' },
    ];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Dinh dưỡng
            </h3>

            <div className="space-y-4">
                {macroData.map((macro) => {
                    const percentage = Math.round((macro.current / macro.goal) * 100);
                    return (
                        <div key={macro.name}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium text-slate-700">{macro.name}</span>
                                <span className="text-sm text-slate-500">
                                    {macro.current} / {macro.goal} {macro.unit}
                                </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                        backgroundColor: macro.color,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
