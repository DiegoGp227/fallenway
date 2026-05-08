import { Frequency, LogStatus } from "@prisma/client";
import prisma from "../../db/prisma.js";
import { ForbiddenError, NotFoundError } from "../../errors/appError.js";
import { CreateHabitDTO, UpdateHabitDTO } from "./habits.schemas.js";
import { getDayOfWeekInTimezone, getTodayInTimezone, getWeekBounds } from "./habits.utils.js";

export const getHabits = async (userId: string) => {
  return prisma.habit.findMany({
    where: { userId, active: true },
    include: { subtasks: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
};

export const getHabitById = async (habitId: string, userId: string) => {
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    include: { subtasks: { orderBy: { sortOrder: "asc" } } },
  });

  if (!habit) throw new NotFoundError("Habit not found");
  if (habit.userId !== userId) throw new ForbiddenError("Access denied");

  return habit;
};

export const createHabit = async (userId: string, data: CreateHabitDTO) => {
  const lastHabit = await prisma.habit.findFirst({
    where: { userId, active: true },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const sortOrder = lastHabit ? lastHabit.sortOrder + 1 : 0;

  return prisma.habit.create({
    data: { ...data, userId, sortOrder },
    include: { subtasks: true },
  });
};

export const updateHabit = async (habitId: string, userId: string, data: UpdateHabitDTO) => {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });

  if (!habit) throw new NotFoundError("Habit not found");
  if (habit.userId !== userId) throw new ForbiddenError("Access denied");

  return prisma.habit.update({
    where: { id: habitId },
    data,
    include: { subtasks: { orderBy: { sortOrder: "asc" } } },
  });
};

export const getHabitsToday = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });

  const timezone = user?.timezone ?? "America/Bogota";
  const todayStr = getTodayInTimezone(timezone);
  const dayOfWeek = getDayOfWeekInTimezone(timezone);
  const todayDate = new Date(todayStr + "T00:00:00.000Z");
  const { weekStart, nextWeekStart } = getWeekBounds(todayStr);

  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    include: {
      subtasks: { orderBy: { sortOrder: "asc" } },
      logs: {
        where: { date: { gte: weekStart, lt: nextWeekStart } },
        include: { subtaskLogs: { select: { subtaskId: true } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const result = habits
    .filter((habit) => isDueToday(habit, todayDate, dayOfWeek))
    .map((habit) => {
      const todayLog = habit.logs.find(
        (log) => log.date.getTime() === todayDate.getTime(),
      ) ?? null;

      const base = {
        id: habit.id,
        name: habit.name,
        description: habit.description,
        color: habit.color,
        sortOrder: habit.sortOrder,
        frequency: habit.frequency,
        weekDays: habit.weekDays,
        timesPerWeek: habit.timesPerWeek,
        intervalDays: habit.intervalDays,
        subtasks: habit.subtasks,
        log: todayLog
          ? {
              id: todayLog.id,
              status: todayLog.status,
              note: todayLog.note,
              subtaskLogs: todayLog.subtaskLogs.map((sl) => sl.subtaskId),
            }
          : null,
      };

      if (habit.frequency === Frequency.TIMES_PER_WEEK) {
        const completed = habit.logs.filter(
          (l) => l.status === LogStatus.COMPLETED,
        ).length;
        return { ...base, weekProgress: { completed, target: habit.timesPerWeek! } };
      }

      return base;
    });

  return { date: todayStr, habits: result };
};

type HabitWithLogs = Awaited<ReturnType<typeof prisma.habit.findMany<{
  include: { logs: { include: { subtaskLogs: { select: { subtaskId: true } } } }; subtasks: true };
}>>>[number];

const isDueToday = (habit: HabitWithLogs, todayDate: Date, dayOfWeek: number): boolean => {
  switch (habit.frequency) {
    case Frequency.DAILY:
      return true;

    case Frequency.SPECIFIC_DAYS:
      return habit.weekDays.includes(dayOfWeek);

    case Frequency.TIMES_PER_WEEK: {
      const completed = habit.logs.filter((l) => l.status === LogStatus.COMPLETED).length;
      return completed < (habit.timesPerWeek ?? 1);
    }

    case Frequency.EVERY_N_DAYS: {
      const createdDate = new Date(habit.createdAt.toISOString().split("T")[0] + "T00:00:00.000Z");
      const daysDiff = Math.round(
        (todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysDiff % (habit.intervalDays ?? 1) === 0;
    }

    default:
      return false;
  }
};

export const archiveHabit = async (habitId: string, userId: string) => {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });

  if (!habit) throw new NotFoundError("Habit not found");
  if (habit.userId !== userId) throw new ForbiddenError("Access denied");

  return prisma.habit.update({
    where: { id: habitId },
    data: { active: false, archivedAt: new Date() },
  });
};
