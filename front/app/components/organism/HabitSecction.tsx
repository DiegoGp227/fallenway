"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useLogHabit from "@/src/habits/hooks/useLogHabit";
import { TodayHabit } from "@/src/habits/types/habits.types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatFrequency(habit: TodayHabit): string {
  switch (habit.frequency) {
    case "DAILY":
      return "Every day";
    case "SPECIFIC_DAYS":
      return habit.weekDays.map((d) => DAY_NAMES[d]).join(" · ");
    case "TIMES_PER_WEEK":
      return `${habit.timesPerWeek}× per week`;
    case "EVERY_N_DAYS":
      return `Every ${habit.intervalDays} days`;
  }
}

export default function HabitSecction({ habit }: { habit: TodayHabit }) {
  const { handleLogHabit, handleDeleteLog, loading } = useLogHabit();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  const isCompleted = habit.log?.status === "COMPLETED";
  const isSkipped = habit.log?.status === "SKIPPED";

  const toggle = () => {
    if (loading) return;
    handleLogHabit(habit.id, { status: isCompleted ? "SKIPPED" : "COMPLETED" });
  };

  const skip = () => {
    if (loading) return;
    if (isSkipped) {
      handleDeleteLog(habit.id);
    } else {
      handleLogHabit(habit.id, { status: "SKIPPED" });
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 border-y border-transparent hover:border-border-hover transition-colors duration-150 ${
        isCompleted ? "bg-[#0f1120]" : "hover:bg-[rgba(240,20,84,0.04)]"
      }`}
    >
      <span
        {...listeners}
        className="text-text-dim hover:text-text-muted cursor-grab active:cursor-grabbing text-xs select-none shrink-0 transition-colors"
      >
        ⠿
      </span>

      <button
        onClick={toggle}
        disabled={loading}
        className="shrink-0 w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:cursor-default"
        style={{
          borderColor: isCompleted ? "var(--green)" : "var(--border-hover)",
          backgroundColor: isCompleted ? "var(--green)" : "transparent",
        }}
      >
        {isCompleted && (
          <svg
            className="w-2.5 h-2.5 text-bg"
            viewBox="0 0 12 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1,5 4.5,8.5 11,1" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-[13.5px] font-medium truncate ${
            isCompleted ? "line-through text-text-muted" : "text-text"
          }`}
        >
          {habit.name}
        </p>
        <p className="text-[11.5px] text-text-dim">{formatFrequency(habit)}</p>
      </div>

      {habit.streak > 0 ? (
        <div className="shrink-0 flex items-center gap-1 bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.22)] rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-amber">
          🔥 {habit.streak}
        </div>
      ) : (
        <div className="shrink-0 flex items-center gap-1 bg-[rgba(37,40,64,0.6)] border border-border rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-text-dim">
          — 0
        </div>
      )}

      <button
        onClick={skip}
        disabled={loading}
        className={`shrink-0 text-[11.5px] font-medium border rounded-[6px] px-2 py-0.5 transition-all duration-150 disabled:cursor-default ${
          isSkipped
            ? "text-amber border-[rgba(245,166,35,0.4)] bg-[rgba(245,166,35,0.08)] hover:bg-[rgba(245,166,35,0.15)]"
            : "text-text-dim border-border hover:text-text-muted hover:border-border-hover"
        }`}
      >
        {isSkipped ? "undo skip" : "skip"}
      </button>
    </div>
  );
}
