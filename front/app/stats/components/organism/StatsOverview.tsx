"use client";

import useHabits from "@/src/habits/hooks/useHabits";
import useStats from "@/src/habits/hooks/useStats";

interface StatsOverviewProps {
    dateRange: string;
}

function CardSkeleton() {
    return (
        <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5 animate-pulse">
            <div className="h-2.5 w-20 bg-border rounded mb-3" />
            <div className="h-6.5 w-14 bg-border rounded mb-2" />
            <div className="h-2.5 w-16 bg-border rounded" />
        </div>
    );
}

const PERIOD_LABEL: Record<string, string> = {
    week: "Last 7 days",
    month: "Last 30 days",
    year: "This year",
};

export default function StatsOverview({ dateRange }: StatsOverviewProps) {
    const { habits } = useHabits();
    const { stats, loading, refreshing } = useStats(dateRange);

    const nonPaused = habits.filter((h) => h.active && !h.paused);
    const avgStreak = nonPaused.length > 0
        ? Math.round(nonPaused.reduce((s, h) => s + h.streak, 0) / nonPaused.length)
        : 0;

    if (loading) {
        return (
            <div className="flex justify-between gap-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    return (
        <div
            className={`flex justify-between gap-3 transition-opacity duration-200 ${refreshing ? "opacity-50" : "opacity-100"}`}
        >
            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Completion rate
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-accent-bright">
                    {stats?.completionRate ?? 0}
                    <span className="text-[14px] font-medium text-text-muted ml-1">%</span>
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">{PERIOD_LABEL[dateRange]}</p>
            </div>

            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Average streak
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-amber">
                    {avgStreak}
                    <span className="text-[14px] font-medium text-text-muted ml-1">days</span>
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">All active habits</p>
            </div>

            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Perfect days
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-green">
                    {stats?.perfectDays ?? 0}
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">100% completion</p>
            </div>

            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Completed
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-text">
                    {stats?.totalCompleted ?? 0}
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">
                    of {stats?.totalExpected ?? 0} expected
                </p>
            </div>
        </div>
    );
}
