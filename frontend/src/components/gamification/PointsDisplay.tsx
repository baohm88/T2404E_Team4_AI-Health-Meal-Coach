"use client";

import { UserPoint } from "@/services/points.service";
import "@/styles/gamification.css";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";

interface PointsDisplayProps {
    points: UserPoint | null;
    loading?: boolean;
}

export function PointsDisplay({ points, loading }: PointsDisplayProps) {
    const [prevPoints, setPrevPoints] = useState(0);
    const [earnedDiff, setEarnedDiff] = useState(0);

    useEffect(() => {
        if (points) {
            if (prevPoints > 0 && points.totalPoints > prevPoints) {
                setEarnedDiff(points.totalPoints - prevPoints);
                setTimeout(() => setEarnedDiff(0), 2000);
            }
            setPrevPoints(points.totalPoints);
        }
    }, [points, prevPoints]);

    if (loading) return <div className="h-12 w-32 bg-slate-100 rounded-xl animate-pulse" />;
    if (!points) return null;

    return (
        <div className="relative flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <span className="text-2xl coin-icon">🪙</span>
            <div className="flex flex-col leading-tight">
                <span className="text-xl font-black text-yellow-700">
                    {points.totalPoints.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-500">điểm thưởng</span>
            </div>

            {earnedDiff > 0 && (
                <div className="points-popup absolute -top-8 left-1/2 -translate-x-1/2">
                    +{earnedDiff}
                </div>
            )}
        </div>
    );
}
