"use client";

import { useEffect, useState } from "react";
import { Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mutate } from "swr";
import { updateHabit, deleteHabit, reorderHabits } from "@/src/habits/services/habits.services";
import { Habit } from "@/src/habits/types/habits.types";
import { habitColumns, HabitTableMeta } from "./HabitColumns";
import Modal from "@/app/components/molecules/Modal";
import { SquarePlus } from "lucide-react";

interface Props {
  data: Habit[];
  loading: boolean;
  error: string | null;
  onEdit: (habit: Habit) => void;
  onAdd: () => void;
}

function SortableRow({ row }: { row: Row<Habit> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.original.id });

  return (
    <tr
      ref={setNodeRef}
      {...attributes}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group border-b border-border/40 last:border-0 hover:bg-[rgba(240,20,84,0.04)] transition-colors duration-150 ${
        row.original.paused ? "opacity-50" : ""
      } ${isDragging ? "opacity-50 bg-surface" : ""}`}
    >
      <td className="pl-3 pr-1 py-3 w-6">
        <span
          {...listeners}
          className="text-text-dim hover:text-text-muted cursor-grab active:cursor-grabbing text-xs select-none block transition-colors"
        >
          ⠿
        </span>
      </td>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default function HabitTable({ data, loading, error, onEdit, onAdd }: Props) {
  const [ordered, setOrdered]           = useState<Habit[]>(data);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  useEffect(() => { setOrdered(data); }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrdered((prev) => {
      const oldIndex = prev.findIndex((h) => h.id === active.id);
      const newIndex = prev.findIndex((h) => h.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      reorderHabits(next.map((h) => h.id));
      return next;
    });
  };

  const handlePause = async (id: string, paused: boolean) => {
    await updateHabit(id, { paused: !paused });
    mutate("habits");
  };

  const handleDelete = async () => {
    if (!deletingHabit) return;
    await deleteHabit(deletingHabit.id);
    setDeletingHabit(null);
    mutate("habits");
  };

  const meta: HabitTableMeta = {
    onEdit,
    onPause: handlePause,
    onDelete: setDeletingHabit,
  };

  const table = useReactTable({
    data: ordered,
    columns: habitColumns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  });

  if (loading) return <p className="text-text-muted py-8 text-center">Loading…</p>;
  if (error)   return <p className="text-accent-bright py-8 text-center">{error}</p>;

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-[10px] border border-border bg-bg/60">
      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={ordered.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-border">
                    <th className="w-6 pl-3 pr-1" />
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>

        {ordered.length === 0 && (
          <p className="text-center text-text-muted py-8 text-[13px]">No habits found.</p>
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-border shrink-0">
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-md border border-dashed border-border text-[13px] font-medium text-text-dim hover:border-accent hover:text-accent-bright transition-colors duration-150 cursor-pointer"
        >
          <SquarePlus /> Add habit
        </button>
      </div>

      {deletingHabit && (
        <Modal onClose={() => setDeletingHabit(null)} maxWidth="max-w-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-text">Delete habit?</p>
              <p className="text-[13px] text-text-muted">
                <span className="text-text font-medium">"{deletingHabit.name}"</span> and all its history will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingHabit(null)}
                className="flex-1 py-2 rounded-[8px] border border-border text-[13px] font-medium text-text-dim hover:border-border-hover hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-[8px] bg-accent border border-accent text-[13px] font-semibold text-white hover:bg-accent-bright transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
