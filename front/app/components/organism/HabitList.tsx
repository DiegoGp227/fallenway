import HabitSistem from "./HabitSistem";

export default function HabitList() {
  return (
    <div className="bg-bg/60 w-[80%] flex-1 rounded-2xlpy-3.5 rounded-2xl border border-border">
      <div className="flex justify-between px-4 py-3.5">
        <div>
          <p>Daily Habits</p>
        </div>
        <div>
          <p className="text-text-muted">Drag To Reorder</p>
        </div>
      </div>
      <HabitSistem />
    </div>
  );
}
