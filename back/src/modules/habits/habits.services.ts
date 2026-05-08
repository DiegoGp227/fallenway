import prisma from "../../db/prisma.js";
import { ForbiddenError, NotFoundError } from "../../errors/appError.js";
import { CreateHabitDTO, UpdateHabitDTO } from "./habits.schemas.js";

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

export const archiveHabit = async (habitId: string, userId: string) => {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });

  if (!habit) throw new NotFoundError("Habit not found");
  if (habit.userId !== userId) throw new ForbiddenError("Access denied");

  return prisma.habit.update({
    where: { id: habitId },
    data: { active: false, archivedAt: new Date() },
  });
};
