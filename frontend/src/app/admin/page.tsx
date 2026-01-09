/**
 * Admin Dashboard Overview Page
 * 
 * Main admin dashboard with stats, charts, and recent activities.
 */

'use client';

import { Users, Utensils, TrendingUp, Flag, UserPlus, AlertCircle, Ban, Plus } from 'lucide-react';
import { MOCK_ADMIN_STATS, MOCK_RECENT_ACTIVITIES, MOCK_REGISTRATION_CHART, RecentActivity } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ============================================================
// STATS CARDS
// ============================================================

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend?: string;
    color: 'green' | 'blue' | 'orange' | 'red';
}

const colorStyles = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
};

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">{value.toLocaleString()}</p>
                    {trend && <p className="text-xs text-green-600 mt-2">{trend}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl ${colorStyles[color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// ACTIVITY ICON
// ============================================================

const activityIcons: Record<RecentActivity['type'], React.ElementType> = {
    user_register: UserPlus,
    food_added: Plus,
    report_created: AlertCircle,
    user_banned: Ban,
};

const activityColors: Record<RecentActivity['type'], string> = {
    user_register: 'bg-green-100 text-green-600',
    food_added: 'bg-blue-100 text-blue-600',
    report_created: 'bg-orange-100 text-orange-600',
    user_banned: 'bg-red-100 text-red-600',
};

// ============================================================
// MAIN PAGE
// ============================================================

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng người dùng"
                    value={MOCK_ADMIN_STATS.totalUsers}
                    icon={Users}
                    trend="+12% so với tháng trước"
                    color="green"
                />
                <StatCard
                    title="Hoạt động hôm nay"
                    value={MOCK_ADMIN_STATS.activeToday}
                    icon={TrendingUp}
                    color="blue"
                />
                <StatCard
                    title="Tổng món ăn"
                    value={MOCK_ADMIN_STATS.totalFoods}
                    icon={Utensils}
                    color="orange"
                />
                <StatCard
                    title="Báo cáo mới"
                    value={MOCK_ADMIN_STATS.newReports}
                    icon={Flag}
                    color="red"
                />
            </div>

            {/* Charts & Activities Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registration Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                        Đăng ký mới 7 ngày qua
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_REGISTRATION_CHART}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-stroke)" />
                                <XAxis dataKey="day" stroke="var(--color-chart-axis)" fontSize={12} />
                                <YAxis stroke="var(--color-chart-axis)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid var(--color-chart-stroke)',
                                        borderRadius: '12px',
                                    }}
                                />
                                <Bar dataKey="users" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                        Hoạt động gần đây
                    </h2>
                    <div className="space-y-4">
                        {MOCK_RECENT_ACTIVITIES.map((activity) => {
                            const Icon = activityIcons[activity.type];
                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activityColors[activity.type]}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 truncate">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {activity.user} • {activity.timestamp}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
