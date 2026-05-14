"use client";
import useStats from "@/src/habits/hooks/useStats";

const BAR_COLORS = ["bg-accent", "bg-green", "bg-amber"];

interface ProgressForHabitProps {
    dateRange: string;
}

function ProgressSkeleton() {
    const widths = [87, 72, 91, 55, 68, 43];
    return (
        <div className="bg-bg/60 border border-border rounded-[10px] shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="h-3.25 w-16 bg-border rounded animate-pulse" />
                <div className="h-2.75 w-20 bg-border rounded animate-pulse" />
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-2.5 animate-pulse">
                {widths.map((w, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <div className="w-35 h-3 bg-border rounded shrink-0" />
                        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-border-hover rounded-full" style={{ width: `${w}%` }} />
                        </div>
                        <div className="w-7 h-2.75 bg-border rounded shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const PERIOD_LABEL: Record<string, string> = { week: "last 7 days", month: "last 30 days", year: "this year" };

export default function ProgressForHabit({ dateRange }: ProgressForHabitProps) {
    const { stats, loading, refreshing } = useStats(dateRange);

    if (loading) return <ProgressSkeleton />;

    const habits = (stats?.habitRates ?? []).slice(0, 6);

    return (
        <div className={`bg-bg/60 border border-border rounded-[10px] shrink-0 transition-opacity duration-200 ${refreshing ? "opacity-50" : "opacity-100"}`}>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-semibold text-text">Per habit</span>
                <span className="text-[11.5px] text-text-dim">{PERIOD_LABEL[dateRange]}</span>
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-2.5">
                {habits.length === 0 ? (
                    <p className="text-[12px] text-text-dim">No active habits</p>
                ) : (
                    habits.map((habit, i) => (
                        <div key={habit.id} className="flex items-center gap-2.5">
                            <span className="text-[12px] text-text-muted w-35 shrink-0 truncate">
                                {habit.name}
                            </span>
                            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                                    style={{ width: `${habit.rate}%` }}
                                />
                            </div>
                            <span className="text-[11.5px] font-semibold text-text-muted w-8 text-right shrink-0">
                                {habit.rate}%
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
