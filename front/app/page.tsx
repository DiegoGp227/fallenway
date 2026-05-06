import HabitList from "./components/organism/HabitList";
import TodayOverview from "./components/organism/TodayOverview";

export default function HomePage() {
  return (
    <>
      <header className="flex justify-between">
        <div>
          <h2>Today</h2>
          <p>Monday 05 may 2026</p>
        </div>
        <div className="flex items-center">
          <div className="border-accent-bright rounded-4xl bg-accent-dark border-2 px-2">
            <p>4/6 Complete</p>
          </div>
        </div>
      </header>
      <TodayOverview />
      <HabitList />
    </>
  );
}
