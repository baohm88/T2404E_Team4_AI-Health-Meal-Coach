'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { MOCK_USER } from '@/lib/mock-data';
import { Edit3, Save, X, UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        height: MOCK_USER.profile.height,
        weight: MOCK_USER.profile.weight,
        goal: MOCK_USER.profile.goal,
        activityLevel: MOCK_USER.profile.activityLevel,
    });

    const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);

    const getBMIStatus = (bmi: number) => {
        if (bmi < 18.5) return { text: 'Thiếu cân', color: 'text-yellow-600' };
        if (bmi < 25) return { text: 'Bình thường', color: 'text-green-600' };
        if (bmi < 30) return { text: 'Thừa cân', color: 'text-orange-600' };
        return { text: 'Béo phì', color: 'text-red-600' };
    };

    const bmiStatus = getBMIStatus(parseFloat(bmi));

    const getGoalLabel = (goal: string) => {
        switch (goal) {
            case 'WEIGHT_LOSS': return 'Giảm cân';
            case 'MAINTENANCE': return 'Duy trì';
            case 'MUSCLE_GAIN': return 'Tăng cân';
            default: return goal;
        }
    };

    const getActivityLabel = (level: string) => {
        switch (level) {
            case 'SEDENTARY': return 'Ít vận động';
            case 'LIGHT': return 'Hoạt động nhẹ';
            case 'MODERATE': return 'Trung bình';
            case 'VERY_ACTIVE': return 'Rất năng động';
            default: return level;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                            <UserCircle2 className="w-24 h-24 text-gray-400" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-slate-800">{user?.fullName || MOCK_USER.name}</h1>
                        <p className="text-slate-500">{user?.email || MOCK_USER.email}</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Tham gia từ {new Date(MOCK_USER.joinedAt).toLocaleDateString('vi-VN')}
                        </p>
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${isEditing
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-primary text-white hover:bg-green-600'
                            }`}
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

            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Body Metrics */}
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
                                <span className="font-semibold text-slate-800">{formData.height} cm</span>
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
                                <span className="font-semibold text-slate-800">{formData.weight} kg</span>
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

                {/* Goals & Activity */}
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
                            <span className="text-slate-600">Mức độ hoạt động</span>
                            {isEditing ? (
                                <select
                                    value={formData.activityLevel}
                                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="SEDENTARY">Ít vận động</option>
                                    <option value="LIGHT">Hoạt động nhẹ</option>
                                    <option value="MODERATE">Trung bình</option>
                                    <option value="VERY_ACTIVE">Rất năng động</option>
                                </select>
                            ) : (
                                <span className="font-semibold text-slate-800">{getActivityLabel(formData.activityLevel)}</span>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-600">Giới tính</span>
                            <span className="font-semibold text-slate-800">
                                {MOCK_USER.profile.gender === 'MALE' ? 'Nam' : MOCK_USER.profile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            {isEditing && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-primary/30"
                    >
                        <Save className="w-5 h-5" />
                        Lưu thay đổi
                    </button>
                </div>
            )}
        </div>
    );
}
