"use client";

import useContributions from "@/src/habits/hooks/useContributions";

const DAY_LETTERS = ["D", "L", "M", "X", "J", "V", "S"];

export default function WeeklyChart() {
  const { contributions } = useContributions();

  // Last 7 entries (padded with zeros if fewer exist)
  const last7Raw = contributions.slice(-7);
  const padding = Math.max(0, 7 - last7Raw.length);
  const padded = [...Array(padding).fill(null), ...last7Raw];

  const days = padded.map((c, i) => {
    const isToday = i === 6;
    if (!c) return { label: "—", pct: 0, completed: 0, total: 0, isToday };
    const dow = new Date(c.date + "T00:00:00.000Z").getUTCDay();
    const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
    return { label: DAY_LETTERS[dow], pct, completed: c.completed, total: c.total, isToday };
  });

  const avg = Math.round(days.reduce((s, d) => s + d.pct, 0) / days.length);
  const best = days.reduce((m, d) => (d.pct > m.pct ? d : m), days[0]);

  // vs last week
  const prev7 = contributions.slice(-14, -7);
  const prev7Avg = prev7.length > 0
    ? Math.round(prev7.reduce((s, c) => s + (c.total > 0 ? (c.completed / c.total) * 100 : 0), 0) / prev7.length)
    : 0;
  const vsDiff = avg - prev7Avg;
  const vsLabel = vsDiff >= 0 ? `↑ +${vsDiff}%` : `↓ ${vsDiff}%`;

  // Current streak (consecutive completed days from today backwards)
  let streak = 0;
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].completed > 0) streak++;
    else break;
  }

  return (
    <div className="bg-bg/60 border border-border rounded-[10px] p-3.5 flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-text">Últimos 7 días</span>
        <span className="text-[11px] font-semibold text-accent-bright bg-[rgba(240,20,84,0.12)] border border-[rgba(240,20,84,0.25)] rounded-full px-2 py-0.5">
          {avg}% promedio
        </span>
      </div>

      {/* Chart */}
      <div className="flex gap-2">
        {/* Y axis */}
        <div className="flex flex-col justify-between pb-4.5 shrink-0">
          {[100, 75, 50, 25, 0].map((v) => (
            <span key={v} className="text-[9px] text-text-dim leading-none">{v}</span>
          ))}
        </div>

        {/* Bars + grid */}
        <div className="flex-1 relative overflow-visible">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 bottom-4.5 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-px bg-border" />
            ))}
          </div>

          {/* Bar columns */}
          <div className="flex h-40 gap-1.5 relative z-10">
            {days.map((day, i) => (
              <div
                key={i}
                className="group/bar flex-1 flex flex-col items-center h-full justify-end gap-1.25 relative"
              >
                {/* Tooltip */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover/bar:opacity-100 transition-opacity duration-100 whitespace-nowrap"
                  style={{ bottom: "calc(100% + 6px)" }}
                >
                  <div className="bg-[#0e1023] border border-border-hover rounded-md px-1.5 py-1 text-[10px]">
                    <span className="font-bold text-accent-bright">{day.pct}%</span>
                    <span className="text-text-muted ml-1">{day.completed}/{day.total}</span>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t-[4px] transition-colors cursor-pointer ${
                    day.isToday
                      ? "bg-accent group-hover/bar:bg-accent-bright"
                      : "bg-accent-dark group-hover/bar:bg-[#c0305a]"
                  }`}
                  style={{ height: `${day.pct}%`, minHeight: day.pct > 0 ? 4 : 0 }}
                />

                {/* Label */}
                <span
                  className={`text-[10.5px] font-medium leading-none shrink-0 ${
                    day.isToday ? "text-accent-bright" : "text-text-muted"
                  }`}
                >
                  {day.isToday ? `${day.label}·hoy` : day.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex border-t border-border pt-2.5">
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[10px] text-text-dim uppercase tracking-[0.04em]">Mejor día</span>
          <span className="text-[12px] font-semibold text-green">
            {best.label} · {best.pct}%
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-0.5 border-l border-border pl-3">
          <span className="text-[10px] text-text-dim uppercase tracking-[0.04em]">Racha actual</span>
          <span className="text-[12px] font-semibold text-accent-bright">{streak} días</span>
        </div>
        <div className="flex-1 flex flex-col gap-0.5 border-l border-border pl-3">
          <span className="text-[10px] text-text-dim uppercase tracking-[0.04em]">vs semana ant.</span>
          <span className={`text-[12px] font-semibold ${vsDiff >= 0 ? "text-green" : "text-accent-bright"}`}>
            {vsLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
