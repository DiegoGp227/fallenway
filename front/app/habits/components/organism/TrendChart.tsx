"use client";

import useContributions from "@/src/habits/hooks/useContributions";

const DAYS = 30;
const VW = 200;
const VH = 65;
const PT = 4;
const PB = 4;

function xOf(i: number) {
  return (i / (DAYS - 1)) * VW;
}

function yOf(pct: number) {
  return PT + (1 - pct / 100) * (VH - PT - PB);
}

function fmtDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TrendChart() {
  const { contributions } = useContributions();

  const raw = contributions.slice(-DAYS);
  const pad = Math.max(0, DAYS - raw.length);
  const items = [...Array(pad).fill(null), ...raw] as (typeof raw[number] | null)[];

  const pts = items.map((c, i) => ({
    i,
    pct: c && c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0,
    hasData: !!c,
    date: c?.date ?? null,
  }));

  const dataPts = pts.filter((p) => p.hasData);

  const linePath = dataPts
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${xOf(p.i).toFixed(1)},${yOf(p.pct).toFixed(1)}`)
    .join(" ");

  const areaPath =
    dataPts.length > 0
      ? `${linePath} L ${xOf(dataPts.at(-1)!.i).toFixed(1)},${VH} L ${xOf(dataPts[0].i).toFixed(1)},${VH} Z`
      : "";

  const avg =
    dataPts.length > 0
      ? Math.round(dataPts.reduce((s, p) => s + p.pct, 0) / dataPts.length)
      : 0;

  const lastPt = dataPts.at(-1);
  const firstDate = raw[0]?.date;
  const midDate = raw[Math.floor(raw.length / 2)]?.date;

  return (
    <div className="bg-bg/60 border border-border rounded-[10px] p-3.5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-text">30-day trend</span>
        <span className="text-[11px] font-semibold text-accent-bright bg-[rgba(240,20,84,0.12)] border border-[rgba(240,20,84,0.25)] rounded-full px-2 py-0.5">
          {avg}% avg
        </span>
      </div>

      <div className="flex gap-1.5">
        {/* Y labels */}
        <div className="flex flex-col justify-between shrink-0 pb-4">
          <span className="text-[9px] text-text-dim leading-none">100</span>
          <span className="text-[9px] text-text-dim leading-none">50</span>
          <span className="text-[9px] text-text-dim leading-none">0</span>
        </div>

        <div className="flex-1 flex flex-col gap-0.5">
          <svg viewBox={`0 0 ${VW} ${VH}`} width="100%">
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f01454" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f01454" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {[0, 50, 100].map((v) => (
              <line
                key={v}
                x1={0}
                x2={VW}
                y1={yOf(v)}
                y2={yOf(v)}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={0.5}
              />
            ))}

            {/* Area fill */}
            {areaPath && <path d={areaPath} fill="url(#trendFill)" />}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#f01454"
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Today dot */}
            {lastPt && (
              <circle
                cx={xOf(lastPt.i)}
                cy={yOf(lastPt.pct)}
                r={2.5}
                fill="#f01454"
                stroke="#0e1023"
                strokeWidth={1}
              />
            )}
          </svg>

          {/* X labels */}
          <div className="flex justify-between">
            <span className="text-[9px] text-text-dim">
              {firstDate ? fmtDate(firstDate) : ""}
            </span>
            {midDate && (
              <span className="text-[9px] text-text-dim">{fmtDate(midDate)}</span>
            )}
            <span className="text-[9px] text-accent-bright font-medium">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
