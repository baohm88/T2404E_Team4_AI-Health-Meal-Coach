/**
 * StepInfo Component
 *
 * Collects body measurements: Age, Height, Weight, Gender.
 * Features minimalist input design with large bold numbers.
 */

'use client';

import React from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Gender } from '@/lib/schemas/onboarding.schema';
import clsx from 'clsx';

// ============================================================
// CONSTANTS
// ============================================================

const GENDER_OPTIONS = [
    { id: Gender.MALE, label: 'Nam' },
    { id: Gender.FEMALE, label: 'Nữ' },
    { id: Gender.OTHER, label: 'Khác' },
];

// ============================================================
// MINIMALIST INPUT COMPONENT
// ============================================================

interface MeasurementInputProps {
    label: string;
    unit: string;
    value: number | undefined;
    onChange: (value: number) => void;
    min: number;
    max: number;
    placeholder: string;
}

function MeasurementInput({
    label,
    unit,
    value,
    onChange,
    min,
    max,
    placeholder,
}: MeasurementInputProps) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium mb-2">{label}</span>
            <div className="relative flex items-center">
                <input
                    type="number"
                    min={min}
                    max={max}
                    value={value || ''}
                    onChange={(e) => onChange(Number(e.target.value))}
                    placeholder={placeholder}
                    className={clsx(
                        'w-full py-3 pr-12 text-xl font-medium text-slate-800',
                        'bg-slate-50/50 rounded-xl border-0',
                        'focus:outline-none focus:bg-slate-100/70 focus:ring-2 focus:ring-primary/20',
                        'transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:text-base',
                        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    )}
                />
                <span className="absolute right-3 text-sm text-slate-400 font-medium pointer-events-none">
                    {unit}
                </span>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENT
// ============================================================

export function StepInfo() {
    const { formData, setFormData, nextStep, skipStep } = useOnboardingStore();

    const isValid = formData.fullName && formData.age && formData.height && formData.weight && formData.gender;

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-6">
                {/* Full Name Input */}
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-2">Họ và tên</span>
                    <input
                        type="text"
                        value={formData.fullName || ''}
                        onChange={(e) => setFormData({ fullName: e.target.value })}
                        placeholder="Nhập tên của bạn"
                        className={clsx(
                            'w-full py-3 px-4 text-lg font-medium text-slate-800',
                            'bg-slate-50/50 rounded-xl border-0',
                            'focus:outline-none focus:bg-slate-100/70 focus:ring-2 focus:ring-primary/20',
                            'transition-all placeholder:text-slate-300 placeholder:font-normal'
                        )}
                    />
                </div>

                {/* Age, Height, Weight - Grid layout */}
                <div className="grid grid-cols-3 gap-4">
                    <MeasurementInput
                        label="Tuổi"
                        unit="tuổi"
                        value={formData.age}
                        onChange={(val) => setFormData({ age: val })}
                        min={10}
                        max={120}
                        placeholder=""
                    />
                    <MeasurementInput
                        label="Chiều cao"
                        unit="cm"
                        value={formData.height}
                        onChange={(val) => setFormData({ height: val })}
                        min={100}
                        max={250}
                        placeholder=""
                    />
                    <MeasurementInput
                        label="Cân nặng"
                        unit="kg"
                        value={formData.weight}
                        onChange={(val) => setFormData({ weight: val })}
                        min={30}
                        max={250}
                        placeholder=""
                    />
                </div>

                {/* Gender Selection */}
                <div>
                    <span className="text-xs text-slate-500 font-medium block mb-2">Giới tính</span>
                    <div className="flex gap-3">
                        {GENDER_OPTIONS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setFormData({ gender: item.id })}
                                className={clsx(
                                    'px-4 py-3 rounded-2xl border-2 transition-all flex-1',
                                    formData.gender === item.id
                                        ? 'border-primary bg-primary/10 text-primary font-semibold ring-2 ring-inset ring-primary'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons - No back button (using header back arrow) */}
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
                        disabled={!isValid}
                        className={clsx(
                            "px-6 py-3 rounded-2xl font-semibold shadow-md transition-all",
                            isValid
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
