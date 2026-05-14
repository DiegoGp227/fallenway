"use client";

import useHabits from "@/src/habits/hooks/useHabits";
import useStatsToday from "@/src/habits/hooks/useStatsToday";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatMonthKey(key: string): string {
    if (!key) return "—";
    const [year, month] = key.split("-");
    return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

export default function StatsOverview() {
    const { habits } = useHabits();
    const { stats } = useStatsToday();

    const active = habits.filter((h) => h.active);
    const paused = habits.filter((h) => h.active && h.paused).length;

    const nonPaused = active.filter((h) => !h.paused);
    const avgStreak = nonPaused.length > 0
        ? Math.round(nonPaused.reduce((s, h) => s + h.streak, 0) / nonPaused.length)
        : 0;

    return (
        <div className="flex justify-between gap-3">
            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Completion rate
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-green">
                    {active.length}
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">
                    {paused === 0 ? "None paused" : `${paused} paused`}
                </p>
            </div>

            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Average streak
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-amber">
                    {avgStreak}
                    <span className="text-[14px] font-medium text-text-muted ml-1">days</span>
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">All habits</p>
            </div>

            <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
                    Best month
                </p>
                <p className="mt-1 text-[24px] font-bold leading-none text-accent-bright">
                    {stats?.bestMonthRate ?? 0}
                    <span className="text-[14px] font-medium text-text-muted ml-1">%</span>
                </p>
                <p className="mt-1 text-[11.5px] text-text-dim">
                    {formatMonthKey(stats?.bestMonthKey ?? "")}
                </p>
            </div>
        </div>
    );
}
