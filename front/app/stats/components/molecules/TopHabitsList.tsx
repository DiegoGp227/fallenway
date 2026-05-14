"use client";
import useStats from "@/src/habits/hooks/useStats";

const MEDALS = ["🥇", "🥈", "🥉"];
const RATE_COLORS = ["text-green", "text-accent-bright", "text-amber"];

interface TopHabitsListProps {
    dateRange: string;
}

function TopHabitsSkeleton() {
    return (
        <div className="bg-bg/60 border border-border rounded-[10px] shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="h-3.25 w-20 bg-border rounded animate-pulse" />
                <div className="h-2.75 w-20 bg-border rounded animate-pulse" />
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-2 animate-pulse">
                {[0, 1, 2].map(i => (
                    <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 bg-completed-bg border border-border rounded-md">
                        <div className="w-5 h-5 bg-border rounded shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <div className="h-3 bg-border rounded w-3/4" />
                            <div className="h-2.5 bg-border rounded w-1/2" />
                        </div>
                        <div className="w-8 h-3.25 bg-border rounded shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const PERIOD_LABEL: Record<string, string> = { week: "last 7 days", month: "last 30 days", year: "this year" };

export default function TopHabitsList({ dateRange }: TopHabitsListProps) {
    const { stats, loading, refreshing } = useStats(dateRange);

    if (loading) return <TopHabitsSkeleton />;

    const top = (stats?.habitRates ?? []).slice(0, 3);

    return (
        <div className={`bg-bg/60 border border-border rounded-[10px] shrink-0 transition-opacity duration-200 ${refreshing ? "opacity-50" : "opacity-100"}`}>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-semibold text-text">Top habits</span>
                <span className="text-[11.5px] text-text-dim">{PERIOD_LABEL[dateRange]}</span>
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-2">
                {top.length === 0 ? (
                    <p className="text-[12px] text-text-dim">No data yet</p>
                ) : (
                    top.map((habit, i) => (
                        <div
                            key={habit.id}
                            className="flex items-center gap-2.5 px-2.5 py-2 bg-completed-bg border border-border rounded-md"
                        >
                            <span className="text-[14px] w-5 text-center shrink-0">{MEDALS[i]}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12.5px] font-medium text-text truncate">{habit.name}</p>
                                <p className="text-[11px] text-text-dim mt-0.5">
                                    Streak: {habit.streak} · Best: {habit.bestStreak}
                                </p>
                            </div>
                            <span className={`text-[13px] font-bold shrink-0 ${RATE_COLORS[i]}`}>
                                {habit.rate}%
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
