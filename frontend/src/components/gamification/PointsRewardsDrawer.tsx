"use client";

import { UserPoint, pointsService } from "@/services/points.service";
import { UserStreak, streakService } from "@/services/streak.service";
import { Drawer, Empty, Tabs } from "antd";
import { motion } from "framer-motion";
import { Calendar, Crown, History, ShoppingBag, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { PointsDisplay } from "./PointsDisplay";
import { StreakDisplay } from "./StreakDisplay";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    points: UserPoint | null;
    streak: UserStreak | null;
}

export function PointsRewardsDrawer({ isOpen, onClose, points, streak }: Props) {
    const [activeTab, setActiveTab] = useState("1");
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && activeTab === "2") {
            loadHistory();
        }
    }, [isOpen, activeTab]);

    const loadHistory = async () => {
        try {
            // @ts-ignore
            const res = await pointsService.getPointHistory(0, 20);
            if (res.success && res.data && res.data.content) {
                setHistory(res.data.content);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    const items = [
        {
            key: '1',
            label: (
                <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> Tổng quan
                </span>
            ),
            children: (
                <div className="space-y-6 py-4">
                    {/* Hero Stats */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-100 font-medium mb-1">Tổng điểm tích lũy</p>
                                <h2 className="text-5xl font-black tracking-tight">
                                    {points?.totalPoints?.toLocaleString() || 0}
                                </h2>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold">
                                Hạng Bạc
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <div className="bg-white/10 rounded-2xl p-4 flex-1 backdrop-blur-sm">
                                <p className="text-emerald-100 text-xs">Tháng này</p>
                                <p className="text-2xl font-bold">{points?.currentMonthPoints?.toLocaleString() || 0}</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 flex-1 backdrop-blur-sm">
                                <p className="text-emerald-100 text-xs">Điểm trung bình/ngày</p>
                                <p className="text-2xl font-bold">45</p>
                            </div>
                        </div>
                    </div>

                    {/* Streak Info */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">🔥</span> Chuỗi bất bại
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Hiện tại</p>
                                <p className="text-3xl font-black text-slate-800">{streak?.currentStreak || 0} ngày</p>
                            </div>
                            <div className="h-10 w-px bg-slate-100" />
                            <div>
                                <p className="text-slate-500 text-sm">Kỷ lục</p>
                                <p className="text-3xl font-black text-slate-400">{streak?.longestStreak || 0} ngày</p>
                            </div>
                            <div className="h-10 w-px bg-slate-100" />
                            <div>
                                <p className="text-slate-500 text-sm">Freeze</p>
                                <p className="text-3xl font-black text-blue-500">{streak?.freezeCount || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: '2',
            label: (
                <span className="flex items-center gap-2">
                    <History className="w-4 h-4" /> Lịch sử
                </span>
            ),
            children: (
                <div className="py-4 space-y-4">
                    {history.length > 0 ? history.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                    ${item.pointsEarned > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    {item.pointsEarned > 0 ? <Sparkles className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700">{item.description || "Hoạt động tích điểm"}</p>
                                    <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                            <span className={`font-black ${item.pointsEarned > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {item.pointsEarned > 0 ? '+' : ''}{item.pointsEarned}
                            </span>
                        </div>
                    )) : (
                        <Empty description="Chưa có lịch sử tích điểm" />
                    )}
                </div>
            )
        },
        {
            key: '3',
            label: (
                <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4" /> Xếp hạng
                </span>
            ),
            children: <div className="py-10 text-center text-slate-400">Tính năng đang phát triển...</div>
        }
    ];

    return (
        <Drawer
            title={
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-slate-800">Rewards & Stats</h2>
                    <div className="flex gap-2">
                        <StreakDisplay streak={streak} />
                        <PointsDisplay points={points} />
                    </div>
                </div>
            }
            placement="right"
            size="large"
            onClose={onClose}
            open={isOpen}
            className="gamification-drawer"
        >
            <Tabs defaultActiveKey="1" items={items} onChange={setActiveTab} />
        </Drawer>
    );
}
