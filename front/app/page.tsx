import ProgressBadge from "./components/molecules/ProgressBadge";
import HabitList from "./components/organism/HabitList";
import HeaderInfo from "./components/organism/HeaderInfo";
import TodayOverview from "./components/organism/TodayOverview";
import WeeklyChart from "./components/organism/WeeklyChart";
import YearHeatmap from "./components/organism/YearHeatmap";

export default function HomePage() {
  return (
    <>
      <HeaderInfo title="Today" subTitle="Monday 05 may 2026">
        <ProgressBadge completed={6} total={6} />
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
