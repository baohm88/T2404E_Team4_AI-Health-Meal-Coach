/**
 * StepInfo Component
 *
 * Collects body measurements: Age, Height, Weight, Gender.
 * Features minimalist input design with large bold numbers.
 */

'use client';

import { useState } from 'react';

import { Gender } from '@/lib/schemas/onboarding.schema';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
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
    error?: string;
}

function MeasurementInput({
    label,
    unit,
    value,
    onChange,
    min,
    max,
    placeholder,
    error,
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
                        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                        error && 'ring-2 ring-red-500/50 bg-red-50/50'
                    )}
                />
                <span className="absolute right-3 text-sm text-slate-400 font-medium pointer-events-none">
                    {unit}
                </span>
            </div>
            {error && (
                <span className="text-xs text-red-500 mt-1">{error}</span>
            )}
        </div>
    );
}

// ============================================================
// COMPONENT
// ============================================================

export function StepInfo() {
    const { formData, setFormData, nextStep, skipStep } = useOnboardingStore();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (field: string, value: number) => {
        // Simple manual validation or Zod schema check if preferred
        // using schema definitions from constants/schema
         if (field === 'age') {
             if (!value || value < 10 || value > 120) return 'Tuổi từ 10-120';
         }
         if (field === 'height') {
             if (!value || value < 100 || value > 250) return 'Cao 100-250cm';
         }
         if (field === 'weight') {
             if (!value || value < 30 || value > 250) return 'Nặng 30-250kg';
         }
         return '';
    };

    const handleChange = (field: 'age' | 'height' | 'weight', value: number) => {
        setFormData({ [field]: value });
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const isValid = formData.age && formData.height && formData.weight && formData.gender && 
                    !errors.age && !errors.height && !errors.weight;

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-6">
                {/* Age, Height, Weight - Grid layout */}
                <div className="grid grid-cols-3 gap-4">
                    <MeasurementInput
                        label="Tuổi"
                        unit="tuổi"
                        value={formData.age}
                        onChange={(val) => handleChange('age', val)}
                        min={10}
                        max={120}
                        placeholder="25"
                        error={errors.age}
                    />
                    <MeasurementInput
                        label="Chiều cao"
                        unit="cm"
                        value={formData.height}
                        onChange={(val) => handleChange('height', val)}
                        min={100}
                        max={250}
                        placeholder="170"
                        error={errors.height}
                    />
                    <MeasurementInput
                        label="Cân nặng"
                        unit="kg"
                        value={formData.weight}
                        onChange={(val) => handleChange('weight', val)}
                        min={30}
                        max={250}
                        placeholder="65"
                        error={errors.weight}
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
