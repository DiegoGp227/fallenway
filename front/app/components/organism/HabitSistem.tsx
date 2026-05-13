"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import useTodayHabits from "@/src/habits/hooks/useTodayHabits";
import { reorderHabits } from "@/src/habits/services/habits.services";
import { TodayHabit } from "@/src/habits/types/habits.types";
import HabitSecction from "./HabitSecction";

export default function HabitSistem() {
  const { habits, loading, error } = useTodayHabits();
  const [ordered, setOrdered] = useState<TodayHabit[]>([]);

  useEffect(() => {
    setOrdered(habits);
  }, [habits]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-text-dim text-sm">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10 text-accent-bright text-sm">
        {error}
      </div>
    );
  }

  if (ordered.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-text-dim text-sm">
        No habits for today
      </div>
    );
  }

  const pending = ordered.filter((h) => !h.log || h.log.status === "SKIPPED");
  const completed = ordered.filter((h) => h.log?.status === "COMPLETED");

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ordered.map((h) => h.id)} strategy={verticalListSortingStrategy}>
        {pending.map((habit) => (
          <HabitSecction key={habit.id} habit={habit} />
        ))}

        {completed.length > 0 && pending.length > 0 && (
          <div className="h-px bg-border mx-3.5 my-1" />
        )}

        {completed.map((habit) => (
          <HabitSecction key={habit.id} habit={habit} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
