"use client";

import useStatsToday from "@/src/habits/hooks/useStatsToday";

export default function TodayOverview() {
  const { stats } = useStatsToday();

  const completed = stats?.completedToday ?? 0;
  const total = stats?.totalToday ?? 0;
  const remaining = total - completed;

  return (
    <div className="flex justify-between gap-3">
      <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
          Completed today
        </p>
        <p className="mt-1 text-[24px] font-bold leading-none text-green">
          {completed}
          <span className="text-[14px] font-medium text-text-muted ml-1">of {total}</span>
        </p>
        <p className="mt-1 text-[11.5px] text-text-dim">
          {remaining === 0 ? "All done!" : `${remaining} habit${remaining !== 1 ? "s" : ""} remaining`}
        </p>
      </div>

      <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
          Longest streak
        </p>
        <p className="mt-1 text-[24px] font-bold leading-none text-amber">
          {stats?.bestStreak ?? 0}
          <span className="text-[14px] font-medium text-text-muted ml-1">days</span>
        </p>
        <p className="mt-1 text-[11.5px] text-text-dim truncate">
          {stats?.bestStreakHabit ?? "—"}
        </p>
      </div>

      <div className="bg-bg/60 border border-border rounded-[10px] w-full px-4 py-3.5">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.5px] text-text-muted">
          Completion rate
        </p>
        <p className="mt-1 text-[24px] font-bold leading-none text-accent-bright">
          {stats?.weeklyRate ?? 0}
          <span className="text-[14px] font-medium text-text-muted ml-1">%</span>
        </p>
        <p className="mt-1 text-[11.5px] text-text-dim">This week</p>
      </div>
    </div>
  );
}
