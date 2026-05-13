"use client";

import ProgressBadge from "./components/molecules/ProgressBadge";
import HabitList from "./components/organism/HabitList";
import HeaderInfo from "./components/organism/HeaderInfo";
import TodayOverview from "./components/organism/TodayOverview";
import WeeklyChart from "./components/organism/WeeklyChart";
import YearHeatmap from "./components/organism/YearHeatmap";
import useStatsToday from "@/src/habits/hooks/useStatsToday";

function formatDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function HomePage() {
  const { stats } = useStatsToday();

  const completed = stats?.completedToday ?? 0;
  const total = stats?.totalToday ?? 0;

  return (
    <>
      <HeaderInfo title="Today" subTitle={formatDate()}>
        <ProgressBadge completed={completed} total={total} />
      </HeaderInfo>
      <TodayOverview />
      <div className="flex w-full flex-1 gap-7 min-h-0">
        <HabitList />
        <div className="w-[20%] flex flex-col gap-3 min-h-0">
          <WeeklyChart />
          <YearHeatmap />
        </div>
      </div>
    </>
  );
}
