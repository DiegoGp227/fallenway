"use client";
import useStats from "@/src/habits/hooks/useStats";

const BAR_COLORS = ["bg-accent", "bg-green", "bg-amber"];

interface ProgressForHabitProps {
    dateRange: string;
}

export default function ProgressForHabit({ dateRange }: ProgressForHabitProps) {
    const { stats } = useStats(dateRange);
    const habits = (stats?.habitRates ?? []).slice(0, 6);
    const periodLabel: Record<string, string> = { week: "last 7 days", month: "last 30 days", year: "this year" };

    return (
        <div className="bg-surface border border-border rounded-[10px] flex-shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-semibold text-text">Per habit</span>
                <span className="text-[11.5px] text-text-dim">{periodLabel[dateRange]}</span>
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-[10px]">
                {habits.length === 0 ? (
                    <p className="text-[12px] text-text-dim">No active habits</p>
                ) : (
                    habits.map((habit, i) => (
                        <div key={habit.id} className="flex items-center gap-[10px]">
                            <span className="text-[12px] text-text-muted w-[140px] flex-shrink-0 truncate">
                                {habit.name}
                            </span>
                            <div className="flex-1 h-[6px] bg-border rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                                    style={{ width: `${habit.rate}%` }}
                                />
                            </div>
                            <span className="text-[11.5px] font-semibold text-text-muted w-[32px] text-right flex-shrink-0">
                                {habit.rate}%
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
