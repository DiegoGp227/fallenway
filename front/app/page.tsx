import ProgressBadge from "./components/molecules/ProgressBadge";
import HabitList from "./components/organism/HabitList";
import HeaderInfo from "./components/organism/HeaderInfo";
import TodayOverview from "./components/organism/TodayOverview";

export default function HomePage() {
  return (
    <>
      <HeaderInfo title="Today" subTitle="Monday 05 may 2026">
        <ProgressBadge completed={6} total={6} />
      </HeaderInfo>
      <TodayOverview />
      <div className="flex w-full flex-1 gap-7">
        <HabitList />
        <div className="w-[20%] bg-bg/60 rounded-2xl px-4 py-3.5 border border-border">
          <div>
            <div>
              <p>Last 7 Days</p>
            </div>
            <div></div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
