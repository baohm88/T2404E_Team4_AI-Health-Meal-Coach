'use client';

import { Button } from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    Cpu,
    CreditCard,
    Crown,
    Globe,
    Mail,
    Monitor,
    RefreshCcw,
    Save,
    Settings,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// ============================================================
// TYPES & CONSTANTS
// ============================================================

type SettingsTab = 'premium' | 'payment' | 'notifications' | 'system' | 'ai';

interface TabConfig {
    id: SettingsTab;
    label: string;
    icon: any;
    color: string;
}

const TABS: TabConfig[] = [
    { id: 'premium', label: 'Gói Premium', icon: Crown, color: 'text-amber-500' },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard, color: 'text-blue-500' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, color: 'text-rose-500' },
    { id: 'system', label: 'Hệ thống', icon: Monitor, color: 'text-emerald-500' },
    { id: 'ai', label: 'Cấu hình AI', icon: Cpu, color: 'text-purple-500' },
];

export default function SettingsClient() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('premium');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Đã lưu thay đổi cấu hình hệ thống');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700/50">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            <Settings className="w-4 h-4" /> System Control
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                            Cài đặt <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Hệ thống</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                            Quản lý các tham số cốt lõi, cổng thanh toán và cấu hình AI của toàn bộ ứng dụng Health Coach.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-16 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 gap-3"
                        >
                            {isSaving ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                            Lưu cấu hình
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-bold transition-all duration-300 text-left ${isActive
                                        ? 'bg-white shadow-xl shadow-slate-200/50 text-slate-900 border border-slate-100 translate-x-2'
                                        : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 group-hover:bg-white'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span>{tab.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="ml-auto w-1.5 h-6 bg-emerald-500 rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[40px] border border-white shadow-2xl min-h-[600px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                {activeTab === 'premium' && <PremiumSettings />}
                                {activeTab === 'payment' && <PaymentSettings />}
                                {activeTab === 'notifications' && <NotificationSettings />}
                                {activeTab === 'system' && <SystemGeneralSettings />}
                                {activeTab === 'ai' && <AiSettings />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SUB-COMPONENTS (TABS)
// ============================================================

const FormSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const InputField = ({ label, placeholder, type = "text", value }: { label: string, placeholder: string, type?: string, value?: string }) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            defaultValue={value}
            className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
        />
    </div>
);

const ToggleField = ({ label, description, defaultChecked }: { label: string, description: string, defaultChecked?: boolean }) => (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
        <div className="space-y-1">
            <p className="font-bold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 font-medium">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
    </div>
);

function PremiumSettings() {
    return (
        <div className="space-y-10">
            <FormSection title="Cấu hình Gói Nâng cấp" icon={Crown}>
                <InputField label="Giá gói (VNĐ)" placeholder="Vd: 199000" value="199000" />
                <InputField label="Thời hạn gói (Ngày)" placeholder="Vd: 30" value="30" />
                <InputField label="Tên gói hiển thị" placeholder="Vd: Newbie Package" value="Premium AI Coach" />
                <InputField label="Mã giảm giá mặc định" placeholder="Vd: HEALTH10" value="UPGRADE2025" />
            </FormSection>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 font-bold">Đặc quyền Premium</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleField label="Chat AI không giới hạn" description="Cho phép người dùng Premium gửi tin nhắn không hạn chế." defaultChecked />
                    <ToggleField label="Xuất báo cáo PDF" description="Tính năng tạo báo cáo dinh dưỡng định dạng PDF." defaultChecked />
                    <ToggleField label="Ưu tiên hỗ trợ" description="Hiển thị huy hiệu ưu tiên trong hệ thống support." />
                    <ToggleField label="Không quảng cáo" description="Loại bỏ toàn bộ banner quảng cáo trong app." defaultChecked />
                </div>
            </div>
        </div>
    );
}

function PaymentSettings() {
    return (
        <div className="space-y-10">
            <FormSection title="Cấu hình Cổng thanh toán" icon={CreditCard}>
                <InputField label="VNPay TmnCode" placeholder="..." value="AIHC2025" />
                <InputField label="VNPay Hash Secret" placeholder="..." type="password" value="********" />
                <InputField label="Momo Partner Code" placeholder="..." value="MOMO_AIHC" />
                <InputField label="Momo Access Key" placeholder="..." type="password" value="********" />
            </FormSection>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 font-bold">Chế độ vận hành</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleField label="Chế độ Sandbox" description="Sử dụng môi trường thử nghiệm cho toàn bộ thanh toán." defaultChecked />
                    <ToggleField label="Tự động duyệt" description="Tự động nâng cấp Premium ngay sau khi nhận được callback." defaultChecked />
                </div>
            </div>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-10">
            <FormSection title="Cấu hình Email (SMTP)" icon={Mail}>
                <InputField label="SMTP Host" placeholder="smtp.gmail.com" value="smtp.healthcoach.ai" />
                <InputField label="SMTP Port" placeholder="587" value="587" />
                <InputField label="Email gửi đi" placeholder="support@domain.com" value="ai-coach@health-pro.com" />
                <InputField label="SMTP Password" placeholder="..." type="password" value="********" />
            </FormSection>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 font-bold">Thông báo hệ thống</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleField label="Email Welcome" description="Gửi mail chào mừng khi người dùng đăng ký mới." defaultChecked />
                    <ToggleField label="Thông báo bữa ăn" description="Gửi nhắc nhở thời gian ăn uống qua Push Notification." defaultChecked />
                </div>
            </div>
        </div>
    );
}

function SystemGeneralSettings() {
    return (
        <div className="space-y-10">
            <FormSection title="Thông tin Thương hiệu" icon={Globe}>
                <InputField label="Tên ứng dụng" placeholder="..." value="AI Health Coach Portal" />
                <InputField label="Hotline hỗ trợ" placeholder="..." value="1900 8888" />
                <InputField label="Link Fanpage" placeholder="fb.com/..." value="https://facebook.com/aihealthcoach" />
                <InputField label="Email liên hệ" placeholder="..." value="admin@aihc.com" />
            </FormSection>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 font-bold">Trạng thái hệ thống</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleField label="Chế độ bảo trì" description="Tạm thời khóa ứng dụng phía Client để nâng cấp." />
                    <ToggleField label="Mở đăng ký" description="Cho phép người dùng mới tạo tài khoản." defaultChecked />
                    <ToggleField label="Bảo mật 2 lớp" description="Yêu cầu 2FA cho toàn bộ tài khoản Admin." defaultChecked />
                    <ToggleField label="Log Activity" description="Ghi lại toàn bộ nhật ký thay đổi của Admin." defaultChecked />
                </div>
            </div>
        </div>
    );
}

function AiSettings() {
    return (
        <div className="space-y-10">
            <FormSection title="Cấu hình Trí tuệ nhân tạo" icon={Zap}>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Model AI mặc định</label>
                    <select className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all appearance-none cursor-pointer">
                        <option value="gpt-4o">GPT-4o (Khuyên dùng)</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Tiết kiệm)</option>
                    </select>
                </div>
                <InputField label="Temperature" placeholder="0.0 - 1.0" value="0.7" />
                <InputField label="Max Tokens" placeholder="Vd: 2000" value="4000" />
                <InputField label="System Prompt Version" placeholder="..." value="v2.4-stable" />
            </FormSection>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 font-bold">Giới hạn tin nhắn</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="User Free (Cần/Ngày)" placeholder="Vd: 10" value="5" />
                    <InputField label="User Premium (Cần/Ngày)" placeholder="Vd: 100" value="999" />
                </div>
                <ToggleField label="Sử dụng Semantic Cache" description="Tăng tốc độ phản hồi cho các câu hỏi trùng lặp." defaultChecked />
            </div>
        </div>
    );
}
