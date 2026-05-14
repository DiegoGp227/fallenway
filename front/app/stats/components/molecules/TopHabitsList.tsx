"use client";
import useStats from "@/src/habits/hooks/useStats";

const MEDALS = ["🥇", "🥈", "🥉"];
const RATE_COLORS = ["text-green", "text-accent-bright", "text-amber"];

interface TopHabitsListProps {
    dateRange: string;
}

export default function TopHabitsList({ dateRange }: TopHabitsListProps) {
    const { stats } = useStats(dateRange);
    const top = (stats?.habitRates ?? []).slice(0, 3);
    const periodLabel: Record<string, string> = { week: "last 7 days", month: "last 30 days", year: "this year" };

    return (
        <div className="bg-surface border border-border rounded-[10px] flex-shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-semibold text-text">Top habits</span>
                <span className="text-[11.5px] text-text-dim">{periodLabel[dateRange]}</span>
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-2">
                {top.length === 0 ? (
                    <p className="text-[12px] text-text-dim">No data yet</p>
                ) : (
                    top.map((habit, i) => (
                        <div
                            key={habit.id}
                            className="flex items-center gap-[10px] px-[10px] py-2 bg-completed-bg border border-border rounded-[6px]"
                        >
                            <span className="text-[14px] w-5 text-center flex-shrink-0">{MEDALS[i]}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12.5px] font-medium text-text truncate">{habit.name}</p>
                                <p className="text-[11px] text-text-dim mt-0.5">
                                    Streak: {habit.streak} · Best: {habit.bestStreak}
                                </p>
                            </div>
                            <span className={`text-[13px] font-bold flex-shrink-0 ${RATE_COLORS[i]}`}>
                                {habit.rate}%
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
