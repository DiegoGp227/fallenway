"use client";

import useContributions, { Contribution } from "@/src/habits/hooks/useContributions";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

const CELL = 9;
const GAP = 2;
const STEP = CELL + GAP;

const LEVEL_COLORS: Record<number | string, string> = {
  0: "#252840",
  1: "rgba(160,13,56,0.35)",
  2: "rgba(160,13,56,0.65)",
  3: "#a00d38",
  4: "#f01454",
};

function buildGrid(contributions: Contribution[]) {
  const contribMap = new Map(contributions.map((c) => [c.date, c]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const jan1 = new Date(year, 0, 1);

  // Monday on or before Jan 1
  const jan1Dow = jan1.getDay();
  const daysToMonday = jan1Dow === 0 ? 6 : jan1Dow - 1;
  const gridStart = new Date(jan1);
  gridStart.setDate(jan1.getDate() - daysToMonday);

  // Sunday of the current week
  const todayDow = today.getDay();
  const daysToSunday = todayDow === 0 ? 0 : 7 - todayDow;
  const gridEnd = new Date(today);
  gridEnd.setDate(today.getDate() + daysToSunday);

  type Cell = { date: string; level: number | "f"; isToday: boolean };
  const weeks: Cell[][] = [];
  const monthLabels: { weekIndex: number; month: string }[] = [];

  let cursor = new Date(gridStart);
  let weekIndex = 0;
  let completedCount = 0;

  while (cursor <= gridEnd) {
    const week: Cell[] = [];

    for (let d = 0; d < 7; d++) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + d);

      const isBefore = date < jan1;
      const isFuture = date > today;
      const isToday = date.toDateString() === today.toDateString();
      const dateStr = date.toISOString().split("T")[0];

      if (isBefore || isFuture) {
        week.push({ date: dateStr, level: "f", isToday: false });
      } else {
        const contrib = contribMap.get(dateStr);
        const level = contrib?.level ?? 0;
        if (level > 0) completedCount++;
        week.push({ date: dateStr, level, isToday });
      }

      // Month label: first day of a month visible in the grid
      if (!isBefore && !isFuture && date.getDate() === 1 && d === 0) {
        monthLabels.push({ weekIndex, month: MONTHS[date.getMonth()] });
      }
    }

    // Check for month start across all days in week
    for (let d = 0; d < 7; d++) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + d);
      if (date >= jan1 && date <= today && date.getDate() === 1) {
        if (!monthLabels.find((m) => m.weekIndex === weekIndex)) {
          monthLabels.push({ weekIndex, month: MONTHS[date.getMonth()] });
        }
        break;
      }
    }

    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
    weekIndex++;
  }

  return { weeks, monthLabels, completedCount };
}

export default function YearHeatmap() {
  const { contributions } = useContributions();
  const { weeks, monthLabels, completedCount } = buildGrid(contributions);
  const dayLabelWidth = 12;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3.5 flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-text">Este año</span>
        <span className="text-[11px] text-text-dim">{completedCount} días completados</span>
      </div>

      {/* Month labels + grid */}
      <div className="flex flex-col gap-1">
        {/* Month row */}
        <div className="relative" style={{ height: 12, marginLeft: dayLabelWidth + GAP }}>
          {monthLabels.map(({ weekIndex, month }) => (
            <span
              key={month}
              className="absolute text-[9px] text-text-dim leading-none"
              style={{ left: weekIndex * STEP }}
            >
              {month}
            </span>
          ))}
        </div>

        {/* Day labels + grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] shrink-0" style={{ width: dayLabelWidth }}>
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-[8px] text-text-dim text-right leading-none flex items-center justify-end"
                style={{ height: CELL }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(7, ${CELL}px)`,
              gridAutoColumns: CELL,
              gridAutoFlow: "column",
              gap: GAP,
            }}
          >
            {weeks.flatMap((week, wi) =>
              week.map((cell, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={cell.isToday ? "Hoy" : cell.date}
                  style={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 2,
                    backgroundColor:
                      cell.level === "f" ? "transparent" : LEVEL_COLORS[cell.level],
                    border:
                      cell.level === "f" ? "0.5px solid rgba(37,40,64,0.35)" : undefined,
                    boxShadow: cell.isToday ? "0 0 0 1.5px #f5527a" : undefined,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-[9px] text-text-dim">Menos</span>
        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                width: CELL,
                height: CELL,
                borderRadius: 2,
                backgroundColor: LEVEL_COLORS[level],
              }}
            />
          ))}
        </div>
        <span className="text-[9px] text-text-dim">Más</span>
      </div>
    </div>
  );
}
