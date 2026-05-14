"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { mutate } from "swr";
import { updateHabit, archiveHabit } from "@/src/habits/services/habits.services";
import { Habit } from "@/src/habits/types/habits.types";
import { habitColumns, HabitTableMeta } from "./HabitColumns";
import { SquarePlus } from "lucide-react";

type Filter = "all" | "active" | "paused" | "archived";

interface Props {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  filter: Filter;
  sortByStreak: boolean;
  onEdit: (habit: Habit) => void;
  onAdd: () => void;
}

function applyFilter(habits: Habit[], filter: Filter): Habit[] {
  switch (filter) {
    case "active": return habits.filter((h) => h.active && !h.paused);
    case "paused": return habits.filter((h) => h.active && h.paused);
    case "archived": return habits.filter((h) => !h.active);
    default: return habits.filter((h) => h.active);
  }
}

export default function HabitTable({ habits, loading, error, filter, sortByStreak, onEdit, onAdd }: Props) {
  const filtered = applyFilter(habits, filter);
  const sorted = sortByStreak
    ? [...filtered].sort((a, b) => b.streak - a.streak)
    : filtered;

  const handlePause = async (id: string, paused: boolean) => {
    await updateHabit(id, { paused: !paused });
    mutate("habits");
  };

  const handleArchive = async (id: string) => {
    await archiveHabit(id);
    mutate("habits");
  };

  const meta: HabitTableMeta = {
    onEdit,
    onPause: handlePause,
    onArchive: handleArchive,
  };

  const table = useReactTable({
    data: sorted,
    columns: habitColumns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  });

  if (loading) return <p className="text-text-muted py-8 text-center">Loading…</p>;
  if (error) return <p className="text-accent-bright py-8 text-center">{error}</p>;

  return (
    <div className="overflow-x-auto rounded-[10px] border border-border bg-bg/60">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border">
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`group border-b border-border/40 last:border-0 hover:bg-[rgba(240,20,84,0.04)] transition-colors duration-150 ${row.original.paused ? "opacity-50" : ""
                }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <p className="text-center text-text-muted py-8 text-[13px]">No habits found.</p>
      )}

      <div className="px-4 py-2.5 border-t border-border">
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-md border border-dashed border-border text-[13px] font-medium text-text-dim hover:border-accent hover:text-accent-bright transition-colors duration-150 cursor-pointer"
        >
          <SquarePlus /> Agregar hábito
        </button>
      </div>
    </div>
  );
}
