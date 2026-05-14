"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { createHabit, updateHabit } from "@/src/habits/services/habits.services";
import { Habit } from "@/src/habits/types/habits.types";
import Modal from "@/app/components/molecules/Modal";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface FormValues {
  name: string;
  description: string;
  frequency: "DAILY" | "SPECIFIC_DAYS" | "TIMES_PER_WEEK" | "EVERY_N_DAYS";
  weekDays: number[];
  timesPerWeek: number;
  intervalDays: number;
}

interface Props {
  habit?: Habit;
  onClose: () => void;
}

export default function HabitFormModal({ habit, onClose }: Props) {
  const isEdit = !!habit;

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        frequency: "DAILY",
        weekDays: [],
        timesPerWeek: 3,
        intervalDays: 2,
      },
    });

  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        description: habit.description ?? "",
        frequency: habit.frequency,
        weekDays: habit.weekDays,
        timesPerWeek: habit.timesPerWeek ?? 3,
        intervalDays: habit.intervalDays ?? 2,
      });
    }
  }, [habit, reset]);

  const frequency = watch("frequency");
  const weekDays = watch("weekDays");

  const toggleDay = (day: number) => {
    const current = weekDays ?? [];
    setValue(
      "weekDays",
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort(),
    );
  };

  const onSubmit = async (data: FormValues) => {
    const payload: Record<string, unknown> = {
      name: data.name,
      description: data.description || undefined,
      frequency: data.frequency,
      weekDays: data.frequency === "SPECIFIC_DAYS" ? data.weekDays : [],
      timesPerWeek: data.frequency === "TIMES_PER_WEEK" ? Number(data.timesPerWeek) : undefined,
      intervalDays: data.frequency === "EVERY_N_DAYS" ? Number(data.intervalDays) : undefined,
    };

    if (isEdit) {
      await updateHabit(habit.id, payload);
    } else {
      await createHabit(payload);
    }

    await mutate("habits");
    onClose();
  };

  return (
    <Modal onClose={onClose} title={isEdit ? "Edit habit" : "New habit"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              placeholder="e.g. Morning meditation"
              className="bg-bg border border-border rounded-[8px] px-3 py-2 text-[13.5px] text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
              Description
            </label>
            <input
              {...register("description")}
              placeholder="Optional"
              className="bg-bg border border-border rounded-[8px] px-3 py-2 text-[13.5px] text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
              Frequency
            </label>
            <select
              {...register("frequency")}
              className="bg-bg border border-border rounded-[8px] px-3 py-2 text-[13.5px] text-text focus:outline-none focus:border-accent transition-colors"
            >
              <option value="DAILY">Every day</option>
              <option value="SPECIFIC_DAYS">Specific days</option>
              <option value="TIMES_PER_WEEK">Times per week</option>
              <option value="EVERY_N_DAYS">Every N days</option>
            </select>
          </div>

          {frequency === "SPECIFIC_DAYS" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
                Days
              </label>
              <div className="flex gap-1.5">
                {DAYS.map((name, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`flex-1 py-1.5 rounded-[6px] text-[11.5px] font-medium border transition-all ${
                      weekDays?.includes(i)
                        ? "bg-accent border-accent text-white"
                        : "bg-bg border-border text-text-dim hover:border-border-hover"
                    }`}
                  >
                    {name.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === "TIMES_PER_WEEK" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
                Times per week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                {...register("timesPerWeek")}
                className="bg-bg border border-border rounded-[8px] px-3 py-2 text-[13.5px] text-text focus:outline-none focus:border-accent transition-colors w-24"
              />
            </div>
          )}

          {frequency === "EVERY_N_DAYS" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11.5px] font-medium text-text-muted uppercase tracking-[0.04em]">
                Every N days
              </label>
              <input
                type="number"
                min={2}
                max={30}
                {...register("intervalDays")}
                className="bg-bg border border-border rounded-[8px] px-3 py-2 text-[13.5px] text-text focus:outline-none focus:border-accent transition-colors w-24"
              />
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-[8px] border border-border text-[13px] font-medium text-text-dim hover:border-border-hover hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-[8px] bg-accent border border-accent text-[13px] font-semibold text-white hover:bg-accent-bright transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create habit"}
            </button>
          </div>
      </form>
    </Modal>
  );
}
