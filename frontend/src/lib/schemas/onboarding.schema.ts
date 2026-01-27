/**
 * Onboarding Schema
 *
 * Zod schemas and TypeScript types for onboarding data.
 * Includes enums for Goal, Gender, ActivityLevel, StressLevel, WeeklyGoal, SleepRange.
 *
 * @see /lib/constants/onboarding.constants.ts - Labels and constants
 * @see /stores/useOnboardingStore.ts - State management
 */

import { z } from 'zod';

// ============================================================
// ENUMS
// ============================================================

/** User's fitness goal */
export enum Goal {
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  MAINTENANCE = 'MAINTENANCE',
  MUSCLE_GAIN = 'MUSCLE_GAIN',
}

/** Daily activity level */
export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  VERY_ACTIVE = 'VERY_ACTIVE',
}

/** User's gender */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

/** Stress level for energy score calculation */
export enum StressLevel {
  LOW = 'LOW',           // 😊 Thư giãn
  MEDIUM = 'MEDIUM',     // 😐 Bình thường
  HIGH = 'HIGH',         // 😓 Căng thẳng
  VERY_HIGH = 'VERY_HIGH', // 😰 Rất căng thẳng
}

/** Weekly weight change goal speed */
export enum WeeklyGoal {
  SLOW = 'SLOW',     // 0.25 kg/tuần
  NORMAL = 'NORMAL', // 0.5 kg/tuần
  FAST = 'FAST',     // 0.8 kg/tuần
}

/** Sleep range categories */
export enum SleepRange {
  LESS_THAN_5 = 'LESS_THAN_5',   // <5 giờ
  FIVE_TO_7 = 'FIVE_TO_7',       // 5-7 giờ
  SEVEN_TO_9 = 'SEVEN_TO_9',     // 7-9 giờ (optimal)
  MORE_THAN_9 = 'MORE_THAN_9',   // >9 giờ
}

// ============================================================
// ZOD SCHEMA
// ============================================================

export const onboardingSchema = z.object({
  // Core fields (required)
  fullName: z.string().min(2, 'Vui lòng nhập họ tên đầy đủ'),
  goal: z.nativeEnum(Goal),
  height: z.coerce
    .number()
    .min(100, 'Chiều cao phải từ 100cm')
    .max(250, 'Chiều cao tối đa 250cm'),
  weight: z.coerce
    .number()
    .min(30, 'Cân nặng phải từ 30kg')
    .max(250, 'Cân nặng tối đa 250kg'),
  gender: z.nativeEnum(Gender),
  activityLevel: z.nativeEnum(ActivityLevel),

  // New fields for enhanced onboarding
  age: z.coerce
    .number()
    .min(10, 'Tuổi phải từ 10')
    .max(120, 'Tuổi tối đa 120')
    .optional(),
  targetWeight: z.coerce
    .number()
    .min(30, 'Cân nặng mục tiêu phải từ 30kg')
    .max(250, 'Cân nặng mục tiêu tối đa 250kg')
    .optional(),
  weeklyGoal: z.nativeEnum(WeeklyGoal).optional(),
  stressLevel: z.nativeEnum(StressLevel).optional(),
  sleepRange: z.nativeEnum(SleepRange).optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
