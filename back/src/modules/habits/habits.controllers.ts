import { Request, Response } from "express";
import { ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createHabitSchema, logHabitSchema, reorderHabitsSchema, updateHabitSchema } from "./habits.schemas.js";
import {
  archiveHabit,
  createHabit,
  deleteHabitLog,
  getHabitById,
  getHabits,
  getHabitsToday,
  logHabit,
  reorderHabits,
  updateHabit,
} from "./habits.services.js";

export const getTodayHabits = asyncHandler(async (req: Request, res: Response) => {
  const result = await getHabitsToday(req.user!.id);
  res.status(200).json(result);
});

export const listHabits = asyncHandler(async (req: Request, res: Response) => {
  const habits = await getHabits(req.user!.id);
  res.status(200).json({ habits });
});

export const getHabit = asyncHandler(async (req: Request, res: Response) => {
  const habit = await getHabitById(req.params.id as string, req.user!.id);
  res.status(200).json({ habit });
});

export const createHabitHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = createHabitSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>((acc, err) => {
      acc[err.path.join(".")] = err.message;
      return acc;
    }, {});
    throw new ValidationError("Validation errors", errors);
  }

  const habit = await createHabit(req.user!.id, result.data);
  res.status(201).json({ habit });
});

export const updateHabitHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = updateHabitSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>((acc, err) => {
      acc[err.path.join(".")] = err.message;
      return acc;
    }, {});
    throw new ValidationError("Validation errors", errors);
  }

  const habit = await updateHabit(req.params.id as string, req.user!.id, result.data);
  res.status(200).json({ habit });
});

export const archiveHabitHandler = asyncHandler(async (req: Request, res: Response) => {
  await archiveHabit(req.params.id as string, req.user!.id);
  res.status(200).json({ message: "Habit archived" });
});

export const reorderHabitsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = reorderHabitsSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>((acc, err) => {
      acc[err.path.join(".")] = err.message;
      return acc;
    }, {});
    throw new ValidationError("Validation errors", errors);
  }

  await reorderHabits(req.user!.id, result.data);
  res.status(200).json({ message: "Reordered" });
});

export const deleteHabitLogHandler = asyncHandler(async (req: Request, res: Response) => {
  await deleteHabitLog(req.params.id as string, req.user!.id);
  res.status(200).json({ message: "Log removed" });
});

export const logHabitHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = logHabitSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>((acc, err) => {
      acc[err.path.join(".")] = err.message;
      return acc;
    }, {});
    throw new ValidationError("Validation errors", errors);
  }

  const log = await logHabit(req.params.id as string, req.user!.id, result.data);
  res.status(200).json({ log });
});
