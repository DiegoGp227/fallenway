import { z } from "zod";

const frequencyEnum = z.enum(["DAILY", "SPECIFIC_DAYS", "TIMES_PER_WEEK", "EVERY_N_DAYS"]);

export const createHabitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  frequency: frequencyEnum.default("DAILY"),
  weekDays: z.array(z.number().int().min(0).max(6)).optional().default([]),
  timesPerWeek: z.number().int().min(1).optional(),
  intervalDays: z.number().int().min(1).optional(),
  categoryId: z.string().optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  frequency: frequencyEnum.optional(),
  weekDays: z.array(z.number().int().min(0).max(6)).optional(),
  timesPerWeek: z.number().int().min(1).nullable().optional(),
  intervalDays: z.number().int().min(1).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  categoryId: z.string().nullable().optional(),
  paused: z.boolean().optional(),
});

export type CreateHabitDTO = z.infer<typeof createHabitSchema>;
export type UpdateHabitDTO = z.infer<typeof updateHabitSchema>;

export const logHabitSchema = z.object({
  status: z.enum(["COMPLETED", "SKIPPED"]),
  note: z.string().optional(),
});

export type LogHabitDTO = z.infer<typeof logHabitSchema>;
