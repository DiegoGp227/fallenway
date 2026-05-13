"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useHabits from "@/src/habits/hooks/useHabits";
import { habitColumns } from "./HabitColumns";

export default function HabitTable() {
  const { habits, loading, error } = useHabits();

  const table = useReactTable({
    data: habits,
    columns: habitColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <p className="text-text-muted">Loading habits...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-bg/60">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-text-muted font-medium"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const paused = row.original.paused;
            return (
              <tr
                key={row.id}
                className={`group border-b border-border/50 hover:bg-[rgba(240,20,84,0.04)] transition-colors duration-150 ${paused ? "opacity-50" : ""}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {habits.length === 0 && (
        <p className="text-center text-text-muted py-8">No habits found.</p>
      )}
    </div>
  );
}
