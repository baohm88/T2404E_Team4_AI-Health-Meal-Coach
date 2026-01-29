import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z
        .string()
        .min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

export const verifyOtpSchema = z.object({
    email: z
        .string()
        .min(1, 'Email không hợp lệ')
        .email('Email không hợp lệ'),
    otp: z
        .string()
        .length(6, 'Mã OTP phải có 6 chữ số')
        .regex(/^\d{6}$/, 'Mã OTP chỉ chứa số'),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
