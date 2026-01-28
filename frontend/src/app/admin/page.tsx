/**
 * Admin Dashboard Overview Page
 * 
 * Main admin dashboard with stats, charts, and recent activities.
 */

'use client';

import { Users, Utensils, TrendingUp, Flag, UserPlus, AlertCircle, Ban, Plus, Loader2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/admin.service';
import { AdminDashboardResponse } from '@/types/admin';
import { toast } from 'sonner';

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
    green: 'bg-emerald-500 shadow-emerald-500/20',
    blue: 'bg-blue-500 shadow-blue-500/20',
    orange: 'bg-orange-500 shadow-orange-500/20',
    red: 'bg-rose-500 shadow-rose-500/20',
};

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">{trend}</p>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-2xl ${colorStyles[color]} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// ACTIVITY CONFIG
// ============================================================

const activityIcons: Record<string, React.ElementType> = {
    user_register: UserPlus,
    food_added: Plus,
    report_created: AlertCircle,
    user_banned: Ban,
};

const activityColors: Record<string, string> = {
    user_register: 'bg-emerald-100 text-emerald-600',
    food_added: 'bg-blue-100 text-blue-600',
    report_created: 'bg-orange-100 text-orange-600',
    user_banned: 'bg-rose-100 text-rose-600',
};

// ============================================================
// MAIN PAGE
// ============================================================

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="h-[600px] flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu thực...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng người dùng" value={stats.totalUsers} icon={Users} trend="+12% so với tháng trước" color="green" />
                <StatCard title="Hoạt động hôm nay" value={stats.activeToday} icon={TrendingUp} color="blue" />
                <StatCard title="Tổng món ăn" value={stats.totalFoods} icon={Utensils} color="orange" />
                <StatCard title="Báo cáo mới" value={stats.totalReports} icon={Flag} color="red" />
            </div>

            {/* Consolidated Metrics Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl -mr-48 -mt-48" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                            <div className="w-2 h-8 bg-slate-800 rounded-full" />
                            Tổng quan tăng trưởng (7 ngày)
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Người dùng mới</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Premium mới</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Món ăn mới</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.registrationStats.map((item, index) => ({
                                day: item.day,
                                users: item.users,
                                premium: stats.premiumRegistrationStats[index]?.premium || 0,
                                foods: stats.foodGrowthStats[index]?.foods || 0
                            }))}>
                                <defs>
                                    <linearGradient id="multiUser" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="multiPremium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="multiFood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                />
                                <Area type="monotone" dataKey="users" name="Người dùng" stroke="#10b981" strokeWidth={4} fill="url(#multiUser)" />
                                <Area type="monotone" dataKey="premium" name="Premium" stroke="#3b82f6" strokeWidth={4} fill="url(#multiPremium)" />
                                <Area type="monotone" dataKey="foods" name="Món ăn" stroke="#f59e0b" strokeWidth={4} fill="url(#multiFood)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col h-[520px]">
                    <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 shrink-0">
                        <div className="w-2 h-8 bg-rose-500 rounded-full" />
                        Hoạt động gần đây
                    </h2>
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {stats.recentActivities.length > 0 ? stats.recentActivities.map((activity) => {
                            const Icon = activityIcons[activity.type] || AlertCircle;
                            return (
                                <div key={activity.id} className="flex items-start gap-4 group cursor-default">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${activityColors[activity.type] || 'bg-slate-100 text-slate-600'} transition-transform group-hover:scale-110`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{activity.user}</span>
                                            <span className="text-[10px] text-slate-300">•</span>
                                            <span className="text-[11px] text-slate-400 font-medium">{activity.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center space-y-3">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-3xl">🏜️</div>
                                <p className="text-sm font-black uppercase tracking-widest">Chưa có hoạt động</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* System Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DistributionPie
                    title="Người dùng"
                    data={[
                        { name: 'Hoạt động', value: stats.systemOverview.users.active, color: '#10b981' },
                        { name: 'Đã khoá', value: stats.systemOverview.users.locked, color: '#f43f5e' }
                    ]}
                />
                <DistributionPie
                    title="Món ăn"
                    data={[
                        { name: 'Đã xác nhận', value: stats.systemOverview.foods.verified, color: '#3b82f6' },
                        { name: 'Chưa xác nhận', value: stats.systemOverview.foods.unverified, color: '#94a3b8' }
                    ]}
                />
                <DistributionPie
                    title="Tài khoản"
                    data={[
                        { name: 'Premium', value: stats.systemOverview.accounts.premium, color: '#f59e0b' },
                        { name: 'Miễn phí', value: stats.systemOverview.accounts.free, color: '#64748b' }
                    ]}
                />
            </div>
        </div>
    );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function DistributionPie({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">{title}</h3>
            <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-800">{total}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tổng cộng</span>
                </div>
            </div>
            <div className="mt-6 space-y-3">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-800">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
