import HabitList from "./components/organism/HabitList";
import TodayOverview from "./components/organism/TodayOverview";

export default function HomePage() {
  return (
    <>
      <header className="flex justify-between w-full">
        <div>
          <h2 className="text-text text-2xl">Today</h2>
          <p className="text-text-muted">Monday 05 may 2026</p>
        </div>
        <div className="flex items-center">
          <div className="border-accent-bright rounded-4xl bg-accent-dark border-2 px-2">
            <p>4/6 Complete</p>
          </div>
        </div>
      </header>
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
