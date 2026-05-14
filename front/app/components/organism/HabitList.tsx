"use client";

import { useState } from "react";
import { mutate } from "swr";
import HabitFormModal from "@/app/habits/components/organism/HabitFormModal";
import { HABITS_TODAY_KEY } from "@/src/habits/hooks/useTodayHabits";
import HabitSistem from "./HabitSistem";
import { SquarePlus } from "lucide-react";

export default function HabitList() {
  const [creating, setCreating] = useState(false);

  const handleClose = () => {
    setCreating(false);
    mutate(HABITS_TODAY_KEY);
  };

  return (
    <div className="bg-bg/60 w-[80%] flex-1 flex flex-col rounded-2xl border border-border min-h-0">
      <div className="flex justify-between px-4 py-3.5 shrink-0">
        <p>Daily Habits</p>
        <p className="text-text-muted">Drag To Reorder</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <HabitSistem />
      </div>

      <div className="px-3.5 py-2 border-t border-border shrink-0">
        <button
          onClick={() => setCreating(true)}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md border border-dashed border-border text-[13px] font-medium text-text-dim hover:border-accent hover:text-accent-bright transition-colors duration-150"
        >
          <SquarePlus /> Add Habit
        </button>
      </div>

      {creating && <HabitFormModal onClose={handleClose} />}
    </div>
  );
}
