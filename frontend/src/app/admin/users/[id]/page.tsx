"use client";

import { format } from "date-fns";
import { ArrowLeft, Calendar, FileText, Star, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { HealthAnalysisView } from "@/components/health/HealthAnalysisView";
import { WeeklyMealCalendar } from "@/components/meals/WeeklyMealCalendar";
import { Button } from "@/components/ui/Button";
import { getUserDetail, getUserMealPlan, getUserPlan, togglePremiumStatus, toggleUserStatus } from "@/services/admin.service";
import { AdminUser } from "@/types/admin";

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = Number(params.id);

    const [user, setUser] = useState<AdminUser | null>(null);
    const [healthPlan, setHealthPlan] = useState<any | null>(null);
    const [mealPlan, setMealPlan] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'meal-plan'>('overview');

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [userRes, planRes, mealRes] = await Promise.allSettled([
                    getUserDetail(userId),
                    getUserPlan(userId),
                    getUserMealPlan(userId)
                ]);

                // Handle User Details
                if (userRes.status === 'fulfilled') {
                    setUser(userRes.value);
                } else {
                    console.error("Failed to fetch user details:", userRes.reason);
                    toast.error("Không tìm thấy người dùng");
                    router.push('/admin/users');
                    return; // Stop if user load fails
                }

                // Handle Health Plan
                if (planRes.status === 'fulfilled') {
                    const planData = planRes.value;
                    if (planData?.analysisJson) {
                         try {
                            const healthData = typeof planData.analysisJson === 'string'
                                ? JSON.parse(planData.analysisJson)
                                : planData.analysisJson;
                            setHealthPlan(healthData);
                        } catch (e) {
                            console.error("Lỗi parse dữ liệu sức khỏe:", e);
                            setHealthPlan(null);
                        }
                    } else {
                        setHealthPlan(null);
                    }
                } else {
                    console.error("Failed to fetch health plan:", planRes.reason);
                     setHealthPlan(null);
                }

                // Handle Meal Plan
                if (mealRes.status === 'fulfilled') {
                    setMealPlan(mealRes.value);
                } else {
                    // console.log("No meal plan found or error fetching");
                     setMealPlan(null);
                }

            } catch (error) {
                console.error("Unexpected error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, router]);

    const handleToggleStatus = async () => {
        if (!user) return;
        try {
            await toggleUserStatus(user.id);
            toast.success("Đã cập nhật trạng thái");
            setUser(prev => prev ? { ...prev, status: prev.status === 1 ? 0 : 1 } : null);
        } catch (e) {
            toast.error("Lỗi cập nhật");
        }
    }

    const handleTogglePremium = async () => {
        if (!user) return;
        try {
            await togglePremiumStatus(user.id);
            toast.success("Đã cập nhật Premium");
            setUser(prev => prev ? { ...prev, isPremium: !prev.isPremium } : null);
        } catch (e) {
            toast.error("Lỗi cập nhật");
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
    }

    if (!user) return null;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 pl-0 hover:bg-transparent text-slate-500 hover:text-slate-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách
                </Button>

                <div className="bg-white rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">
                            {(user?.fullName?.trim() ? user.fullName.trim().substring(0, 2).toUpperCase() : "US")}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {user.fullName}
                                {user.isPremium && <Star className="w-5 h-5 fill-amber-500 text-amber-500" />}
                            </h1>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" /> {user.role}
                                </span>
                                <span>•</span>
                                <span>{user.email}</span>
                                <span>•</span>
                                <span>Tham gia: {format(new Date(user.createdAt), 'dd/MM/yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={user.status} className="px-3 py-1 text-sm" />

                        <Button variant="outline" onClick={handleTogglePremium}>
                            {user.isPremium ? 'Hủy Premium' : 'Cấp Premium'}
                        </Button>
                        <Button
                            variant={user.status === 1 ? "secondary" : "primary"}
                            className={user.status === 1 ? "bg-red-50 text-red-600 hover:bg-red-100" : ""}
                            onClick={handleToggleStatus}
                        >
                            {user.status === 1 ? 'Khóa tài khoản' : 'Mở khóa'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview'
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Hồ sơ sức khỏe
                    </button>
                    <button
                        onClick={() => setActiveTab('meal-plan')}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'meal-plan'
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Lịch ăn uống
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                    healthPlan ? (
                        <div className="bg-slate-50 p-6 rounded-2xl border">
                            <HealthAnalysisView data={healthPlan} />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">Người dùng chưa thực hiện phân tích sức khỏe.</p>
                        </div>
                    )
                )}

                {activeTab === 'meal-plan' && (
                    mealPlan ? (
                        <div className="bg-slate-50 p-6 rounded-2xl border">
                            <WeeklyMealCalendar
                                initialData={mealPlan}
                                startDate={mealPlan.startDate}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">Người dùng chưa có kế hoạch ăn uống.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
