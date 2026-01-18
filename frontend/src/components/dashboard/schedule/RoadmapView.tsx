/**
 * Roadmap View Component
 *
 * Displays the long-term goal roadmap (3 months / phases).
 * Shows progress through phases with visual timeline.
 *
 * @see /types/meal-schedule.ts - GoalRoadmap, Phase types
 */

'use client';

import { useMemo } from 'react';
import { GoalRoadmap, Phase } from '@/types/meal-schedule';
import { CheckCircle2, Circle, Lock, Target, TrendingDown, Award } from 'lucide-react';

// ============================================================
// MOCK DATA
// ============================================================

/**
 * Mock roadmap data - will be replaced with API call
 */
const MOCK_ROADMAP: GoalRoadmap = {
    id: 'rm_01',
    userId: 'current_user',
    goal: 'Giảm 7kg trong 3 tháng',
    startWeight: 72,
    targetWeight: 65,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    currentPhase: 1,
    phases: [
        {
            phaseNumber: 1,
            name: 'Tháng 1: Khởi động',
            targetWeightLoss: 2,
            targetCaloriesPerDay: 2400,
            startDate: '2026-01-01',
            endDate: '2026-01-31',
            status: 'active',
            focus: 'Làm quen thâm hụt calo & Cardio nhẹ',
        },
        {
            phaseNumber: 2,
            name: 'Tháng 2: Tăng tốc',
            targetWeightLoss: 2.5,
            targetCaloriesPerDay: 2200,
            startDate: '2026-02-01',
            endDate: '2026-02-28',
            status: 'upcoming',
            focus: 'Tăng cường Protein & Tập kháng lực',
        },
        {
            phaseNumber: 3,
            name: 'Tháng 3: Về đích',
            targetWeightLoss: 2.5,
            targetCaloriesPerDay: 2000,
            startDate: '2026-03-01',
            endDate: '2026-03-31',
            status: 'upcoming',
            focus: 'Duy trì cân nặng & Siết cơ',
        },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-14T00:00:00Z',
};

// ============================================================
// COMPONENT
// ============================================================

export const RoadmapView = () => {
    const roadmap = MOCK_ROADMAP; // TODO: Replace with useQuery

    // Calculate overall progress percentage
    const overallProgress = useMemo(() => {
        const completedPhases = roadmap.phases.filter(p => p.status === 'completed').length;
        const activePhaseProgress = 0.5; // Assume 50% through active phase
        const totalProgress = (completedPhases + (roadmap.phases.some(p => p.status === 'active') ? activePhaseProgress : 0)) / roadmap.phases.length;
        return Math.round(totalProgress * 100);
    }, [roadmap]);

    // Calculate weight lost so far (mock)
    const weightLost = useMemo(() => {
        const completedPhases = roadmap.phases.filter(p => p.status === 'completed');
        return completedPhases.reduce((sum, p) => sum + p.targetWeightLoss, 0);
    }, [roadmap]);

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-green-500 p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Lộ trình mục tiêu</h2>
                            <p className="text-sm text-white/80">{roadmap.goal}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                            Giai đoạn {roadmap.currentPhase}/3
                        </span>
                    </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{roadmap.startWeight}kg</p>
                        <p className="text-xs text-white/70">Ban đầu</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{roadmap.startWeight - weightLost}kg</p>
                        <p className="text-xs text-white/70">Hiện tại</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{roadmap.targetWeight}kg</p>
                        <p className="text-xs text-white/70">Mục tiêu</p>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Tiến độ tổng thể</span>
                        <span>{overallProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Phase Timeline */}
            <div className="p-5">
                <div className="relative flex justify-between">
                    {/* Connection Line (Background) */}
                    <div className="absolute top-4 left-[16.67%] right-[16.67%] h-1 bg-slate-100 -z-0 rounded-full" />

                    {/* Connection Line (Progress) */}
                    <div
                        className="absolute top-4 left-[16.67%] h-1 bg-primary -z-0 rounded-full transition-all duration-500"
                        style={{
                            width: `${((roadmap.currentPhase - 1) / (roadmap.phases.length - 1)) * 66.67}%`,
                        }}
                    />

                    {/* Phase Cards */}
                    {roadmap.phases.map((phase) => (
                        <PhaseCard key={phase.phaseNumber} phase={phase} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// PHASE CARD COMPONENT
// ============================================================

interface PhaseCardProps {
    phase: Phase;
}

const PhaseCard = ({ phase }: PhaseCardProps) => {
    const getStatusStyles = () => {
        switch (phase.status) {
            case 'completed':
                return {
                    iconBg: 'border-green-500 text-green-500 bg-green-50',
                    textColor: 'text-green-700',
                    tagBg: 'bg-green-100 text-green-700',
                };
            case 'active':
                return {
                    iconBg: 'border-primary text-primary bg-primary/10 ring-4 ring-primary/20',
                    textColor: 'text-primary',
                    tagBg: 'bg-primary/10 text-primary',
                };
            default:
                return {
                    iconBg: 'border-slate-300 text-slate-300 bg-slate-50',
                    textColor: 'text-slate-400',
                    tagBg: 'bg-slate-100 text-slate-400',
                };
        }
    };

    const styles = getStatusStyles();

    const StatusIcon = () => {
        switch (phase.status) {
            case 'completed':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'active':
                return <Circle className="w-4 h-4" fill="currentColor" />;
            default:
                return <Lock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="flex flex-col items-center relative z-10 w-1/3">
            {/* Status Icon */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 transition-all ${styles.iconBg}`}
            >
                <StatusIcon />
            </div>

            {/* Phase Info */}
            <div className="text-center px-2">
                <p className={`text-sm font-bold ${styles.textColor}`}>
                    {phase.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingDown className={`w-3 h-3 ${phase.status === 'upcoming' ? 'text-slate-400' : 'text-green-500'}`} />
                    <span className={`text-xs ${phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-600'}`}>
                        -{phase.targetWeightLoss}kg
                    </span>
                </div>

                {/* Focus Tag */}
                {phase.status !== 'upcoming' && (
                    <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] rounded-full font-medium ${styles.tagBg}`}>
                        {phase.focus}
                    </span>
                )}

                {/* Calories Target */}
                <p className="text-[10px] text-slate-400 mt-1">
                    {phase.targetCaloriesPerDay} kcal/ngày
                </p>
            </div>
        </div>
    );
};

export default RoadmapView;
