'use client';

import { Edit3, Loader2, Save, UserCircle2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getUserFromToken, TokenUser } from '@/lib/auth';
import { OnboardingData } from '@/lib/schemas/onboarding.schema';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/stores/useAuthStore';

// ============================================================
// TYPES
// ============================================================

interface ProfileFormData {
    height: number;
    weight: number;
    goal: string;
    activityLevel: string;
    gender: string;
}

// ✅ FIX 1: Đặt default về 0 để dễ debug (Không che giấu lỗi)
const DEFAULT_PROFILE: ProfileFormData = {
    height: 0,
    weight: 0,
    goal: 'MAINTENANCE',
    activityLevel: 'LIGHT',
    gender: 'MALE',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const calculateBMI = (weight: number, heightCm: number): string => {
    if (heightCm <= 0 || weight <= 0) return '0.0';
    const heightM = heightCm / 100;
    return (weight / (heightM * heightM)).toFixed(1);
};

const getBMIStatus = (bmi: number) => {
    if (bmi === 0) return { text: 'Chưa có dữ liệu', color: 'text-slate-400' };
    if (bmi < 18.5) return { text: 'Thiếu cân', color: 'text-yellow-600' };
    if (bmi < 25) return { text: 'Bình thường', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Thừa cân', color: 'text-orange-600' };
    return { text: 'Béo phì', color: 'text-red-600' };
};

const getGoalLabel = (goal: string) => {
    const map: Record<string, string> = {
        'WEIGHT_LOSS': 'Giảm cân',
        'MAINTENANCE': 'Duy trì', 'MAINTAIN': 'Duy trì',
        'MUSCLE_GAIN': 'Tăng cân', 'WEIGHT_GAIN': 'Tăng cân'
    };
    return map[goal] || goal;
};

const getActivityLabel = (level: string) => {
    const map: Record<string, string> = {
        'SEDENTARY': 'Ít vận động',
        'LIGHT': 'Hoạt động nhẹ', 'LIGHTLY_ACTIVE': 'Hoạt động nhẹ',
        'MODERATE': 'Trung bình', 'MODERATELY_ACTIVE': 'Trung bình',
        'VERY_ACTIVE': 'Rất năng động'
    };
    return map[level] || level;
};

const getGenderLabel = (gender: string) => {
    return gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Khác';
};

// ============================================================
// LOADING SKELETON
// ============================================================

const ProfileSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-200" />
                <div className="flex-1 space-y-3">
                    <div className="w-48 h-6 bg-slate-200 rounded" />
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm h-64" />
            <div className="bg-white rounded-3xl p-6 shadow-sm h-64" />
        </div>
    </div>
);

// ============================================================
// COMPONENT
// ============================================================

export default function ProfileClient() {
    const { user: authUser } = useAuthStore();
    const [user, setUser] = useState<TokenUser | null>(null);
    const [formData, setFormData] = useState<ProfileFormData>(DEFAULT_PROFILE);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Prefer data from store if available, otherwise token
            if (authUser) {
                 setUser(authUser as unknown as TokenUser);
            } else {
                 const tokenUser = getUserFromToken();
                 setUser(tokenUser);
            }

            const result = await profileService.getProfile();

            if (result.success && result.data) {
                // ✅ FIX 2: Ưu tiên lấy data thật, nếu = 0 thì hiển thị 0
                setFormData({
                    height: result.data.height ?? 0,
                    weight: result.data.weight ?? 0,
                    goal: result.data.goal || 'MAINTENANCE',
                    activityLevel: result.data.activityLevel || 'LIGHT',
                    gender: result.data.gender || 'MALE',
                });
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            toast.error('Không tải được dữ liệu hồ sơ');
        } finally {
            setIsLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ✅ FIX 3: Hàm Lưu dữ liệu thật xuống DB
    const handleSave = async () => {
        if (formData.height <= 0 || formData.weight <= 0) {
            toast.warning('Vui lòng nhập chiều cao và cân nặng hợp lệ');
            return;
        }

        setIsSaving(true);
        try {
            // Mapping dữ liệu form sang format service yêu cầu
            const payload: Partial<OnboardingData> = {
                height: formData.height,
                weight: formData.weight,
                goal: formData.goal as OnboardingData['goal'],
                activityLevel: formData.activityLevel as OnboardingData['activityLevel'],
                gender: formData.gender as OnboardingData['gender'],
                age: 25, // Default age if not stored
            };

            // Gọi API (createProfile hỗ trợ cả tạo mới và cập nhật)
            const res = await profileService.createProfile(payload);

            if (res.success) {
                toast.success('Cập nhật hồ sơ thành công!');
                setIsEditing(false);
                // Refresh lại data để đảm bảo đồng bộ
                fetchData();
            } else {
                toast.error(res.message || 'Lỗi khi lưu hồ sơ');
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi lưu');
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate BMI display
    const bmi = calculateBMI(formData.weight, formData.height);
    const bmiStatus = getBMIStatus(parseFloat(bmi));

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header User Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <UserCircle2 className="w-24 h-24 text-gray-400" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {user?.fullName || 'Người dùng'}
                        </h1>
                        <p className="text-slate-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${isEditing
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-primary text-white hover:bg-green-600'
                            }`}
                        disabled={isSaving}
                    >
                        {isEditing ? (
                            <>
                                <X className="w-4 h-4" />
                                Hủy
                            </>
                        ) : (
                            <>
                                <Edit3 className="w-4 h-4" />
                                Chỉnh sửa
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chỉ số cơ thể */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Chỉ số cơ thể</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Chiều cao</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            ) : (
                                <span className="font-semibold text-slate-800">
                                    {formData.height > 0 ? (
                                        `${formData.height} cm`
                                    ) : (
                                        <span className="text-red-500">Chưa nhập</span>
                                    )}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Cân nặng</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            ) : (
                                <span className="font-semibold text-slate-800">
                                    {formData.weight > 0 ? (
                                        `${formData.weight} kg`
                                    ) : (
                                        <span className="text-red-500">Chưa nhập</span>
                                    )}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-600">BMI</span>
                            <div className="text-right">
                                <span className="font-semibold text-slate-800">{bmi}</span>
                                <span className={`ml-2 text-sm ${bmiStatus.color}`}>({bmiStatus.text})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mục tiêu */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Mục tiêu & Hoạt động</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Mục tiêu</span>
                            {isEditing ? (
                                <select
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="WEIGHT_LOSS">Giảm cân</option>
                                    <option value="MAINTENANCE">Duy trì</option>
                                    <option value="MUSCLE_GAIN">Tăng cân</option>
                                </select>
                            ) : (
                                <span className="font-semibold text-primary">{getGoalLabel(formData.goal)}</span>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Vận động</span>
                            {isEditing ? (
                                <select
                                    value={formData.activityLevel}
                                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="SEDENTARY">Ít vận động</option>
                                    <option value="LIGHT">Nhẹ nhàng</option>
                                    <option value="MODERATE">Trung bình</option>
                                    <option value="VERY_ACTIVE">Năng động</option>
                                </select>
                            ) : (
                                <span className="font-semibold text-slate-800">{getActivityLabel(formData.activityLevel)}</span>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-600">Giới tính</span>
                            <span className="font-semibold text-slate-800">{getGenderLabel(formData.gender)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            {isEditing && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-primary/30 disabled:opacity-70"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            )}
        </div>
    );
}
