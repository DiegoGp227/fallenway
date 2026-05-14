"use client";
import useContributions, { Contribution } from "@/src/habits/hooks/useContributions";

const WEEKS = 16;
const CELL = 10;

const LEVEL_BG: Record<number, string> = {
    0: "var(--border)",
    1: "rgba(160,13,56,0.35)",
    2: "rgba(160,13,56,0.60)",
    3: "rgba(240,20,84,0.75)",
    4: "var(--accent)",
};

interface ContributionGraphProps {
    dateRange: string;
}

function buildGrid(contributions: Contribution[]) {
    const levelMap = new Map(contributions.map(c => [c.date, c.level]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const daysToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - daysToMon);

    const start = new Date(thisMonday);
    start.setDate(thisMonday.getDate() - (WEEKS - 1) * 7);

    const cells: { dateStr: string; level: number; isFuture: boolean; date: Date }[] = [];
    const cursor = new Date(start);

    for (let w = 0; w < WEEKS; w++) {
        for (let d = 0; d < 7; d++) {
            const dateStr = cursor.toISOString().split("T")[0];
            const isFuture = cursor > today;
            cells.push({
                dateStr,
                level: isFuture ? -1 : (levelMap.get(dateStr) ?? 0),
                isFuture,
                date: new Date(cursor),
            });
            cursor.setDate(cursor.getDate() + 1);
        }
    }
    return cells;
}

function getPeriodStart(dateRange: string): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    if (dateRange === "week") start.setDate(today.getDate() - 6);
    else if (dateRange === "month") start.setDate(today.getDate() - 29);
    else start.setFullYear(today.getFullYear(), 0, 1);
    return start;
}

function ContributionSkeleton() {
    return (
        <div className="bg-surface border border-border rounded-[10px] flex flex-col overflow-hidden flex-1 min-h-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
                <div className="h-[13px] w-24 bg-border rounded animate-pulse" />
                <div className="h-[11px] w-12 bg-border rounded animate-pulse" />
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-3">
                <div
                    className="grid gap-[3px] animate-pulse"
                    style={{
                        gridTemplateRows: `repeat(7, ${CELL}px)`,
                        gridAutoFlow: "column",
                        gridAutoColumns: `${CELL}px`,
                    }}
                >
                    {Array.from({ length: WEEKS * 7 }).map((_, i) => (
                        <div key={i} className="bg-border rounded-[2px]" style={{ width: CELL, height: CELL }} />
                    ))}
                </div>
                <div className="flex items-center gap-[6px]">
                    <div className="h-[10px] w-6 bg-border rounded animate-pulse" />
                    <div className="flex gap-[3px]">
                        {[0,1,2,3,4].map(l => <div key={l} className="bg-border rounded-[2px]" style={{ width: 10, height: 10 }} />)}
                    </div>
                    <div className="h-[10px] w-6 bg-border rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function ContributionGraph({ dateRange }: ContributionGraphProps) {
    const { contributions, loading, refreshing } = useContributions();

    if (loading) return <ContributionSkeleton />;

    const cells = buildGrid(contributions);
    const periodStart = getPeriodStart(dateRange);

    return (
        <div className={`bg-surface border border-border rounded-[10px] flex flex-col overflow-hidden flex-1 min-h-0 transition-opacity duration-200 ${refreshing ? "opacity-50" : "opacity-100"}`}>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
                <span className="text-[13px] font-semibold text-text">Activity map</span>
                <span className="text-[11.5px] text-text-dim">{WEEKS * 7} days</span>
            </div>
            <div className="px-4 py-3.5 flex flex-col gap-3">
                <div
                    className="grid gap-[3px]"
                    style={{
                        gridTemplateRows: `repeat(7, ${CELL}px)`,
                        gridAutoFlow: "column",
                        gridAutoColumns: `${CELL}px`,
                    }}
                >
                    {cells.map(({ dateStr, level, isFuture, date }) => (
                        <div
                            key={dateStr}
                            className="rounded-[2px] transition-opacity hover:opacity-80"
                            style={{
                                width: CELL,
                                height: CELL,
                                background: isFuture ? "var(--border)" : (LEVEL_BG[level] ?? LEVEL_BG[0]),
                                opacity: date >= periodStart ? 1 : 0.25,
                            }}
                            title={dateStr}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-[6px]">
                    <span className="text-[10.5px] text-text-dim">Less</span>
                    <div className="flex gap-[3px]">
                        {[0, 1, 2, 3, 4].map(l => (
                            <div key={l} className="rounded-[2px]" style={{ width: 10, height: 10, background: LEVEL_BG[l] }} />
                        ))}
                    </div>
                    <span className="text-[10.5px] text-text-dim">More</span>
                </div>
            </div>
        </div>
    );
}
