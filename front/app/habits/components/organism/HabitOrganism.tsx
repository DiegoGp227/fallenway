"use client";

import { useState } from "react";
import useHabits from "@/src/habits/hooks/useHabits";
import { Habit } from "@/src/habits/types/habits.types";
import HabitTable from "./HabitTable";
import HabitFormModal from "./HabitFormModal";

type Filter = "all" | "active" | "paused";

const TABS: { key: Filter; label: string }[] = [
  { key: "all",    label: "All" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
];

function applyFilter(habits: Habit[], filter: Filter): Habit[] {
  switch (filter) {
    case "active": return habits.filter((h) => h.active && !h.paused);
    case "paused": return habits.filter((h) => h.active && h.paused);
    default:       return habits.filter((h) => h.active);
  }
}

export default function HabitOrganism() {
  const { habits, loading, error } = useHabits();
  const [filter, setFilter]             = useState<Filter>("all");
  const [sortByStreak, setSortByStreak] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [creating, setCreating]         = useState(false);

  const counts: Record<Filter, number> = {
    all:    habits.filter((h) => h.active).length,
    active: habits.filter((h) => h.active && !h.paused).length,
    paused: habits.filter((h) => h.active && h.paused).length,
  };

  const filtered = applyFilter(habits, filter);
  const data = sortByStreak
    ? [...filtered].sort((a, b) => b.streak - a.streak)
    : filtered;

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 flex items-center gap-1.5 ${
                filter === key
                  ? "bg-[rgba(240,20,84,0.15)] text-accent-bright border border-[rgba(240,20,84,0.3)]"
                  : "text-text-muted hover:text-text hover:bg-surface border border-transparent"
              }`}
            >
              {label}
              <span className={`text-[11px] font-semibold ${filter === key ? "text-accent-bright" : "text-text-dim"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortByStreak((s) => !s)}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all duration-150 ${
              sortByStreak
                ? "bg-[rgba(240,20,84,0.15)] text-accent-bright border-[rgba(240,20,84,0.3)]"
                : "text-text-muted border-border hover:text-text hover:border-border-hover"
            }`}
          >
            ↕ Sort by streak
          </button>
        </div>
      </div>

      <HabitTable
        data={data}
        loading={loading}
        error={error}
        onEdit={setEditingHabit}
        onAdd={() => setCreating(true)}
      />

      {(creating || editingHabit) && (
        <HabitFormModal
          habit={editingHabit ?? undefined}
          onClose={() => { setCreating(false); setEditingHabit(null); }}
        />
      )}
    </div>
  );
}
