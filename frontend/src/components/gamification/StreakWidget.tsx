"use client";

import { streakService, UserStreak } from "@/services/streak.service";
import "@/styles/gamification.css";
import { Check, Flame } from "lucide-react";
import moment from "moment";
import "moment/locale/vi"; // Import Vietnamese locale

moment.locale('vi');

interface StreakWidgetProps {
    streak: UserStreak | null;
    loading?: boolean;
    onClick?: () => void;
}

export function StreakWidget({ streak, loading, onClick }: StreakWidgetProps) {
    if (loading) return <div className="h-40 w-full bg-slate-100 rounded-3xl animate-pulse" />;

    const currentStreak = streak?.currentStreak || 0;

    // Logic to generate last 5 days
    const days = Array.from({ length: 5 }, (_, i) => {
        // Show 5 days: 4 days ago -> Today
        const d = moment().subtract(4 - i, 'days');
        const isToday = d.isSame(moment(), 'day');

        // Logic check streak visualization
        let shouldCheck = false;

        if (streak && streak.currentStreak > 0 && streak.lastCompletedDate) {
            const lastCompleted = moment(streak.lastCompletedDate, 'YYYY-MM-DD');
            const streakStartDate = lastCompleted.clone().subtract(streak.currentStreak - 1, 'days');

            // Check if date 'd' is between streakStartDate and lastCompleted (inclusive)
            if (d.isSameOrAfter(streakStartDate, 'day') && d.isSameOrBefore(lastCompleted, 'day')) {
                shouldCheck = true;
            }
        }

        return {
            label: d.format('dd'), // 'T2', 'T3'...
            isCompleted: shouldCheck,
            isToday: isToday
        };
    });

    return (
        <div
            onClick={onClick}
            className="relative cursor-pointer group bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 rounded-[32px] p-6 shadow-xl shadow-emerald-500/20 text-white overflow-hidden transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-500/30"
        >
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-10 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-4">
                    {/* Header Text */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                            <span className="text-3xl flame-icon">🔥</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black tracking-tighter drop-shadow-sm">
                                {currentStreak} ngày
                            </h3>
                            <p className="text-emerald-50 font-medium text-sm">
                                {currentStreak > 0
                                    ? "Bạn đang duy trì rất tốt!"
                                    : "Bắt đầu chuỗi mới ngay hôm nay!"}
                            </p>
                        </div>
                    </div>

                    {/* Mini Calendar Row */}
                    <div className="flex items-center gap-2 mt-4">
                        {days.map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-emerald-100 uppercase opacity-80">
                                    {day.label}
                                </span>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                                    ${day.isCompleted
                                        ? 'bg-white border-white text-emerald-500'
                                        : 'bg-emerald-600/30 border-emerald-500/50 text-emerald-200'}
                                `}>
                                    {day.isCompleted ? (
                                        <Check className="w-5 h-5 stroke-[4]" />
                                    ) : (
                                        <span className="w-1.5 h-1.5 bg-emerald-200 rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side Mascot/Image - CSS Only representation for now */}
                <div className="hidden md:block relative">
                    {/* Giant glowing flame effect */}
                    <div className="relative">
                        <Flame className="w-32 h-32 text-orange-400 drop-shadow-[0_0_25px_rgba(255,160,0,0.6)] animate-pulse" fill="#fbbf24" strokeWidth={1} />
                        <div className="absolute top-0 right-0 w-full h-full animate-ping opacity-20 bg-orange-400 rounded-full filter blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
