"use client";
import useContributions, { Contribution } from "@/src/habits/hooks/useContributions";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LETTERS = ["S","M","T","W","T","F","S"];

interface BarGraphsProps {
    dateRange: string;
}

interface Bar {
    key: string;
    rate: number;
    isHighlight: boolean;
    label: string;
}

function buildDailyBars(contributions: Contribution[], days: number): Bar[] {
    const map = new Map(contributions.map(c => [c.date, c]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    return Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        const dateStr = d.toISOString().split("T")[0];
        const c = map.get(dateStr);
        const rate = c && c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
        const isToday = dateStr === todayStr;
        const isMonday = d.getDay() === 1;

        let label = "";
        if (isToday) label = "today";
        else if (days === 7) label = DAY_LETTERS[d.getDay()];
        else if (isMonday) label = `${d.getMonth() + 1}/${d.getDate()}`;

        return { key: dateStr, rate, isHighlight: isToday, label };
    });
}

function buildYearBars(contributions: Contribution[]): Bar[] {
    const byMonth = new Map<string, { completed: number; total: number }>();
    for (const c of contributions) {
        const key = c.date.slice(0, 7);
        const acc = byMonth.get(key) ?? { completed: 0, total: 0 };
        byMonth.set(key, { completed: acc.completed + c.completed, total: acc.total + c.total });
    }
    const currentMonth = new Date().toISOString().slice(0, 7);
    return Array.from(byMonth.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, { completed, total }]) => ({
            key,
            rate: total > 0 ? Math.round((completed / total) * 100) : 0,
            isHighlight: key === currentMonth,
            label: MONTH_LABELS[parseInt(key.slice(5, 7)) - 1],
        }));
}

function buildBars(contributions: Contribution[], dateRange: string): Bar[] {
    if (dateRange === "year") return buildYearBars(contributions);
    return buildDailyBars(contributions, dateRange === "week" ? 7 : 28);
}

const SKELETON_HEIGHTS = [55, 80, 40, 95, 60, 75, 35, 88, 50, 70, 42, 90, 65, 78];

function BarGraphSkeleton() {
    return (
        <div className="bg-surface border border-border rounded-[10px] flex flex-col overflow-hidden flex-1 min-h-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
                <div className="h-[13px] w-16 bg-border rounded animate-pulse" />
                <div className="h-[11px] w-20 bg-border rounded animate-pulse" />
            </div>
            <div className="px-4 pt-3.5 pb-3 flex-1 flex flex-col min-h-0">
                <div className="flex-1 flex items-end gap-[3px] min-h-[140px] animate-pulse">
                    {SKELETON_HEIGHTS.map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-border rounded-t-[3px]"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
                <div className="flex gap-[3px] pt-[6px]">
                    {SKELETON_HEIGHTS.map((_, i) => (
                        <div key={i} className="flex-1 h-[8px]" />
                    ))}
                </div>
            </div>
        </div>
    );
}

const PERIOD_LABEL: Record<string, string> = { week: "last 7 days", month: "last 28 days", year: "this year" };

export default function BarGraphs({ dateRange }: BarGraphsProps) {
    const { contributions, loading, refreshing } = useContributions();

    if (loading) return <BarGraphSkeleton />;

    const bars = buildBars(contributions, dateRange);
    const maxRate = Math.max(...bars.map(b => b.rate), 1);

    return (
        <div className={`bg-surface border border-border rounded-[10px] flex flex-col overflow-hidden flex-1 min-h-0 transition-opacity duration-200 ${refreshing ? "opacity-50" : "opacity-100"}`}>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
                <span className="text-[13px] font-semibold text-text">Activity</span>
                <span className="text-[11.5px] text-text-dim">{PERIOD_LABEL[dateRange]}</span>
            </div>
            <div className="px-4 pt-3.5 pb-3 flex-1 flex flex-col min-h-0">
                <div className="flex-1 flex items-end gap-[3px] min-h-[140px]">
                    {bars.map((bar) => (
                        <div key={bar.key} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div
                                className={`w-full rounded-t-[3px] min-h-[2px] transition-colors ${
                                    bar.isHighlight ? "bg-accent" : "bg-accent-dark hover:bg-accent/70"
                                }`}
                                style={{ height: `${Math.max((bar.rate / maxRate) * 100, 2)}%` }}
                                title={`${bar.rate}%`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex gap-[3px] pt-[6px]">
                    {bars.map((bar) => (
                        <div key={bar.key} className="flex-1 text-center">
                            {bar.label && (
                                <span className={`text-[9px] ${bar.isHighlight ? "text-accent-bright" : "text-text-dim"}`}>
                                    {bar.label}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
