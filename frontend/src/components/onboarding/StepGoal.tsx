'use client';

import React from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Goal } from '@/lib/schemas/onboarding.schema';
import clsx from 'clsx';
import { Scale, Compass, BicepsFlexed } from 'lucide-react';

export function StepGoal() {
    const { formData, setFormData, nextStep, skipStep } = useOnboardingStore();

    const handleSelect = (goal: Goal) => {
        setFormData({ goal });
    };

    const goals = [
        {
            id: Goal.WEIGHT_LOSS,
            icon: Scale,
            label: 'Giảm cân',
            desc: 'Mất mỡ, thon gọn',
        },
        {
            id: Goal.MAINTENANCE,
            icon: Compass,
            label: 'Duy trì',
            desc: 'Giữ vóc dáng',
        },
        {
            id: Goal.MUSCLE_GAIN,
            icon: BicepsFlexed,
            label: 'Tăng cân',
            desc: 'Tăng cơ, nặng hơn',
        },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {goals.map((item) => {
                    const isSelected = formData.goal === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            className={clsx(
                                'p-5 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col items-center sm:items-start',
                                isSelected
                                    ? 'border-primary ring-2 ring-primary ring-inset bg-primary/5'
                                    : 'border-slate-200 hover:shadow-md hover:border-slate-300 bg-white'
                            )}
                        >
                            <div className="text-2xl mb-2 text-slate-700">
                                <Icon size={32} strokeWidth={1.5} className={isSelected ? 'text-primary' : 'text-slate-600'} />
                            </div>
                            <div className="mt-2 font-semibold text-slate-800">{item.label}</div>
                            <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 flex items-center justify-end">
                <div className="flex items-center gap-3">
                    <button
                        onClick={skipStep}
                        className="text-sm text-slate-500 hover:underline"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={!formData.goal}
                        className={clsx(
                            "px-6 py-3 rounded-2xl font-semibold shadow-md transition-all",
                            formData.goal
                                ? "bg-primary text-white hover:shadow-lg"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
}
