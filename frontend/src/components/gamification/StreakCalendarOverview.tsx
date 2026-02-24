"use client";

import { UserStreak } from "@/services/streak.service";
import { Tooltip } from "antd";
import { Check, Circle } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

interface StreakCalendarOverviewProps {
    streak: UserStreak | null;
    compact?: boolean;
}

// Mock logic for calendar history since we didn't implement full daily history API yet
// In real app, we would fetch /api/streak/calendar
export function StreakCalendarOverview({ streak, compact }: StreakCalendarOverviewProps) {
    // Generate last 7 days including today
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = moment().subtract(6 - i, 'days');
        return {
            date: d,
            isToday: d.isSame(moment(), 'day'),
            // Simple logic: if streak > 0, assume recent days are completed (simplified)
            // Real logic requires history data. 
            // We'll use streak info: lastCompletedDate
            isCompleted: false // To be calculated
        };
    });

    // Calculate completion based on streak info (simplified approximation)
    /* 
       If lastCompletedDate is today, today is completed.
       If streak was updated yesterday, yesterday was completed.
       Since we don't have full history log in this props, we can only confirm 'lastCompletedDate'.
       For better UX, let's just show Today's status accurately, and maybe yesterday if consecutive.
    */

    // For now, render static layout with what we know
    const lastCompleted = streak?.lastCompletedDate ? moment(streak.lastCompletedDate) : null;
    const isTodayDone = lastCompleted && lastCompleted.isSame(moment(), 'day');

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Lịch sử tuần này</h3>
                <div className="text-sm text-slate-500">
                    {streak?.currentStreak || 0} / 30 ngày (Mục tiêu tháng)
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    // Check if this day matches lastCompletedDate
                    const isDone = lastCompleted && day.date.isSame(lastCompleted, 'day');
                    const isFuture = day.date.isAfter(moment(), 'day');

                    // Or if currentStreak > 0, we can assume previous days are done? 
                    // Let's just highlight specific completion for accuracy

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <span className="text-xs font-medium text-slate-400 uppercase">
                                {day.date.format('dd')}
                            </span>
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                                ${isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : day.isToday
                                        ? 'border-emerald-500 text-emerald-500' // Pending for today
                                        : 'bg-slate-50 border-slate-100 text-slate-300'}
                            `}>
                                {isDone ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-bold">{day.date.date()}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(((streak?.currentStreak || 0) / 30) * 100, 100)}%` }}
                />
            </div>
        </div>
    );
}
